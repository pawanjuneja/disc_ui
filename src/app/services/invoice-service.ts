import { XpdInvoice } from './../models/XpdInvoice';
import { XpdOrgMaster } from './../models/XpdOrgMaster';
import { AppConstants } from './../app-constants';
import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Http, Response } from '@angular/http';
import {switchMap, map} from 'rxjs/operators';

@Injectable()
export class InvoiceService {

  locationsURL:string = AppConstants.BASE_SERVICE_URL + "invoice/getCompanyLocations";
  getInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "invoice/getLocationInvoices";

  constructor(private http:Http) { }

  getLocations() : Observable<XpdOrgMaster[]> {
    let requestParams = {
      username: AppConstants.LOGGED_IN_USER  
    }
    console.log("service called");
    return this.http.get(this.locationsURL,{params:requestParams}).map((response:Response)=> {
      let data = response.json();
      let responseData:XpdOrgMaster[] = data as XpdOrgMaster[];
      return responseData;
    });
  }

  getInvoices(selectedLocation:number) : Observable<XpdInvoice[]> {
    let requestParams = {
      currentLocationId: selectedLocation  
    }
    console.log("service called");
    return this.http.get(this.getInvoicesURL,{params:requestParams}).map((response:Response)=> {
      console.log(response);
      let data = response.json();
      let responseData:XpdInvoice[] = data as XpdInvoice[];
      return responseData;
    });
  }

}
