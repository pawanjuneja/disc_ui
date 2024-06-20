import { AppUtil } from './../../app-util';
import { InvoiceDto } from '../../models/invoice-dto';

import { SupplierDashboardDto } from './../../models/supplier-dashboard-dto';
import { XpdOrgMaster } from './../../models/xpd-org-master';
import { Component, OnInit } from '@angular/core';
import { SupplierInvoiceServiceService } from '../../services/supplier-invoice-service.service';
import { CogServiceService } from '../../services/cog-service.service';
import { Router } from '@angular/router';
import { AppConstants } from '../../app-constants';
import { XpdCompany } from '../../models/xpd-company';


@Component({
  selector: 'app-supplier-under-clearing',
  templateUrl: './supplier-under-clearing.component.html',
  styleUrls: ['./supplier-under-clearing.component.css']
})
export class SupplierUnderClearingComponent implements OnInit {
  p: any;
  lstCompanyLocations:XpdOrgMaster[];
  // selectedLocation:number;
  lstInvoices:InvoiceDto[];
  lstTotalInvoices:InvoiceDto[];
  suppierDashboardDto:SupplierDashboardDto = {};
  totalInvoices:number=0;
  totalAmount:number=0;
  disAmount:number=0;
  netAmount:number=0;
  disPercent:number;
  selectedSubmissionDate:string = "";
  currentSortColumn:string;
  sortAscending:boolean = true;
  selectedStatusFilter:string;
  lstFilterValues:string[] = [];
  filterDisplay:string = 'none';
  showWaiting:boolean = false;
  errorOccured:boolean = false;
  errorMessage:string;
  invoiceNumberText:string;
  summaryDiscountPercent:number;


  selectBuyerCompanyId: number;
  lstBuyerCompanies: XpdCompany[] = [];
  selectBuyerCompany: XpdCompany = {};
  selectedLocation: number;

  constructor(private invoiceService: SupplierInvoiceServiceService, private cognito: CogServiceService, private router: Router) {
    if (this.cognito.getCurrentUser() === undefined ||
    this.cognito.getCurrentUser() === '' || this.cognito.getCurrentUser() === null) {
      AppUtil.reDirectToLogin(router);
    }
   }

  ngOnInit() {
    this.errorOccured = false;
    this.invoiceNumberText = "";
    this.selectedSubmissionDate = null;
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
      this.getInvoicesForLocation(this.selectBuyerCompanyId, this.selectedLocation);
    });

    this.loadDashboardData();
  }


  loadDashboardData() {
    this.invoiceService.getDashboardData(this.selectBuyerCompanyId).subscribe (suc => {
      this.suppierDashboardDto = suc;
    }, error => {
      this.showErrorMessage();
    });
  }

  getInvoicesForLocation(selectedBuyerId: number, selectedLocationId: number) {
    this.loadInvoices(selectedBuyerId, selectedLocationId);
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
    this.getInvoicesForLocation(this.selectBuyerCompanyId, this.selectedLocation);
  }

  loadInvoices(selectedBuyerId: number, selectedLocationId: number) {
    this.lstInvoices = [];
    this.showWaiting = true;
    this.resetConsolidatedValues();
    this.invoiceService.getUnderClearingInvoices(selectedBuyerId, selectedLocationId).subscribe (suc => {
      this.lstInvoices = suc;
      this.lstTotalInvoices = suc;
      this.lstInvoices.forEach(element => {
        this.setupInvoiceValues();
      });
      this.updateDashboardRow();
      this.showWaiting = false;
    }, error => {
      this.showErrorMessage();
    });
    this.loadDashboardData();
  }

  // showStatusFilter() {
  //   if (this.filterDisplay == 'none')
  //     this.filterDisplay = 'block';
  //   else {
  //     this.filterDisplay = 'none';
  //     this.selectedStatusFilter = 'All';
  //     this.filterInvoiceList();
  //   }
  // }

  getDiscountAmount(totalValue:number, discountPercentage:number, remainingDays:number):number {
    return AppUtil.getDiscountAmount(totalValue,remainingDays,discountPercentage);
  }

  setupInvoiceValues() {
    this.lstFilterValues = ['All'];
    this.lstInvoices.forEach(element => {
      element.xpdInvoice.selected = false
      element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
      element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);
      element.xpdInvoice.newDueDate = new Date(element.xpdInvoice.newDueDate);
      element.xpdInvoice.submissionDate = new Date(element.xpdInvoice.submissionDate);
      if (this.lstFilterValues.indexOf(element.xpdInvoice.supplierDesc) == -1) 
        this.lstFilterValues.push(element.xpdInvoice.supplierDesc);
    });
    this.selectedStatusFilter = 'All';
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

  checkDateIsSame(firstDate:Date, secondDate:Date) {
    return (firstDate.getDate() == secondDate.getDate() 
    && firstDate.getMonth() == secondDate.getMonth() 
    && firstDate.getFullYear() == secondDate.getFullYear()) 
  }

  showErrorMessage(message?:string) {
    this.errorOccured = true;
    if (message === undefined || message === "") 
      this.errorMessage = "An error occurred. Please contact us at info@xpedize.com";
    else
      this.errorMessage = message;
  }

  filterInvoiceList(event) {
    let selLocation = 'All';

      if (event != undefined) {
        this.selectBuyerCompany.orgMasters.forEach((master) => {
          if (master.id == this.selectedLocation) {
            selLocation = master.name;
          }
        });
      }
    this.lstInvoices = this.lstTotalInvoices.filter(invoice => {
      let isValid:boolean = false;
      isValid = selLocation == "All" || invoice.xpdInvoice.orgMasterName == selLocation;
      // isValid = isValid && (invoice.xpdInvoice.orgMasterName === selLocation);
      isValid = isValid && (this.selectedStatusFilter == 'All' || invoice.xpdInvoice.supplierDesc == this.selectedStatusFilter);
      let submissionDate:Date = new Date(this.selectedSubmissionDate);
      isValid = isValid && ((this.selectedSubmissionDate == null || this.selectedSubmissionDate == "") || AppUtil.checkDateIsSame(submissionDate, invoice.xpdInvoice.submissionDate));
      isValid = isValid && (this.invoiceNumberText == "" || invoice.xpdInvoice.invoiceNumber.toLowerCase().indexOf(this.invoiceNumberText.toLowerCase()) != -1)
      return isValid;
    });
    this.updateDashboardRow();
   }

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
        return this.compareValuesForSort(inv1.xpdInvoice.netAmount, inv2.xpdInvoice.netAmount);
      });
    } else if (sortColumn=='DiscountPercent') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.discountPercent30Days, inv2.xpdInvoice.discountPercent30Days);
      });
    } else if (sortColumn=='NewDueDate') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.newDueDate, inv2.xpdInvoice.newDueDate);
      });
    } else if (sortColumn=='Status') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.supplierDesc, inv2.xpdInvoice.supplierDesc);
      });
    }
  }

    returnStyle(sts: string) {
      return AppUtil.getStyleForSupplierUnderClearing(sts);
    }

    onPageChange(event: Event) {
      this.p = event;
      document.getElementById("invoiceTable").scrollTo(0,0);
    }
}
