import { AppUtil } from './../../app-util';
import { AppConstants } from './../../app-constants';
import { XpdInvoice } from './../../models/xpd-invoice';
import { InvoiceDto } from './../../models/invoice-dto';
import { BuyerDashboardDto } from './../../models/buyer-dashboard-dto';
import { BuyerInvoiceService } from './../../services/buyer-invoice.service';
import { XpdOrgMaster } from './../../models/xpd-org-master';
import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { SupplierInvoiceServiceService } from '../../services/supplier-invoice-service.service';
import { CogServiceService } from '../../services/cog-service.service';


@Component({
  selector: 'app-buyer-under-clearing',
  templateUrl: './buyer-under-clearing.component.html',
  styleUrls: ['./buyer-under-clearing.component.css']
})
export class BuyerUnderClearingComponent implements OnInit {
  p: any;
  lstCompanyLocations:XpdOrgMaster[];
  user = this.cognito.getCurrentUser();
  selectedLocation:string;
  lstInvoices:InvoiceDto[];
  lstAllInvoices:InvoiceDto[];
  buyerDashboardDto:BuyerDashboardDto = {};
  totalInvoices:number=0;
  totalAmount:number=0;
  disAmount:number=0;
  discountPercent:number=0;
  netAmount:number=0;
  disPercent:number;
  selectedSubmissionDate:Date;
  currentSortColumn:string;
  sortAscending:boolean = true;
  supplierFilterText:string;
  filterSubmissionDate:string;
  selectAllInvoicesForApproval:boolean = true;
  selectAll:boolean = false;
  // noOfPendingApprovalInvoices:number = 0;
  selectedStatusFilter:string;
  lstFilterValues:string[] = [];
  filterDisplay:string = 'none';
  lstSelectedInvoices:InvoiceDto[] = [];
  showWaiting:boolean = false;
  showingSummaryForStatus:string = "";
  errorOccured:boolean = false;
  errorMessage:string = "An error occurred. Please contact administrator!";
  invoiceNumberText:string;
  selectedApprovalOption:string = "Paid";
  otp:string = '';
  // Model Variables
  modelDisplay = 'none';
  paidInvoicesConfirmationModel = 'none';
  postOnERPInvoicesConfirmationModel = 'none';
  feedbackModalDisplay = 'none';
  confirmationModel = 'none';
  currentAction = '';
  incorrectOtp = false;
  otpErrorMessage = 'Incorrect OTP / OTP expired';
  comments:string='';
  confirmationSelectedInvocies: XpdInvoice[] = [];

  constructor(private buyerInvoiceService: BuyerInvoiceService,
    private supplierInvoiceService: SupplierInvoiceServiceService, private router: Router, private cognito: CogServiceService) {
      if(this.cognito.getCurrentUser() == undefined || this.cognito.getCurrentUser()=='' || this.cognito.getCurrentUser() == null) {
        AppUtil.reDirectToLogin(router);
      }
    }

  ngOnInit() {
    this.errorOccured = false;
    this.supplierFilterText = "";
    this.filterSubmissionDate = "";
    this.selectedStatusFilter = "";
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
      this.getInvoicesForLocation();
    }, error => {
      this.showErrorMessage();
    });
    this.loadDashboardData();
  }


  reloadPage() {
    this.router.navigateByUrl("/buyer-pending-approval",{skipLocationChange:true});
  }

  loadDashboardData() {
    this.buyerInvoiceService.getDashboardData().subscribe (suc => {
      this.buyerDashboardDto = suc;
    }, error => {
      this.showErrorMessage();
    });
  }

  getInvoicesForLocation() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.lstInvoices = [];
    this.showWaiting = true;
    this.resetConsolidatedValues();
    this.buyerInvoiceService.getUnderClearingInvoices().subscribe (suc => {
      this.lstInvoices = suc;
      this.lstAllInvoices = suc;
      this.setupInvoiceValues();
      // console.log(this.lstInvoices);
      this.filterInvoiceList();
      this.showWaiting = false;
    }, error => {
      this.showWaiting = false;
      this.showErrorMessage();
    });
  }

  setupInvoiceValues() {
    this.lstFilterValues = ['All'];
    this.lstInvoices.forEach(element => {
      element.xpdInvoice.selected = false
      element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
      element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);
      element.xpdInvoice.newDueDate = new Date(element.xpdInvoice.newDueDate);
      element.xpdInvoice.submissionDate = new Date(element.xpdInvoice.submissionDate);
      if (element.xpdInvoice.xpdDesc ===  AppConstants.VERIFICATION_PENDING_XPD_DESC && 
          element.userIsChecker) {
          element.xpdInvoice.enabledForStatusChange = false;
      } else {
        if (
          (element.xpdInvoice.xpdDesc == AppConstants.FIRST_APPROVAL_XPD_DESC || element.xpdInvoice.xpdDesc == AppConstants.SECOND_APPROVAL_XPD_DESC)
          &&
          (element.userIsApprover && element.xpdInvoice.lastApprover !== this.user)) {
            element.xpdInvoice.enabledForStatusChange = false;
        } else {
              element.xpdInvoice.enabledForStatusChange = true;
        }
      }
      
      if (this.selectAllInvoicesForApproval && !element.xpdInvoice.enabledForStatusChange) {
        element.xpdInvoice.selected = true; 
        this.selectAll = true;
      }
      if (element.xpdInvoice.xpdDesc == AppConstants.FIRST_APPROVAL_XPD_DESC 
        || element.xpdInvoice.xpdDesc == AppConstants.SECOND_APPROVAL_XPD_DESC
        || element.xpdInvoice.xpdDesc == AppConstants.VERIFICATION_PENDING_XPD_DESC)
        element.approved = false;
      else
        element.approved = true;
      
      if (this.lstFilterValues.indexOf(element.xpdInvoice.buyerDesc) == -1) 
        this.lstFilterValues.push(element.xpdInvoice.buyerDesc);
    });
    this.lstAllInvoices.forEach(element => {
      element.xpdInvoice.selected = false
      element.xpdInvoice.invoiceDate = new Date(element.xpdInvoice.invoiceDate);
      element.xpdInvoice.dueDate = new Date(element.xpdInvoice.dueDate);
      element.xpdInvoice.newDueDate = new Date(element.xpdInvoice.newDueDate);
      element.xpdInvoice.submissionDate = new Date(element.xpdInvoice.submissionDate);
      if (element.xpdInvoice.xpdDesc ===  AppConstants.VERIFICATION_PENDING_XPD_DESC && 
          element.userIsChecker) {
          element.xpdInvoice.enabledForStatusChange = false;
      } else {
        if (
          (element.xpdInvoice.xpdDesc == AppConstants.FIRST_APPROVAL_XPD_DESC || element.xpdInvoice.xpdDesc == AppConstants.SECOND_APPROVAL_XPD_DESC)
          &&
          (element.userIsApprover && element.xpdInvoice.lastApprover !== this.user)) {
            element.xpdInvoice.enabledForStatusChange = false;
        } else {
            element.xpdInvoice.enabledForStatusChange = true;
        }
      }

      if (this.selectAllInvoicesForApproval && !element.xpdInvoice.enabledForStatusChange) {
        element.xpdInvoice.selected = true; 
        this.selectAll = true;
      }
      if (element.xpdInvoice.xpdDesc == AppConstants.FIRST_APPROVAL_XPD_DESC 
        || element.xpdInvoice.xpdDesc == AppConstants.SECOND_APPROVAL_XPD_DESC
        || element.xpdInvoice.xpdDesc == AppConstants.VERIFICATION_PENDING_XPD_DESC)
        element.approved = false;
      else
        element.approved = true;
    });
    this.selectedStatusFilter = 'All';
    this.sortInvoiceList('Status');
  }

  selectAllInvoices(check:boolean) {
    this.resetConsolidatedValues();

    this.lstInvoices.forEach (invoice => {
      invoice.xpdInvoice.selected = check;
      if (check) {
          this.totalInvoices ++;
          this.totalAmount += invoice.xpdInvoice.totalTrasactionValue;
          this.discountPercent += invoice.xpdInvoice.discountPercent30Days;
          this.disAmount += invoice.xpdInvoice.discountAmount;
          this.netAmount += invoice.xpdInvoice.netAmount;
        }
      });
    this.discountPercent = this.discountPercent/this.totalInvoices;
    
  }

  resetConsolidatedValues() {
    this.totalInvoices=0;
    this.totalAmount=0;
    this.disAmount=0;
    this.netAmount=0;
    this.discountPercent = 0;
  }

  updateDashboardRow() {
    this.resetConsolidatedValues();
    this.lstInvoices.forEach(invoice => {
      if (invoice.xpdInvoice.selected) {
        this.totalInvoices ++;
        this.totalAmount += invoice.xpdInvoice.totalTrasactionValue;
        this.discountPercent += invoice.xpdInvoice.discountPercent30Days;
        this.disAmount += invoice.xpdInvoice.discountAmount;
        this.netAmount += invoice.xpdInvoice.netAmount;
      }
    });
    this.selectAll = this.totalInvoices === this.lstInvoices.length;
    this.discountPercent = this.discountPercent/this.totalInvoices;
  }

  getSelectedInvoices() {
    let lstSelectedInvoices:XpdInvoice[] = [];
    this.lstInvoices.forEach(invoice => {
      if (invoice.xpdInvoice.selected == true)
        lstSelectedInvoices.push(invoice.xpdInvoice);
    });
    return lstSelectedInvoices;
  }
  
  setSelectedInvoicesAndShowFeedbackModal() {
    this.lstInvoices.forEach(invoice => {
      if (invoice.xpdInvoice.selected == true)
        this.lstSelectedInvoices.push(invoice);
    });    
    this.feedbackModalDisplay = 'block';
  }
  

  selectCurrentRow(selectedInvoice:InvoiceDto) {
    if (!selectedInvoice.xpdInvoice.enabledForStatusChange) {
      if(selectedInvoice.xpdInvoice.selected == true) {
        selectedInvoice.xpdInvoice.selected = false;
      }
      else {
        selectedInvoice.xpdInvoice.selected = true;
      }
      if (this.getSelectedInvoices().length == this.lstAllInvoices.length)
        this.selectAll = true;
      else
        this.selectAll = false;
      this.updateDashboardRow();
    }
 }

  createOTPToUpdateInvoices() {
    const selectedInvoices = this.getSelectedInvoices();
    if (selectedInvoices.length > 0) {
      this.supplierInvoiceService.generateOTP().subscribe (suc => {
        this.confirmationModel = 'none';
        this.modelDisplay = 'block';
        this.incorrectOtp = false;
        this.otpErrorMessage = '';
        this.otp = '';
      }, error => {
        this.showErrorMessage();
      });
    } else  {
      this.showErrorMessage('Please select invoice(s) to Proceed');
    }
  }

  closeModalDialog() {
    this.modelDisplay = 'none';
  }

  postOnERP() {
    this.modelDisplay = 'none';
    this.postOnERPInvoicesConfirmationModel = 'none';
    this.errorOccured = false;
    let selectedInvoices = this.getSelectedInvoices();
    if (selectedInvoices.length > 0) {
        this.showWaiting = true;
        this.buyerInvoiceService.postOnERPInvoices(this.getSelectedInvoices(), this.comments).subscribe(suc => {
          if (suc) {
            this.showWaiting = false;
            this.setSelectedInvoicesAndShowFeedbackModal()
          }
        }, error => {
          this.showWaiting = false;
          this.showErrorMessage();
          this.loadInvoices();
        });
    } else {
      this.showErrorMessage("Please select invoice(s) to Proceed");
    }
  }

  payInvoices() {
    this.modelDisplay = 'none';
    this.paidInvoicesConfirmationModel = 'none';
    this.errorOccured = false;
    let selectedInvoices = this.getSelectedInvoices();
    if (selectedInvoices.length > 0) {
        this.showWaiting = true;
        this.buyerInvoiceService.payInvoices(this.getSelectedInvoices(), this.comments).subscribe(suc => {
          if (suc) {
            this.showWaiting = false;
            this.setSelectedInvoicesAndShowFeedbackModal()
          }
        }, error => {
          this.showWaiting = false;
          this.showErrorMessage();
          this.loadInvoices();
        });
    } else {
      this.showErrorMessage("Please select invoice(s) to Proceed");
    }
  }

  closeFeedbackDialog() {
    this.feedbackModalDisplay = 'none';
    this.lstSelectedInvoices = [];
    this.getInvoicesForLocation();
    this.loadDashboardData();
    // Added this to refresh after user takes any action....
    this.ngOnInit();
  }

  showErrorMessage(message?:string) {
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

  filterInvoiceList() {
    this.lstInvoices = this.lstAllInvoices.filter(invoice => {
      let isValid:boolean = false;
      isValid = this.selectedLocation == "All" || invoice.xpdInvoice.orgMasterName == this.selectedLocation;
      isValid = isValid && (this.supplierFilterText=="" || invoice.xpdInvoice.companyName.toLowerCase().indexOf(this.supplierFilterText.toLowerCase()) != -1);
      isValid = isValid && (this.selectedStatusFilter == 'All' || invoice.xpdInvoice.buyerDesc == this.selectedStatusFilter);
      let submissionDate:Date = new Date(this.filterSubmissionDate);
      isValid = isValid && (this.filterSubmissionDate == "" || AppUtil.checkDateIsSame(submissionDate, invoice.xpdInvoice.submissionDate));
      isValid = isValid && (this.invoiceNumberText == "" || invoice.xpdInvoice.invoiceNumber.toLowerCase().indexOf(this.invoiceNumberText.toLowerCase()) != -1);
      return isValid;
    });
    this.updateDashboardRow();
  }

  showStatusFilter() {
    if (this.filterDisplay == 'none')
      this.filterDisplay = 'block';
    else {
      this.filterDisplay = 'none';
      this.selectedStatusFilter = 'All';
      this.filterInvoiceList();
    }
  }

  checkOTPAndUpdateInvoices() {
    this.supplierInvoiceService.checkOTP(this.otp).subscribe( suc => {
      if (suc) {
        this.modelDisplay = 'none';
        this.checkActionAndProcessInvoices();
      } else {
        this.incorrectOtp = true;
        this.otpErrorMessage = 'Incorrect OTP / OTP expired';
      }
    });
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

    
    if (sortColumn == 'Status'){
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.buyerDesc, inv1.xpdInvoice.buyerDesc);
      });
    } else if (sortColumn == 'Supplier'){
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
        return this.compareValuesForSort(inv1.xpdInvoice.discountPercent30Days, inv2.xpdInvoice.discountPercent30Days);
      });
    } else if (sortColumn=='DiscountAmount') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.discountAmount, inv2.xpdInvoice.discountAmount);
      });
    } else if (sortColumn=='NetAmount') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.netAmount, inv2.xpdInvoice.netAmount);
      });
    } else if (sortColumn=='PaymentDate') {
      this.lstInvoices = this.lstInvoices.sort((inv1,inv2) => {
        return this.compareValuesForSort(inv1.xpdInvoice.newDueDate, inv2.xpdInvoice.newDueDate);
      });
    }
  }

  returnStyle(status: string) {
    return AppUtil.getStyleForBuyerPendingApproval(status);
  }

  onPageChange(event: Event) {
    this.p = event;
    document.getElementById("invoiceTable").scrollTo(0,0);
  }

  showPostedOnERPConfirmationDialog() {
    const selectedInvoices = this.getSelectedInvoices();
    if (selectedInvoices.length > 0) {
      this.postOnERPInvoicesConfirmationModel = 'block';
    } else {
      this.showErrorMessage("Please select invoice(s) to process");
    }
  }

  processInvoices() {
    if (this.selectedApprovalOption == "Paid") {
      this.showPaidInvoicesModel();
    } else {
      this.showPostedOnERPConfirmationDialog();
    }
  }

  showPostOnERPInvoicesModel() {
    this.postOnERPInvoicesConfirmationModel = 'block';
  }

  showPaidInvoicesModel() {
    const selectedInvoices = this.getSelectedInvoices();
    if (selectedInvoices.length > 0) {
      this.paidInvoicesConfirmationModel = 'block';
    } else {
      this.showErrorMessage("Please select invoice(s) to process");
    }
  }

  closePaidInvoicesModel() {
    this.paidInvoicesConfirmationModel = 'none';
  }

  closePostOnERPConfirmationDialog() {
    this.postOnERPInvoicesConfirmationModel = 'none';
  }

  showConfirmationDialog() {
    this.confirmationSelectedInvocies = this.getSelectedInvoices();
    // const selectedInvoices = this.getSelectedInvoices();
    if (this.confirmationSelectedInvocies.length > 0) {
      this.confirmationModel = 'block';
      this.currentAction = this.selectedApprovalOption;
      console.log(this.currentAction);
    } else {
      this.showErrorMessage('Please select invoice(s) to process');
    }
  }

  closeConfirmationDialog() {
    this.currentAction = '';
    this.confirmationModel = 'none';
  }

  checkActionAndProcessInvoices() {
    const selectedInvoices = this.getSelectedInvoices();
    if (selectedInvoices.length > 0 && this.currentAction === this.selectedApprovalOption) {
      if (this.selectedApprovalOption === 'Post on ERP') {
          this.postOnERP();
      } else if (this.selectedApprovalOption === 'Paid') {
          this.payInvoices();
      } else {}
    } else {
      this.showErrorMessage('Please select invoice(s) to process');
    }
  }

  selectCurrentInvoice(check: boolean, invoice: InvoiceDto) {
        invoice.xpdInvoice.selected = check;
        this.updateDashboardRow();
  }
}
