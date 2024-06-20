import { XpdOrgMaster } from './../../models/xpd-org-master';
import { HolidayService } from './../../services/holiday.service';
import { XpdHoliday } from './../../models/xpd-holiday';
import { AuthServiceService } from './../../services/auth-service.service';
import { BuyerInvoiceService } from './../../services/buyer-invoice.service';
import { BuyerDashboardDto } from './../../models/buyer-dashboard-dto';
import { Component, OnInit } from '@angular/core';
import { XpdCompany } from 'src/app/models/xpd-company';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.css']
})
export class HolidayListComponent implements OnInit {

  buyerDashboardDto:BuyerDashboardDto = {};
  errorOccured:boolean = false;
  errorMessage:string = "An error occurred. Please contact administrator!";
  selectedCompany:string = '';
  lstCompanies:XpdCompany[] = [];
  lstHolidays:XpdHoliday[] = [];
  listMode:boolean = true;
  selectedHoliday:XpdHoliday = {isNationalHoliday:false};
  selectedCompanyObject:XpdCompany = {};
  selectedLocations:string[]=[];

  constructor(private buyerService: BuyerInvoiceService,
            private authService:AuthServiceService,
            private holidayService:HolidayService) { }

  ngOnInit() { 
    this.loadDashboardData();
    this.getCompanyList();
  }
  
  loadDashboardData() {
    this.buyerService.getDashboardData().subscribe (suc => {
      this.buyerDashboardDto = suc;
    }, error => {
      console.log(error);
    });
  }

  getCompanyList() {
    this.authService.getAllUserCompanies().subscribe(suc => {
      this.lstCompanies = suc as XpdCompany[];
    }, error => {
      console.log(error);
    });
  }

  selectCompanyHolidays() {
    let selNumber:number = Number(this.selectedCompany);
    this.lstCompanies.forEach(company => {
      if (company.id == selNumber)
        this.selectedCompanyObject = company;
    });

    this.holidayService.getAllCompanyHolidays(this.selectedCompany).subscribe(suc => {
      this.lstHolidays = suc as XpdHoliday[];
      this.lstHolidays.forEach(holiday => {
        holiday.holidayDate = new Date(holiday.holidayDate);
      })
    }, error => {
      console.log(error);
    });
  }

  addNewHoliday() {
    this.listMode = false;
    this.errorOccured = false;
    this.selectedHoliday = {};
  }

  editSelectedHoliday() {
    let selectedHolidays:XpdHoliday[] = [];
    this.lstHolidays.forEach(holiday => {
      if (holiday.selected)
        selectedHolidays.push(holiday);
    });
    if (selectedHolidays.length > 1 || selectedHolidays.length == 0) 
    this.showErrorMessage("Select one holiday record to edit");
    else if (selectedHolidays.length == 1){
      this.selectedHoliday = selectedHolidays[0];
      this.listMode = false;
    }
  }

  deleteSelectedHolidays() {
    let selectedHolidays:XpdHoliday[] = [];
    this.lstHolidays.forEach(holiday => {
      if (holiday.selected)
        selectedHolidays.push(holiday);
    });
    if (selectedHolidays.length <= 0)
    this.showErrorMessage("Please select holiday to delete");
    else {
      this.holidayService.deleteHolidays(selectedHolidays).subscribe ( suc => {
        if (suc) {
          this.showErrorMessage("Successfully removed");
          this.selectCompanyHolidays();
        } else
          this.showErrorMessage("An Error occured");
      })
    } 
  }

  saveHoliday() {
    this.selectedHoliday.company = this.selectedCompanyObject;
    this.selectedHoliday.locations = [];
    if (!this.selectedHoliday.isNationalHoliday) {
      this.selectedCompanyObject.orgMasters.forEach(orgM => {
        if (this.selectedLocations.indexOf(orgM.id.toString()) != -1)
        this.selectedHoliday.locations.push(orgM);
      });
    }
    this.holidayService.saveHoliday(this.selectedHoliday).subscribe (suc => {
      if (suc) {
        this.showErrorMessage("Holiday Saved Successfully");
        this.listMode = true;
        this.selectCompanyHolidays();
      }
      else
      this.showErrorMessage("Error occurred while saving holidays data");
    });
  }

  showErrorMessage(message?:string) {
    this.errorOccured = true;
    if (message === undefined || message === "") 
      this.errorMessage = "An error occurred. Please contact administrator!";
    else
      this.errorMessage = message;
  }
}
