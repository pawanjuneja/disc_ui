import { AppUtil } from './../../app-util';
import { InvoiceDto } from '../../models/invoice-dto';
import { SupplierDashboardDto } from './../../models/supplier-dashboard-dto';
import { XpdOrgMaster } from './../../models/xpd-org-master';
import { Component, OnInit } from '@angular/core';
import { SupplierInvoiceServiceService } from '../../services/supplier-invoice-service.service';
import { CogServiceService } from '../../services/cog-service.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { XpdCompany } from '../../models/xpd-company';


@Component({
  selector: 'app-supplier-days-early',
  templateUrl: './supplier-days-early.component.html',
  styleUrls: ['./supplier-days-early.component.css'],
  providers: [DatePipe]
})
export class SupplierDaysEarlyComponent implements OnInit {
  p: any;
  lstCompanyLocations:XpdOrgMaster[];
  // selectedLocation:string;
  lstInvoices:InvoiceDto[];
  lstTotalInvoices:InvoiceDto[];
  suppierDashboardDto:SupplierDashboardDto = {};
  totalInvoices:number=0;
  totalAmount:number=0;
  disAmount:number=0;
  netAmount:number=0;
  disPercent:number;
  selectedSubmissionDate:string;
  currentSortColumn:string;
  sortAscending:boolean = true;
  filterStartDate:string;
  filterEndDate:string;
  showWaiting:boolean = false;
  errorOccured:boolean = false;
  errorMessage:string = "An error occurred. Please contact us at info@xpedize.com";
  invoiceNumberText:string;
  summaryDiscountPercent:number;
  selectBuyerCompanyId: number;
  lstBuyerCompanies: XpdCompany[] = [];
  selectBuyerCompany: XpdCompany = {};
  selectedLocation: number;

  constructor(private invoiceService: SupplierInvoiceServiceService, private router: Router, private cognito: CogServiceService,
                private datePipe:DatePipe) {
    if(this.cognito.getCurrentUser() == undefined || this.cognito.getCurrentUser()=='' || this.cognito.getCurrentUser() === null) {
      AppUtil.reDirectToLogin(router);
    }
   }

  ngOnInit() {
    this.errorOccured = false;
    this.invoiceNumberText = "";
    let toDate:Date = new Date(Date.now());
    let fromDate:Date = new Date(Date.now());
    fromDate.setDate(toDate.getDate()-30);
    this.filterStartDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    this.filterEndDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');

    // this.invoiceService.getBuyerLocations().subscribe (suc => {
    //   this.lstCompanyLocations = suc;
    //   let xpdOrgMaster:XpdOrgMaster = {
    //     id:0,
    //     name:"All"
    //   };
    //   this.lstCompanyLocations.push(xpdOrgMaster);
    //   this.selectedLocation = 'All';
    //   if (suc.length > 0) {
    //     this.lstCompanyLocations.fill(suc[0],suc.length-1,suc.length);
    //     this.lstCompanyLocations.fill(xpdOrgMaster,0,1);
    //   }
    //   this.getInvoicesForLocation(0);
    // }, error => {
    //   this.showErrorMessage();
    //   this.showWaiting = false
    // });
    this.invoiceService.getBuyerCompanies().subscribe((res) => {
      this.lstBuyerCompanies = res;
          this.lstBuyerCompanies.forEach( (company) => {
            const xpdOrgMaster: XpdOrgMaster = {
              id: 0,
              name: 'All'
            };
            if (company.orgMasters.length > 0) {
              company.orgMasters.push(xpdOrgMaster);
              company.orgMasters.fill(company.orgMasters[0], company.orgMasters.length - 1, company.orgMasters.length);
              company.orgMasters.fill(xpdOrgMaster, 0, 1);
            } else {
              company.orgMasters.push(xpdOrgMaster);
            }
          } );
      this.selectBuyerCompany = this.lstBuyerCompanies[0];
      this.selectBuyerCompanyId = this.selectBuyerCompany.id;
      this.selectedLocation = this.selectBuyerCompany.orgMasters[0].id;
      // this.getCompanyInvoiceOffer();
      this.getInvoicesForLocation();
    });


    this.loadDashboardData();
  }

  changeBuyerCompany (event) {
    let buyerId:number = event.target.value as number;
    this.lstBuyerCompanies.forEach(company => {
      if (company.id == buyerId) {
        this.selectBuyerCompany = company;
        this.selectedLocation = this.selectBuyerCompany.orgMasters[0].id;
        this.selectBuyerCompanyId = this.selectBuyerCompany.id;
      }
    });
    this.getInvoicesForLocation();
  }

  loadDashboardData() {
    this.invoiceService.getDashboardData(this.selectBuyerCompanyId).subscribe (suc => {
      this.suppierDashboardDto = suc;
    }, error => {
      this.showErrorMessage();
    });
  }

  getInvoicesForLocation() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.lstInvoices = [];
    this.resetConsolidatedValues();
    this.showWaiting = true;
    this.errorOccured = false;
    // tslint:disable-next-line:max-line-length
    this.invoiceService.getApprovedInvoices(this.selectBuyerCompanyId.toString(), this.selectedLocation.toString(), this.filterStartDate, this.filterEndDate, this.invoiceNumberText).subscribe (suc => {
      this.lstInvoices = suc;
      this.lstTotalInvoices = suc;
      this.lstInvoices.forEach(element => {
        element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);
        element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
        element.xpdInvoice.submissionDate = new Date(element.xpdInvoice.submissionDate);
        element.xpdInvoice.clearingDate = new Date(element.xpdInvoice.clearingDate);
        element.xpdInvoice.newDueDate = new Date(element.xpdInvoice.newDueDate);
      });

      this.lstTotalInvoices.forEach(element => {
        element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);
        element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
        element.xpdInvoice.submissionDate = new Date(element.xpdInvoice.submissionDate);
        element.xpdInvoice.clearingDate = new Date(element.xpdInvoice.clearingDate);
        element.xpdInvoice.newDueDate = new Date(element.xpdInvoice.newDueDate);
      });
      this.updateDashboardRow();
      this.showWaiting = false;
    }, error => {
      this.showErrorMessage();
      this.showWaiting = false;
    });
    this.loadDashboardData();
  }

  resetConsolidatedValues() {
    this.totalInvoices=0;
    this.totalAmount=0;
    this.disAmount=0;
    this.netAmount=0;
  }

  updateDashboardRow() {
    this.resetConsolidatedValues();
    this.totalInvoices = this.lstInvoices.length;
    this.lstInvoices.forEach(invoiceDto =>{
      this.totalAmount += invoiceDto.xpdInvoice.totalTrasactionValue;
      this.disAmount += invoiceDto.xpdInvoice.discountAmount;
      this.netAmount += invoiceDto.xpdInvoice.netAmount;
    });
    this.summaryDiscountPercent = this.disAmount/this.totalAmount*100;
  }

  showErrorMessage(message?:string) {
    this.errorOccured = true;
    if (message === undefined || message === "") 
      this.errorMessage = "An error occurred. Please contact us at info@xpedize.com";
    else
      this.errorMessage = message;
  }

  // filterInvoiceList() {
  //   this.lstInvoices = this.lstTotalInvoices.filter(invoice => {
  //     let isValid:boolean = false;
  //     isValid = this.selectedLocation == "All" || invoice.xpdInvoice.orgMasterName == this.selectedLocation;
  //     isValid = isValid && AppUtil.checkDateRange(invoice.xpdInvoice.clearingDate, this.filterStartDate, this.filterEndDate);
  //     return isValid;
  //   });
  //   this.updateDashboardRow();
  // }

  compareValuesForSort(first:any, second:any) {
    if (this.sortAscending) {
      if (first > second)
        return 1;
      if (first < second)
        return -1;
    } else {
      if (first < second)
        return 1;
      if (first > second)
        return -1;
    }
    return 0;
  }

  sortInvoiceList(sortColumn:string) {
    if (this.currentSortColumn == "") {
      this.currentSortColumn = sortColumn;
    } else {
      if (sortColumn == this.currentSortColumn)
        this.sortAscending = !this.sortAscending;
      else {
        this.currentSortColumn = sortColumn;
        this.sortAscending = true;
      }
    }

    if (sortColumn == 'InvoiceNumber'){
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.invoiceNumber, inv2.xpdInvoice.invoiceNumber);
      });
    } else if (sortColumn=='AmountDue') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.totalTrasactionValue, inv2.xpdInvoice.totalTrasactionValue);
      });
    } else if (sortColumn=='DiscountAmount') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.discountAmount, inv2.xpdInvoice.discountAmount);
      });
    } else if (sortColumn=='NetAmount') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.totalTrasactionValue-inv1.xpdInvoice.discountAmount, inv2.xpdInvoice.totalTrasactionValue-inv2.xpdInvoice.discountAmount);
      });
    } else if (sortColumn=='DiscountPercent') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.discountPercent30Days, inv2.xpdInvoice.discountPercent30Days);
      });
    } else if (sortColumn=='DaysPaidEarly') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.daysRemaining, inv2.xpdInvoice.daysRemaining);
      });
    } else if (sortColumn=='Status') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.supplierDesc, inv2.xpdInvoice.supplierDesc);
      });
    }
  }
  onPageChange(event: Event) {
    this.p = event;
    document.getElementById("invoiceTable").scrollTo(0,0);
  }
}
