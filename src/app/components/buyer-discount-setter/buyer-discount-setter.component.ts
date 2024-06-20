import { SysOfferParameter } from './../../models/sys-offer-parameter';
import { BuyerDashboardDto } from './../../models/buyer-dashboard-dto';
import { DatePipe } from '@angular/common';
import { CompanyOfferDto } from './../../models/company-offer-dto';
import { BuyerInvoiceService } from './../../services/buyer-invoice.service';
import { Component, OnInit } from '@angular/core';
import { XpdCompany } from 'src/app/models/xpd-company';
import { DualListComponent } from 'angular-dual-listbox';
import { AppUtil } from 'src/app/app-util';

@Component({
  selector: 'buyer-discount-setter',
  templateUrl: './buyer-discount-setter.component.html',
  styleUrls: ['./buyer-discount-setter.component.css'],
  providers: [DatePipe]
})
export class BuyerDiscountSetterComponent implements OnInit {
  lstAllCompanyOffers: CompanyOfferDto[] = [];
  lstCompanies: CompanyOfferDto[] = [];
  selectedOfferType: string;
  selectionLabel: string;
  discountPercentage: number = 1.0;
  minPercentage: number = 1.0;
  maxPercentage: number = 10.0;
  maxDiscountPercentage: number = 2.0;
  minDiscountPercentage: number = 1.0;
  displayLabel: any;
  valueField: any;
  format: any = DualListComponent.DEFAULT_FORMAT;
  offerStartDate: string;
  offerEndDate: string;
  selectedSuppliers: CompanyOfferDto[] = [];
  numberOfSelectedSuppliers: number = 0;
  buyerDashboardDto: BuyerDashboardDto = {};
  errorOccured: boolean;
  errorMessage: string;
  // Filter Variables Here
  supplierFilterText = '';
  selectedOfferTypeFilter = '';
  filterStartDate = '';
  filterEndDate = '';
  // Select All Variable
  selectAll = false;
  // Sorting Column
  currentSortColumn: string;
  sortAscending = true;
  lstAllOfferTypes: SysOfferParameter[];
  offerTypeObj: SysOfferParameter = {};
  page:any;


  constructor(private buyerService: BuyerInvoiceService, public datepipe: DatePipe) {

   }

  ngOnInit() {
    this.discountPercentage = this.minPercentage;
    this.selectedOfferType = 'Constant';
    this.getSupplierCompanies();
    this.getAllOffers();
  }

  getAllOffers() {
    this.lstAllOfferTypes = [];
    this.buyerService.getAllOfferTypes().subscribe ( suc => {
      let oTypes:SysOfferParameter[] = suc as SysOfferParameter[]
      let allOfferType:SysOfferParameter = {id: 0, description:'All'};
      this.lstAllOfferTypes.push(allOfferType);
      oTypes.forEach(offerType => {
        this.lstAllOfferTypes.push(offerType);
      });
      this.selectedOfferTypeFilter = "0";
      this.filterCompanyOffers();
    }, error => {
      this.showErrorMessage();
    });
  }

  private getSupplierCompanies() {
    this.buyerService.getSupplierComapnies().subscribe(suc => {
      this.lstCompanies = suc as CompanyOfferDto[];
      this.lstAllCompanyOffers = suc as CompanyOfferDto[];
      this.numberOfSelectedSuppliers = 0;
    }, error => {
      console.log(error);
    });
  }

  onPageChange(event: Event) {
    this.page = event;
    document.getElementById("supplierTable").scrollTo(0,0);
  }

  showErrorMessage(message?: string) {
    this.errorOccured = true;
    if (message === undefined || message === '') {
      this.errorMessage = 'An error occurred. Please contact administrator!';
    } else {
      this.errorMessage = message;
    }
    setTimeout(() => {
      this.errorOccured = false;
    }, 8000);
  }

  submitBuyerOffer() {
    const sDate: Date = new Date(Date.parse(this.offerStartDate));
    const eDate: Date = new Date(Date.parse(this.offerEndDate));
    if (eDate < sDate) {
      this.showErrorMessage('Offer end date cannot be less than offer start date');
    } else if (this.selectedOfferType === 'Variable' && this.minDiscountPercentage > this.maxDiscountPercentage) {
      this.showErrorMessage('Minimum percentage cannot be more than maximum percentage');
    } else {
      this.selectedSuppliers = [];
      this.lstCompanies.forEach(company => {
        if (company.selected) {
          this.selectedSuppliers.push(company);
        }
      });
      this.buyerService.setSupplierOffers(this.selectedOfferType, this.selectedSuppliers, this.discountPercentage, 
                  this.minDiscountPercentage, this.maxDiscountPercentage, this.offerStartDate, this.offerEndDate).subscribe( suc => {
        if (suc) {
          this.showErrorMessage('New Offer saved successfully');
          this.getSupplierCompanies();
          this.selectAll = false;
        } else {
          this.showErrorMessage('Unexpected error occurred while saving offer');
        }
      });
    }
  }

  offerTypeChanged (offerId:number) {
    this.lstAllOfferTypes.forEach(offer => {
      if (offer.id == offerId)
        this.offerTypeObj = offer;
    });
  }

  selectionChanged(event:any, company:CompanyOfferDto) {
    // if (event.target.checked) {
      if (event) {
      this.numberOfSelectedSuppliers ++;
      if (this.numberOfSelectedSuppliers == 1) {
        if (company.offerType != null && company.offerType != undefined) {
          this.selectedOfferType = String(company.offerType.id);
          this.offerTypeObj = company.offerType;
          this.discountPercentage = company.constantPercentage;
          if (company.minPercentage != null)
            this.minDiscountPercentage = company.minPercentage;
          else
            this.minDiscountPercentage = this.minPercentage;
          if (company.maxPercentage != null) 
            this.maxDiscountPercentage = company.maxPercentage;
          else
            this.maxDiscountPercentage = this.minPercentage
          if (company.offerStartDate != null && company.offerStartDate != undefined) {
            let sDate:Date = new Date(company.offerStartDate);
            this.offerStartDate = this.datepipe.transform(sDate, 'yyyy-MM-dd');
                            
          } else
            this.offerStartDate = "";
          if (company.offerEndDate != null && company.offerEndDate != undefined) {
            let eDate:Date = new Date(company.offerEndDate);
            this.offerEndDate = this.datepipe.transform(eDate,'yyyy-MM-dd');
          } else 
            this.offerEndDate = "";
        }
      }
    }
    else {
      this.numberOfSelectedSuppliers --;
      this.selectAll = false;
    }
      this.selectAll = this.numberOfSelectedSuppliers === this.lstCompanies.length;
  }

  filterCompanyOffers() {
    this.lstCompanies = [];
    let sDate = this.filterStartDate;
    let eDate = this.filterEndDate;
    this.lstCompanies = this.lstAllCompanyOffers.filter(offer => {
      let isValid = false;
      console.log(this.selectedOfferTypeFilter);
      if (offer.offerType !== null) {
        isValid = this.selectedOfferTypeFilter === '0'
        || Number(this.selectedOfferTypeFilter) === offer.offerType.id
        || this.selectedOfferTypeFilter === '';

        isValid = isValid && (this.supplierFilterText === ''
        || offer.companyName.toLowerCase().indexOf(this.supplierFilterText.toLowerCase()) !== -1);
        if (sDate !== '') {
        sDate = this.filterStartDate;
        sDate = sDate + ' 00:00:00';
        }

        isValid = isValid && (sDate === ''
        || AppUtil.checkGreaterThanFromDate(new Date(sDate), new Date(offer.offerStartDate)));

        if (eDate !== '') {
        eDate = this.filterEndDate;
        eDate = eDate + ' 23:59:59';
        }

        isValid = isValid && (eDate === ''
        || AppUtil.checkLessThanToDate(new Date(eDate), new Date(offer.offerEndDate)));
      } else {
        return false;
      }
      return isValid;
    });
  }

  resetAllFilters() {
    this.supplierFilterText = '';
    this.filterEndDate = '';
    this.filterStartDate = '';
    this.selectedOfferTypeFilter = '';
    this.filterCompanyOffers();
  }

  selectAllCompanyOffers(check: boolean) {
    if (check) {
      this.numberOfSelectedSuppliers = 0;
      this.lstCompanies.forEach((companyOffer) => {
        companyOffer.selected = check;
        this.numberOfSelectedSuppliers ++;
      });
    } else {
      this.numberOfSelectedSuppliers = 0;
      this.lstCompanies.forEach((companyOffer) => {
        companyOffer.selected = check;
      });
    }
  }

  sortCompanyOffers(sortColumn: string) {
    if (this.currentSortColumn === '') {
      this.currentSortColumn = sortColumn;
    } else {
      if (sortColumn === this.currentSortColumn) {
        this.sortAscending = !this.sortAscending;
      } else {
        this.currentSortColumn = sortColumn;
        this.sortAscending = true;
      }
    }
    if (sortColumn === 'supplier') {
      this.lstCompanies = this.lstCompanies.sort((offer1, offer2) => {
        return this.compareValuesForSort(offer1.companyName, offer2.companyName);
      });
    } else if (sortColumn === 'offerType') {
      this.lstCompanies = this.lstCompanies.sort((offer1, offer2) => {
        return this.compareValuesForSort(offer1.offerType.description, offer2.offerType.description);
      });
    } else if (sortColumn === 'constantPercentage') {
      this.lstCompanies = this.lstCompanies.sort((offer1, offer2) => {
        return this.compareValuesForSort(offer1.constantPercentage, offer2.constantPercentage);
      });
    } else if (sortColumn === 'minPercentage') {
      this.lstCompanies = this.lstCompanies.sort((offer1, offer2) => {
        return this.compareValuesForSort(offer1.minPercentage, offer2.minPercentage);
      });
    } else if (sortColumn === 'maxPercentage') {
      this.lstCompanies = this.lstCompanies.sort((offer1, offer2) => {
        return this.compareValuesForSort(offer1.maxPercentage, offer2.maxPercentage);
      });
    } else if (sortColumn === 'offerStartDate') {
      this.lstCompanies = this.lstCompanies.sort((offer1, offer2) => {
        return this.compareValuesForSort(offer1.offerStartDate, offer2.offerStartDate);
      });
    } else if (sortColumn === 'offerEndDate') {
      this.lstCompanies = this.lstCompanies.sort((offer1, offer2) => {
        return this.compareValuesForSort(offer1.offerEndDate, offer2.offerEndDate);
      });
    } else {
      //
    }
}

  compareValuesForSort(first: any, second: any) {
    if (this.sortAscending) {
              if (first > second) {
                return 1;
              }
              if (first < second) {
                return -1;
              }
      } else {
            if (first < second) {
              return 1;
            }
            if (first > second) {
              return -1;
            }
    }
    return 0;
  }

  }
