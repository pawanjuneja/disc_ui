import { XpdPaymentDateStrategy } from './../../models/xpd-payment-date-strategy';
import { HolidayService } from './../../services/holiday.service';
import { AuthServiceService } from './../../services/auth-service.service';
import { XpdHoliday } from './../../models/xpd-holiday';
import { CompanyOfferDto } from './../../models/company-offer-dto';
import { BuyerDashboardDto } from './../../models/buyer-dashboard-dto';
import { XpdCompany } from './../../models/xpd-company';
import { DatePipe } from '@angular/common';
import { BuyerInvoiceService } from './../../services/buyer-invoice.service';
import { Component, OnInit } from '@angular/core';
import { PaymentDateStrategyDto } from 'src/app/models/strategy-and-company-dto';

@Component({
  selector: 'app-set-payment-dates',
  templateUrl: './set-payment-dates.component.html',
  styleUrls: ['./set-payment-dates.component.css'],
  providers: [DatePipe]
})
export class SetPaymentDatesComponent implements OnInit {


  errorOccured:boolean = false;
  errorMessage:string = "An error occurred. Please contact administrator!";
  selectedCompany:string = '';
  lstCompanies:XpdCompany[] = [];
  weekDays:boolean[] = [false,true,true,true,true,true,false];
  selectedStrategy:string = '';
  minimumDaysGap:number = 2;
  selectedPaymentDateStrategy:XpdPaymentDateStrategy = {};
  selectedDayOfWeek:string[];
  selectedCompanyObject:XpdCompany = {};
  savedStrategy:XpdPaymentDateStrategy = {};

  constructor(private buyerService: BuyerInvoiceService,
            private authService:AuthServiceService,
            private holidayService:HolidayService) { }

  ngOnInit() { 
    this.getCompanyList();
    this.selectedCompany = '';
  }
  
  getCompanyList() {
    this.errorOccured = false;
    this.authService.getAllUserCompanies().subscribe(suc => {
      this.lstCompanies = suc as XpdCompany[];
    }, error => {
      console.log(error);
    });
  }

  saveStrategy() {
    this.errorOccured = false;
    let strWorkingDays:string = '';
    let count:number = 1;
    this.weekDays.forEach (day => {
      if (day)
        strWorkingDays = strWorkingDays + count + ',';
      count++;
    });
    let selNumber:number = Number(this.selectedCompany);
    this.lstCompanies.forEach(company => {
      if (company.id == selNumber)
        this.selectedCompanyObject = company;
    });
    
    this.selectedPaymentDateStrategy.paymentDateStrategy = this.selectedStrategy;
    this.selectedPaymentDateStrategy.minimumDaysGap = this.minimumDaysGap;
    this.selectedPaymentDateStrategy.workingDays = strWorkingDays;
    this.selectedPaymentDateStrategy.company = this.selectedCompanyObject;
    if (this.selectedStrategy == 'DayOfWeek') {
      this.selectedPaymentDateStrategy.particularDayOfWeek = '';
      this.selectedDayOfWeek.forEach(day => {
        this.selectedPaymentDateStrategy.particularDayOfWeek = this.selectedPaymentDateStrategy.particularDayOfWeek + day + ",";
      });
    }
    
    this.holidayService.savePaymentDateStrategy(this.selectedPaymentDateStrategy).subscribe (suc => {
      if (suc) {
        this.showErrorMessage("Payment Date strategy saved for " + this.selectedCompanyObject.companyName);
        this.getStrategy();
      }
      else
        this.showErrorMessage();
    });

  }

  showErrorMessage(message?:string) {
    this.errorOccured = true;
    if (message === undefined || message === "") 
      this.errorMessage = "An error occurred. Please contact administrator!";
    else
      this.errorMessage = message;
  }

  selectCompanyStrategy() {
    this.errorOccured = false;
    this.getStrategy();
  }
  
  getStrategy() {
    this.resetValues();
    this.holidayService.getDateStrategyForCompany(this.selectedCompany).subscribe (suc => {
      if (suc != null && suc != undefined) {
        this.savedStrategy = suc;
        this.setupSavedStrategy();
      }
    }, error => {
      this.showErrorMessage("Unable to get Strategy data for Selected Company");
    })
  }
  
  resetValues() {
    this.savedStrategy = {};
    this.selectedStrategy = "";
    this.minimumDaysGap = 2;
    this.weekDays = [true,true,true,true,true,false,false];
    this.selectedDayOfWeek = [];
    this.selectedPaymentDateStrategy = {};
  }

  setupSavedStrategy() {
    this.selectedStrategy = this.savedStrategy.paymentDateStrategy;
    this.minimumDaysGap = this.savedStrategy.minimumDaysGap
    this.savedStrategy.workingDays;
    let count:number = 1;
    this.weekDays.forEach(day => {
      if (this.savedStrategy.workingDays.indexOf(count.toString()) != -1)
        this.weekDays[count-1] = true;
      else
      this.weekDays[count-1] = false;
      count++;
    });
    this.selectedCompanyObject = this.savedStrategy.company;
    if (this.selectedStrategy == 'DayOfWeek') {
      this.selectedDayOfWeek = this.savedStrategy.particularDayOfWeek.split(',');
    }
    this.selectedPaymentDateStrategy.id = this.savedStrategy.id;
  }

}
