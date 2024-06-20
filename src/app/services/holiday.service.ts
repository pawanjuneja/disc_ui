import { XpdPaymentDateStrategy } from './../models/xpd-payment-date-strategy';
import { HolidayListComponent } from './../components/holiday-list/holiday-list.component';
import { CogServiceService } from './cog-service.service';
import { AppConstants } from './../app-constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { XpdHoliday } from '../models/xpd-holiday';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http:HttpClient, private cognito:CogServiceService) { }

  getHolidayListURL:string = AppConstants.BASE_SERVICE_URL + "holiday/getHolidayList";
  getSaveHolidayURL:string = AppConstants.BASE_SERVICE_URL + "holiday/saveHoliday";
  getDeleteHolidayURL:string = AppConstants.BASE_SERVICE_URL + "holiday/deleteHolidays";
  savePaymentStrategyURL:string = AppConstants.BASE_SERVICE_URL + "holiday/savePaymentDateStrategy";
  getPaymentStrategyForCompanyURL:string = AppConstants.BASE_SERVICE_URL + "holiday/getPaymentStrategyForCompany";


  getAllCompanyHolidays(selectedLocation:string) : Observable<XpdHoliday[]> {
    let requestParams = {
      companyId: selectedLocation,
      username: this.cognito.getCurrentUser()
    }
    return this.http.get<XpdHoliday[]>(this.getHolidayListURL,{params:requestParams});
  }

  saveHoliday(objHoliday:XpdHoliday):Observable<boolean> {
    let requestParams = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.post<boolean>(this.getSaveHolidayURL,objHoliday, {params:requestParams});
  }

  deleteHolidays(objHolidays:XpdHoliday[]):Observable<boolean> {
    let requestParams = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.post<boolean>(this.getDeleteHolidayURL,objHolidays, {params:requestParams});
  }

  savePaymentDateStrategy (paymentDateStrategy:XpdPaymentDateStrategy) {
    let requestParams = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.post<boolean>(this.savePaymentStrategyURL,paymentDateStrategy, {params:requestParams});
  }

  getDateStrategyForCompany(companyId:string):Observable<XpdPaymentDateStrategy> {
    let requestParams = {
      companyId: companyId,
      username: this.cognito.getCurrentUser()
    }
    return this.http.get<XpdPaymentDateStrategy>(this.getPaymentStrategyForCompanyURL,{params:requestParams});
  }

}
