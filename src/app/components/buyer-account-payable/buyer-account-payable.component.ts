import { AppUtil } from './../../app-util';
import { InvoiceDto } from './../../models/invoice-dto';
import { BuyerDashboardDto } from './../../models/buyer-dashboard-dto';
import { BuyerInvoiceService } from './../../services/buyer-invoice.service';
import { XpdOrgMaster } from './../../models/xpd-org-master';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { SupplierInvoiceServiceService } from '../../services/supplier-invoice-service.service';
import { CogServiceService } from '../../services/cog-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buyer-account-payable',
  templateUrl: './buyer-account-payable.component.html',
  styleUrls: ['./buyer-account-payable.component.css']
})
export class BuyerAccountPayableComponent implements OnInit {
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
  selectedSubmissionDate:Date;
  totalSupplier:number;
  watDays:number;
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
    private cognito: CogServiceService, private router: Router) {
      if(this.cognito.getCurrentUser() == undefined ||
      this.cognito.getCurrentUser()=='' ||
      this.cognito.getCurrentUser() == null) {
        AppUtil.reDirectToLogin(router);
      }
    }

  ngOnInit() {
    this.errorOccured = false;
    this.supplierFilterText = "";
    this.filterStartDate = "";
    this.filterEndDate = "";
    this.invoiceNumberText = "";
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
    this.buyerInvoiceService.getInvoices(0).subscribe (suc => {
      this.lstInvoices = suc;
      this.lstAllInvoices = suc;
      this.setupInvoiceValues();
      this.updateDashoardRow();
      this.filterInvoiceList();
      this.showWaiting = false;
    }, error => {
      this.showErrorMessage();
    });
  }

  setupInvoiceValues() {
    this.lstInvoices.forEach(element => {
      element.xpdInvoice.selected = false
      element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
      element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);      
    });

    this.lstAllInvoices.forEach(element => {
      element.xpdInvoice.selected = false
      element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
      element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);      
    });
    
  }

  resetConsolidatedValues() {
    this.totalInvoices=0;
    this.totalAmount=0;
    this.disAmount=0;
    this.netAmount=0;
    this.totalSuppliers = []
    this.totalSupplier = 0;
  }

  updateDashoardRow() {
    let totalValue:number = 0;
    let totalWeightedValue:number = 0;
    this.resetConsolidatedValues();
    this.totalInvoices = this.lstInvoices.length;
    this.lstInvoices.forEach(invoice =>{
      this.totalAmount += invoice.actualAmountDue;
      let companyName:string = invoice.xpdInvoice.companyName;
      if (this.totalSuppliers.indexOf(companyName)== -1)
        this.totalSuppliers.push(companyName);
      let dateDifference = invoice.xpdInvoice.dueDate.valueOf() - new Date().valueOf();
      let daysRemaining = Math.ceil(dateDifference / (1000 * 3600 * 24));
      invoice.daysRemaining = daysRemaining;
      totalValue += invoice.actualAmountDue;
      totalWeightedValue += invoice.actualAmountDue * daysRemaining;
    });
    this.totalSupplier = this.totalSuppliers.length;
    this.watDays = totalWeightedValue/totalValue;
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
      isValid = isValid && (AppUtil.checkDateRange(invoice.xpdInvoice.dueDate, this.filterStartDate, this.filterEndDate));
      isValid = isValid && (this.invoiceNumberText == "" || invoice.xpdInvoice.invoiceNumber.toLowerCase().indexOf(this.invoiceNumberText.toLowerCase()) != -1);
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
    } else if (sortColumn=='InvoiceDate') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.invoiceDate, inv2.xpdInvoice.invoiceDate);
      });
    } else if (sortColumn=='OriginalDueDate') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.dueDate, inv2.xpdInvoice.dueDate);
      });
    } else if (sortColumn=='DaysRemaining') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.daysRemaining, inv2.daysRemaining);
      });
    } else if (sortColumn=='InvoiceAmount') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.totalTrasactionValue, inv2.xpdInvoice.totalTrasactionValue);
      });
    }
  }

  getStyle() {
      return '#5264AE';
  }
  onPageChange(event: Event) {
    this.p = event;
    document.getElementById("invoiceTable").scrollTo(0,0);
  }

}
