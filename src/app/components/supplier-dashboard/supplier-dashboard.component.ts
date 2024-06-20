import { AppUtil } from './../../app-util';
import { XpdOrgMaster } from './../../models/xpd-org-master';
import { SupplierDashboardDto } from './../../models/supplier-dashboard-dto';
import { XpdInvoice } from '../../models/xpd-invoice';

import { Component, OnInit } from '@angular/core';
import { XpdOffer } from '../../models/xpd-offer';
import { InvoiceDto } from '../../models/invoice-dto';
import { SupplierInvoiceServiceService } from '../../services/supplier-invoice-service.service';
import { CogServiceService } from '../../services/cog-service.service';
import { Router } from '@angular/router';
import { XpdCompany } from 'src/app/models/xpd-company';


@Component({
  selector: 'supplier-dashboard',
  templateUrl: './supplier-dashboard.component.html',
  styleUrls: ['./supplier-dashboard.component.css']
})
export class SupplierDashboardComponent implements OnInit {
  p: any;
  lstCompanyLocations: XpdOrgMaster[] = [];
  // Getting Buyer companies for this supplier.
  lstInvoices: XpdInvoice[];
  disPercent: number = 0;
  summaryDiscountPercent:number;
  enableSubmitButton = false;
  nextDueDate:Date = null;
  nextDueDateLabel: string;
  totalInvoices: number = 0;
  totalAmount: number = 0;
  disAmount: number = 0;
  netAmount: number = 0;
  suppierDashboardDto: SupplierDashboardDto = {};
  selectAllInvoice: boolean;
  companyInvoiceOffer:XpdOffer;
  modelDisplay:string = "none";
  offerComments:string;
  selectedInvoices:InvoiceDto[]=[];
  lstInvoicesDto:InvoiceDto[]=[];
  lstAllInvoices:InvoiceDto[]=[];
  currentSortColumn:string;
  sortAscending: boolean = true;
  otp:string = "";
  selectAllInvoiesForOffer:boolean = true;
  showOfferedInvoices:boolean = false;
  showOfferedModal:string = 'none';
  showWaiting:boolean = false;
  errorOccured:boolean = false;
  offeredInvoices:InvoiceDto[] = [];
  incorrectOtp:boolean = false;
  otpErrorMessage:string = "Incorrect OTP or OTP expired"
  errorMessage:string = "An error occurred. Please contact us at info@xpedize.com";
  minPercentage:number = 1.2;
  maxPercentage:number = 10;
  fixedOffer:boolean = false;
  invoiceNumberText:string = "";
  confirmationModel = 'none';
  selectBuyerCompanyId: number;
  lstBuyerCompanies: XpdCompany[] = [];
  selectBuyerCompany: XpdCompany = {};
  selectedLocation: number;
  disableSubmit:boolean = true;

  constructor(private invoiceService: SupplierInvoiceServiceService, private cognito: CogServiceService, private router: Router) {
    if(this.cognito.getCurrentUser() == undefined || this.cognito.getCurrentUser()=='' || this.cognito.getCurrentUser() == null) {
      AppUtil.reDirectToLogin(router);
    }
  }

  ngOnInit() {
    this.errorOccured = false;
    this.disableSubmit = true;
    this.invoiceNumberText = "";
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
      this.getCompanyInvoiceOffer();
      this.getInvoicesForLocation();
      this.loadDashboardData();
    });
    this.selectAllInvoiesForOffer = true;
  }
  
  changeBuyerCompany (event) {
    let buyerId:number = event.target.value as number;
    this.lstInvoicesDto = [];
    this.lstAllInvoices = [];
    this.disableSubmit = true;
    this.lstBuyerCompanies.forEach(company => {
      if (company.id == buyerId) {
        this.selectBuyerCompany = company;
        this.selectedLocation = this.selectBuyerCompany.orgMasters[0].id;
        this.selectBuyerCompanyId = this.selectBuyerCompany.id;
      }
    });
    this.nextDueDate = null;
    this.loadDashboardData();
    this.getInvoicesForLocation();
    this.selectAllInvoices(true);
  }

  getAllCompanyInvoices() {
    this.errorOccured = false;
    this.lstInvoices = [];
    this.selectAllInvoice = false;
    this.showWaiting = true;
    this.invoiceService.getAllInvoices().subscribe (suc => {
      this.lstInvoicesDto = suc;
      this.lstAllInvoices = suc;
      this.setupInvoiceValues();
      this.showWaiting = false;
      this.disableSubmit = false;
    }, error => {
      this.showErrorMessage();
      this.showWaiting = false;
    });
    this.resetConsolidatedValues();
  }

  getInvoicesForLocation() {
    // this.selectedLocation = selectedLocationId;
    // if(selectedLocationId!=0)
      this.loadInvoices();
    // else
      // this.getAllCompanyInvoices();
    this.getCompanyInvoiceOffer();
  }

  loadInvoices() {
    this.resetConsolidatedValues();
    this.errorOccured = false;
    this.lstInvoices = [];
    this.selectAllInvoice = false;
    this.showWaiting = true;
    this.invoiceService.getInvoices(this.selectedLocation, this.selectBuyerCompanyId, this.nextDueDate).subscribe (suc => {
      this.lstInvoicesDto = suc;
      this.lstAllInvoices = suc;
      if (this.lstInvoicesDto.length > 0)
        this.disableSubmit = false;
      this.setupInvoiceValues();
      this.showWaiting = false;
    }, error => {
      this.showErrorMessage();
      this.showWaiting = false;
    });
    // this.loadDashboardData();
  }

  setupInvoiceValues() {
    let selInvoices:InvoiceDto[] = [];
    this.lstInvoicesDto.forEach(element => {
      this.nextDueDate = new Date(element.newPaymentDate);
      element.notesDisplay = 'none';
      element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
      element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);
      if (this.selectAllInvoiesForOffer || this.selectAllInvoice) {
        element.xpdInvoice.selected = true;
        this.selectAllInvoice = true;
        selInvoices.push(element);
      } else if (element.xpdInvoice.selected == true)
        selInvoices.push(element);
      if (this.disPercent != 0) {
        let dateDifference = element.xpdInvoice.dueDate.valueOf() - this.nextDueDate.valueOf();
        let daysRemaining = Math.ceil(dateDifference / (1000 * 3600 * 24));
        element.daysRemaining = daysRemaining;
        element.actualDiscountPercentage = (daysRemaining/30)*this.disPercent;
        element.newDiscountAmount = AppUtil.getDiscountAmount(element.actualAmountDue,element.daysRemaining,this.disPercent);
      }
    });
    this.lstAllInvoices.forEach(element => {
      this.nextDueDate = new Date(element.newPaymentDate);
      element.notesDisplay = 'none';
      element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
      element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);
      if (this.selectAllInvoiesForOffer || this.selectAllInvoice) {
        element.xpdInvoice.selected = true;
        this.selectAllInvoice = true;
      }
      if (this.disPercent != 0) {
        let dateDifference = element.xpdInvoice.dueDate.valueOf() - this.nextDueDate.valueOf();
        let daysRemaining = Math.ceil(dateDifference / (1000 * 3600 * 24));
        element.daysRemaining = daysRemaining;
        element.actualDiscountPercentage = (daysRemaining/30)*this.disPercent;
        element.newDiscountAmount = AppUtil.getDiscountAmount(element.actualAmountDue,element.daysRemaining,this.disPercent);
      }
    });
    this.selectedInvoices = selInvoices;
    if (selInvoices.length > 0)
      this.disableSubmit = false;
    else
      this.disableSubmit = true;
    this.updateDashboardRow();
  }

  loadDashboardData() {
    this.invoiceService.getDashboardData(this.selectBuyerCompanyId).subscribe (suc => {
      this.suppierDashboardDto = suc;
    });
  }

  checkOTPAndSubmitOffer() {
    this.invoiceService.checkOTP(this.otp).subscribe(suc => {
      if (suc)
        this.submitInvoicesForOffer();
      else 
        this.incorrectOtp = true;
    });
  }

  submitInvoicesForOffer() {
    this.closeModalDialog();
    this.errorOccured = false;
    this.errorOccured = false;
    if(this.disPercent > 0) {
      if (this.nextDueDate != null) {
        this.showWaiting = true;
        let selInvoices:XpdInvoice[] = [];
        this.selectedInvoices.forEach(InvoiceDto => {
          selInvoices.push(InvoiceDto.xpdInvoice);
        });
        this.invoiceService.submitInvoicesForOffer(selInvoices, this.disPercent, this.nextDueDate).subscribe(
          result => {
            if(result) {
              this.showWaiting = false;
              this.showOfferedInvoicesModal();
            }
          }, error => {
            this.showErrorMessage();
            this.showWaiting = false;
            this.loadInvoices();
          }
        );
      } else {
        this.showErrorMessage("Please select start date");  
      } 
    }else {
      this.showErrorMessage("Discount percentage should be more than 0 to submit an offer");
    }
  }

  getCompanyInvoiceOffer() {
    this.fixedOffer = false;
    this.minPercentage = 1.2;
    this.maxPercentage = 10.0;
    let selLocation:number = 0;
    this.invoiceService.getCompanyInvoiceOffer(this.selectBuyerCompanyId).subscribe (suc => {
      this.companyInvoiceOffer = suc as XpdOffer;
      if (this.companyInvoiceOffer != null) {
        this.disPercent = this.companyInvoiceOffer.targetAveragePercentage;
        if (this.companyInvoiceOffer.id != undefined && this.companyInvoiceOffer.id!=0) {
          if (this.companyInvoiceOffer.minPercentage != undefined && this.companyInvoiceOffer.minPercentage > 0)
            this.minPercentage = this.companyInvoiceOffer.minPercentage;
          if (this.companyInvoiceOffer.maxPercentage != undefined && this.companyInvoiceOffer.maxPercentage > 0)
            this.maxPercentage = this.companyInvoiceOffer.maxPercentage;
          if ( this.companyInvoiceOffer.fixedOffer) {
            this.fixedOffer = true;
            this.minPercentage = this.companyInvoiceOffer.targetAveragePercentage;
            this.maxPercentage = this.companyInvoiceOffer.targetAveragePercentage;
          }
        }
      }
      this.setupInvoiceValues();
    }, error => {
      this.showErrorMessage();
    });
  }

  resetConsolidatedValues() {
    this.totalInvoices=0;
    this.totalAmount=0;
    this.disAmount=0;
    this.netAmount=0;
    this.summaryDiscountPercent=0;
  }

  updateDashboardRow() {
    this.resetConsolidatedValues();
    this.totalInvoices = this.selectedInvoices.length;
    this.selectedInvoices.forEach(invoice =>{
      this.totalAmount += invoice.actualAmountDue;
      this.disAmount += invoice.newDiscountAmount;
      this.netAmount += invoice.xpdInvoice.totalTrasactionValue - invoice.newDiscountAmount;
    });
    this.summaryDiscountPercent = this.disAmount/this.totalAmount*100;
  }

  updateDashoardRowData(invoice:InvoiceDto) {
    this.totalInvoices = this.selectedInvoices.length;
    if (invoice.xpdInvoice.selected) {
      this.totalAmount += invoice.actualAmountDue;
      this.disAmount += invoice.newDiscountAmount;
      this.netAmount += (invoice.xpdInvoice.totalTrasactionValue - invoice.newDiscountAmount);
    } else {
      this.totalAmount -= invoice.actualAmountDue;
      this.disAmount -= invoice.newDiscountAmount;
      this.netAmount -= (invoice.xpdInvoice.totalTrasactionValue - invoice.newDiscountAmount);
    }
    this.updateDashboardRow();
  }

  updatePercentData(percentNum:number) {
    this.selectAllInvoiesForOffer = false;
    this.disPercent = percentNum;
    this.setupInvoiceValues();
    this.updateDashboardRow();
  }

  selectAllInvoices(selection:boolean) {
    let selInvoices:InvoiceDto[] = [];
    this.selectAllInvoice = selection;
    this.resetConsolidatedValues();
    if (!selection && this.lstInvoicesDto.length <= 0)
      this.disableSubmit = true;
    else
      this.disableSubmit = false;
    this.lstInvoicesDto.forEach(invoice => { 
      invoice.xpdInvoice.selected=selection;
      if (selection) {
        selInvoices.push(invoice);
        this.totalAmount += invoice.actualAmountDue;
        this.disAmount += invoice.newDiscountAmount;
        this.netAmount += invoice.xpdInvoice.totalTrasactionValue - invoice.newDiscountAmount;
      }
    });
    this.selectedInvoices = selInvoices;
    this.totalInvoices = this.selectedInvoices.length;
    this.updateDashboardRow();
  }
  
  openModalDialog(){
    this.closeConfirmationDialog();
    if (this.disPercent < this.minPercentage) {
      this.showErrorMessage("Given discount percentage is less than the minimum possible discount percentage");
      return;
    }
    if (this.fixedOffer && this.disPercent != this.minPercentage)
    {
      this.showErrorMessage("Fixed percentage cannot be changed. Please review the offer before submitting");
      return;
    }
    this.otp = "";
    this.incorrectOtp = false;
    this.errorOccured = false;
    if(this.selectedInvoices != null && this.selectedInvoices.length > 0) {
      // let cnfrm = window.confirm('Submit Invoice Offer for ' + this.selectedInvoices.length + ' invoice(s) at ' + this.disPercent + ' % ?');
      // if (cnfrm === true) {
        this.invoiceService.generateOTP().subscribe(suc => {
          if (suc)
            this.modelDisplay='block'; 
          else
            this.showErrorMessage("Unable to process at this time. Please try again later");
        });
      // }
    } else
      this.showErrorMessage("Please select invoice(s) to proceed");
 }

 closeModalDialog(){
  this.modelDisplay='none';

 }

 showOfferedInvoicesModal() {
   this.offeredInvoices = this.selectedInvoices;
   this.showOfferedModal = 'block';
 }

 closeOfferedInvoicesModalDialog() {
    this.showOfferedModal = 'none';
    this.offeredInvoices = [];
    this.showOfferedInvoices = false;
    this.selectedLocation = 0;
    this.ngOnInit();
 }

 selectCurrentRow(selectedInvoice:InvoiceDto, selection:boolean) {
    if(!selection) 
      this.selectedInvoices.splice(this.selectedInvoices.indexOf(selectedInvoice),1);
    else 
      this.selectedInvoices.push(selectedInvoice);

    this.selectAllInvoice =  this.selectedInvoices.length == this.lstInvoicesDto.length;
    this.updateDashoardRowData(selectedInvoice);
    if (this.selectedInvoices.length > 0)
      this.disableSubmit = false;
    else  
      this.disableSubmit = true;
 }

 showErrorMessage(message?:string) {
  this.errorOccured = true;
  if (message === undefined || message === "") 
    this.errorMessage = "An error occurred. Please contact us at info@xpedize.com";
  else
    this.errorMessage = message;
}

 filterInvoiceWithLocation(event) {
  
 }

 filterInvoiceList(event?) {
    //Location Case
    this.showWaiting = true;
    let selLocation:string = "All";
    if(event != undefined) {
      this.selectBuyerCompany.orgMasters.forEach(orgMaster => {
        if (orgMaster.id == this.selectedLocation)
          selLocation = orgMaster.name;
      });
    }
    this.selectAllInvoiesForOffer = false;
    this.lstInvoicesDto = this.lstAllInvoices.filter(invoice => {
      let isValid:boolean = false;
      isValid = selLocation == 'All' || invoice.xpdInvoice.orgMasterName == selLocation;
      isValid = isValid && (this.invoiceNumberText == undefined || this.invoiceNumberText == "" || invoice.xpdInvoice.invoiceNumber.toLowerCase().indexOf(this.invoiceNumberText.toLowerCase()) != -1);
      return isValid;
    });
    this.setupInvoiceValues();
    this.getCompanyInvoiceOffer();
    this.showWaiting = false;
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
      if (sortColumn == this.currentSortColumn) {
        this.sortAscending = !this.sortAscending;
      } else {
        this.currentSortColumn = sortColumn;
        this.sortAscending = true;
      }
    }

    if (sortColumn == 'InvoiceNumber'){
      this.lstInvoicesDto = this.lstInvoicesDto.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.invoiceNumber, inv2.xpdInvoice.invoiceNumber);
      });
    } else if (sortColumn=='AmountDue') {
      this.lstInvoicesDto = this.lstInvoicesDto.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.totalTrasactionValue, inv2.xpdInvoice.totalTrasactionValue);
      });
    } else if (sortColumn=='DueDate') {
      this.lstInvoicesDto = this.lstInvoicesDto.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.dueDate, inv2.xpdInvoice.dueDate);
      });
    } else if (sortColumn=='DiscountAmount') {
      this.lstInvoicesDto = this.lstInvoicesDto.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.newDiscountAmount, inv2.newDiscountAmount);
      });
    } else if (sortColumn=='NetAmount') {
      this.lstInvoicesDto = this.lstInvoicesDto.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.totalTrasactionValue-inv1.newDiscountAmount, inv2.xpdInvoice.totalTrasactionValue-inv2.newDiscountAmount);
      });
    }
  }

  returnStyle(status: boolean) {
    return AppUtil.getStyleForSupplierDashboard(status);
  }

  onPageChange(event: Event) {
    this.p = event;
    document.getElementById("invoiceTable").scrollTo(0,0);
  }

  closeConfirmationDialog () {
    this.confirmationModel = 'none';
  }

  showConfirmationDialog() {
    this.closeConfirmationDialog();
    if (this.disPercent < this.minPercentage) {
      this.showErrorMessage("Given discount percentage is less than the minimum possible discount percentage");
      return;
    }
    if (this.fixedOffer && this.disPercent != this.minPercentage)
    {
      this.showErrorMessage("Fixed percentage cannot be changed. Please review the offer before submitting");
      return;
    }
    if(this.selectedInvoices != null && this.selectedInvoices.length > 0) {
      this.confirmationModel = 'block';
    } else {
      this.showErrorMessage("Please select invoice(s) to proceed");
    }

  }

}

