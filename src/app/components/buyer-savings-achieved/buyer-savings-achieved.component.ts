import { DatePipe } from '@angular/common';
import { AppUtil } from './../../app-util';
import { BuyerDashboardDto } from './../../models/buyer-dashboard-dto';
import { InvoiceDto } from './../../models/invoice-dto';
import { BuyerInvoiceService } from './../../services/buyer-invoice.service';
import { XpdOrgMaster } from './../../models/xpd-org-master';
import { Component, OnInit } from '@angular/core';
import { SupplierInvoiceServiceService } from '../../services/supplier-invoice-service.service';
import { CogServiceService } from '../../services/cog-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-buyer-savings-achieved',
  templateUrl: './buyer-savings-achieved.component.html',
  styleUrls: ['./buyer-savings-achieved.component.css'],
  providers: [DatePipe]
})
export class BuyerSavingsAchievedComponent implements OnInit {
  p: any;
  lstCompanyLocations:XpdOrgMaster[];
  selectedLocation:string;
  lstInvoices:InvoiceDto[];
  lstAllInvoices:InvoiceDto[];
  buyerDashboardDto:BuyerDashboardDto = {};
  totalInvoices:number=0;
  totalAmount:number=0;
  disAmount:number=0;
  netAmount:number=0;
  disPercent:number;
  totalSupplier:number;
  averageAPR:number;
  selectedSubmissionDate:Date;
  currentSortColumn:string = "";
  sortAscending:boolean = true; // Asc Desc
  supplierFilterText:string="";
  filterStartDate:string;
  filterEndDate:string;
  totalSuppliers:string[] = [];
  showWaiting:boolean = false;
  errorOccured:boolean = false;
  errorMessage:string = "An error occurred. Please contact us at info@xpedize.com";
  invoiceNumberText:string;

  constructor(private buyerInvoiceService: BuyerInvoiceService, private supplierInvoiceService: SupplierInvoiceServiceService,
  private cognito: CogServiceService, private router: Router, private datePipe:DatePipe) {
    if(this.cognito.getCurrentUser() == undefined || this.cognito.getCurrentUser()=='' || this.cognito.getCurrentUser() == null) {
      AppUtil.reDirectToLogin(router);
    }
  }

  ngOnInit() {
    this.errorOccured = false;
    this.supplierFilterText = "";
    this.invoiceNumberText = "";

    let toDate:Date = new Date(Date.now());
    let fromDate:Date = new Date(Date.now());
    fromDate.setDate(toDate.getDate()-30);
    this.filterStartDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    this.filterEndDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');

    this.supplierInvoiceService.getLocations().subscribe (suc => {
      this.lstCompanyLocations = suc;
      let xpdOrgMaster:XpdOrgMaster = {
        id:0,
        name:"All"
      };
      this.lstCompanyLocations.push(xpdOrgMaster);
      this.selectedLocation = 'All';
      if (suc.length > 0) {
        this.lstCompanyLocations.fill(suc[0],suc.length-1,suc.length);
        this.lstCompanyLocations.fill(xpdOrgMaster,0,1);
      }
      this.getInvoicesForLocation(0);
    }, error => {
      this.showErrorMessage();
    });
    this.loadDashboardData();
  }
  loadDashboardData() {
    this.buyerInvoiceService.getDashboardData().subscribe (suc => {
      this.buyerDashboardDto = suc;
    }, error => {
      this.showErrorMessage();
    });
  }


  getInvoicesForLocation(selectedLocationId:number) {
    this.loadInvoices();
  }

  loadInvoices() {
    this.lstInvoices = [];
    this.resetConsolidatedValues();
    this.showWaiting = true;
    this.buyerInvoiceService.getPaidInvoices(this.selectedLocation,this.supplierFilterText, this.filterStartDate,this.filterEndDate, this.invoiceNumberText).subscribe (suc => {
      this.lstInvoices = suc;
      this.lstAllInvoices = suc;
      this.setupInvoiceValues();
      this.updateDashoardRow();
      this.filterInvoiceList();
      this.showWaiting = false;
    }, error => {
      this.showWaiting = false;
      this.showErrorMessage();
    });
  }

  setupInvoiceValues() {
    this.lstInvoices.forEach(element => {
      element.xpdInvoice.selected = false
      element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
      element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);
      element.xpdInvoice.newDueDate = new Date(element.xpdInvoice.newDueDate);
      let dateDifference = element.xpdInvoice.dueDate.valueOf() - element.xpdInvoice.clearingDate.valueOf();
      let daysRemaining = Math.ceil(dateDifference / (1000 * 3600 * 24));
      element.daysRemaining = daysRemaining;
      element.xpdInvoice.clearingDate = new Date(element.xpdInvoice.clearingDate);
    });
    this.lstAllInvoices.forEach(element => {
      element.xpdInvoice.selected = false
      element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
      element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);
      element.xpdInvoice.newDueDate = new Date(element.xpdInvoice.newDueDate);
      let dateDifference = element.xpdInvoice.dueDate.valueOf() - element.xpdInvoice.clearingDate.valueOf();
      let daysRemaining = Math.ceil(dateDifference / (1000 * 3600 * 24));
      element.daysRemaining = daysRemaining;
      element.xpdInvoice.clearingDate = new Date(element.xpdInvoice.clearingDate);
    });
  }

  resetConsolidatedValues() {
    this.totalInvoices=0;
    this.totalAmount=0;
    this.disAmount=0;
    this.netAmount=0;
    this.totalSupplier = 0;
    this.averageAPR = 0;
  }

  updateDashoardRow() {
    this.resetConsolidatedValues();
    this.totalInvoices = this.lstInvoices.length;
    let average:number = 0;
    this.totalSuppliers = [];
    this.lstInvoices.forEach(invoiceDto =>{
      let companyName:string = invoiceDto.xpdInvoice.companyName;
      if (this.totalSuppliers.indexOf(companyName)== -1)
        this.totalSuppliers.push(companyName);
      this.totalAmount += invoiceDto.xpdInvoice.dueAmount;
      average += invoiceDto.xpdInvoice.annualPercentage;
      this.disAmount += invoiceDto.xpdInvoice.discountAmount;
      this.netAmount += invoiceDto.xpdInvoice.netAmount;
    });
    this.totalSupplier = this.totalSuppliers.length;
    this.averageAPR = average/this.lstInvoices.length;
  }

  showErrorMessage(message?:string) {
    this.errorOccured = true;
    if (message === undefined || message === "") 
      this.errorMessage = "An error occurred. Please contact us at info@xpedize.com";
    else
      this.errorMessage = message;
  }

  filterInvoiceList() {
    this.lstInvoices = this.lstAllInvoices.filter(invoice => {
      let isValid:boolean = false;
      isValid = this.supplierFilterText=="" || invoice.xpdInvoice.companyName.toLowerCase().indexOf(this.supplierFilterText.toLowerCase()) != -1;
      isValid = isValid && (this.selectedLocation == "All" || invoice.xpdInvoice.orgMasterName == this.selectedLocation);
      isValid = isValid && (AppUtil.checkDateRange(invoice.xpdInvoice.clearingDate, this.filterStartDate, this.filterEndDate + ' 23:59:59'));
      return isValid;
    });
    this.updateDashoardRow();
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

    if (sortColumn == 'Supplier'){
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.companyName, inv2.xpdInvoice.companyName);
      });
    } else if (sortColumn == 'InvoiceNumber'){
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.invoiceNumber, inv2.xpdInvoice.invoiceNumber);
      });
    } else if (sortColumn=='InvoiceAmount') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.totalTrasactionValue, inv2.xpdInvoice.totalTrasactionValue);
      });
    } else if (sortColumn=='OriginalDueDate') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.dueDate, inv2.xpdInvoice.dueDate);
      });
    } else if (sortColumn=='DiscountPercent') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.annualPercentage, inv2.xpdInvoice.annualPercentage);
      });
    } else if (sortColumn=='DiscountAmount') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.discountAmount, inv2.xpdInvoice.discountAmount);
      });
    } else if (sortColumn=='NetAmount') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.totalTrasactionValue-inv1.xpdInvoice.discountAmount, inv2.xpdInvoice.totalTrasactionValue-inv2.xpdInvoice.discountAmount);
      });
    } else if (sortColumn === 'PaymentDate') {
      this.lstInvoices = this.lstInvoices.sort((inv1, inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.clearingDate, inv2.xpdInvoice.clearingDate);
      });
    }
  }

  onPageChange(event: Event) {
    this.p = event;
    document.getElementById("invoiceTable").scrollTo(0,0);
  }

}
