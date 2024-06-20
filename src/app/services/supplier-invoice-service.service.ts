import { XpdOffer } from '../models/xpd-offer';
import { InvoiceDto } from '../models/invoice-dto';
import { SupplierDashboardDto } from '../models/supplier-dashboard-dto';
import { InvoiceOfferRequest } from '../models/invoice-offer-request';
import { XpdInvoice } from '../models/xpd-invoice';
import { XpdOrgMaster } from '../models/xpd-org-master';
import { AppConstants } from '../app-constants';
import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
import { UserMobDto } from '../models/userMobile-dto';
import { CogServiceService } from './cog-service.service';
import { XpdCompany } from '../models/xpd-company';

@Injectable({
  providedIn: 'root'
})
export class SupplierInvoiceServiceService {

  locationsURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getCompanyLocations';
  buyerLocationsURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getBuyerLocations';
  // Buyer Companies Service URL
  buyerCompaniesURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getBuyerCompanies';
  // Specific Buyer Location URL
  specificBuyerLocationURL = AppConstants.BASE_SERVICE_URL + 'supplier/getSpecificBuyerLocations';
  getInvoicesURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getLocationInvoices';
  getAllInvoicesURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getAllCompanyInvoices';
  getUnderClearingInvoicesURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getUnderClearingLocationInvoices';
  getApprovedInvoicesURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getApprovedInvoices';
  submitInvoiceOfferURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/submitInvoiceOffer';
  supplierDashboardURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getSupplierDashboardData';
  companyInvoiceOfferURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getCompanyInvoiceOffer';
  nextDueDateURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/getNextDueDate';
  otpGenerationURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/otp';
  checkOTPURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/checkOTP';
  isTNCURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/authDetails';
  verfiyPanURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/verfiyPan';
  saveMobileNumberURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/saveMob';
  checkRoleURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/checkRole';
  changePasswordNotificationURL: string = AppConstants.BASE_SERVICE_URL + 'supplier/changePasswordNotification';
  forgotPasswordNotificationURL: string = AppConstants.BASE_SERVICE_URL + 'user/forgotPassword';
  getBuyerCompanyRelationshipURL:string = AppConstants.BASE_SERVICE_URL + "supplier/companyIsBuyer";

  constructor(private http: HttpClient, private cognito:CogServiceService, private oldHttp: Http) { }

  getLocations(): Observable<XpdOrgMaster[]> {
    let requestParams = {
      username: this.cognito.getCurrentUser()
    };
    // console.log('service called');
    return this.http.get<XpdOrgMaster[]>(this.locationsURL, {params: requestParams });
  }

  // Service to get Buyer companies for supplier.
  getBuyerCompanies(): Observable<XpdCompany[]> {
  const requestParams = {
    username: this.cognito.getCurrentUser()
  };
  return this.http.get<XpdCompany[]>(this.buyerCompaniesURL, {params: requestParams });
  }

  // Service to get Specifc Buyer Locations
  getSpecificBuyerLocations(currentBuyerId: number): Observable<XpdOrgMaster[]> {
    let requestParams: HttpParams = new HttpParams();
      requestParams = requestParams.append('username', this.cognito.getCurrentUser());
      // console.log(currentBuyerId.toString());
      requestParams = requestParams.append('buyerId', currentBuyerId.toString());

    // console.log('service called');
    return this.http.get<XpdOrgMaster[]>(this.specificBuyerLocationURL, {params: requestParams });
  }

  getBuyerLocations(): Observable<XpdOrgMaster[]> {
    let requestParams = {
      username: this.cognito.getCurrentUser()
    }
    // console.log('service called');
    return this.http.get<XpdOrgMaster[]>(this.buyerLocationsURL, {params: requestParams });
  }

  getNextDueDate() {
    return this.http.get(this.nextDueDateURL).pipe(map((response: Response) => {
      let data = response.json();
      let responseData: Date = new Date(data);
      return responseData;
    }));
  }

  getUnderClearingInvoices(selectedBuyerCompanyId: number, selectedLocation: number): Observable<InvoiceDto[]> {
    let requestParams:HttpParams = new HttpParams();
    requestParams = requestParams.append("buyerId", selectedBuyerCompanyId.toString());
      requestParams = requestParams.append("currentLocationId", selectedLocation.toString());
      requestParams = requestParams.append("username", this.cognito.getCurrentUser());

    // console.log('service called');
    return this.http.get<InvoiceDto[]>(this.getUnderClearingInvoicesURL, { params: requestParams });
  }

  getApprovedInvoices(buyerId: string, location:string, fromDate:string, endDate:string, invoiceNumber:string) : Observable<InvoiceDto[]> {
    let requestParams:HttpParams = new HttpParams();
      requestParams = requestParams.append("username", this.cognito.getCurrentUser());
      requestParams = requestParams.append("buyerId", buyerId);
      requestParams = requestParams.append("location", location);
      requestParams = requestParams.append("fromDate", fromDate);
      requestParams = requestParams.append("toDate", endDate);
      requestParams = requestParams.append("invoiceNumber", invoiceNumber);

    // console.log("service called");
    return this.http.get<InvoiceDto[]>(this.getApprovedInvoicesURL,{params:requestParams});
  }

getInvoices(selectedBuyerLocation:number, selectedBuyerCompany:number, nextDueDate:Date) : Observable<InvoiceDto[]> {
    let requestParams:HttpParams = new HttpParams();
      requestParams = requestParams.append("currentLocationId", selectedBuyerLocation.toString());
      requestParams = requestParams.append("buyerCompanyId", selectedBuyerCompany.toString());
      requestParams = requestParams.append("username", this.cognito.getCurrentUser());
      // requestParams = requestParams.append("newDueDate", nextDueDate.toDateString());

    // console.log("service called");
    return this.http.get<InvoiceDto[]>(this.getInvoicesURL,{params:requestParams});
  }

  getAllInvoices() : Observable<InvoiceDto[]> {
    let requestParams:HttpParams = new HttpParams();
      requestParams = requestParams.append("username", this.cognito.getCurrentUser());

    // console.log("service called");
    return this.http.get<InvoiceDto[]>(this.getAllInvoicesURL,{params:requestParams});
  }

  getDashboardData(buyer: number): Observable<SupplierDashboardDto> {
    // let requestParams:HttpParams = new HttpParams();
    //   requestParams = requestParams.append("username", this.cognito.getCurrentUser());
    //   requestParams = requestParams.append("buyerId", buyerId.toString());
    const requestParams = {
      username: this.cognito.getCurrentUser(),
      buyerId: buyer.toString()
    };

    // console.log("service called");
    return this.http.get<SupplierDashboardDto>(this.supplierDashboardURL,{params:requestParams});
  }

  submitInvoicesForOffer(selectedInvoices:XpdInvoice[], selectedPrice:number, nextDueDate:Date) : Observable<boolean> {
    let invoiceOfferRequest:InvoiceOfferRequest = {
      selectedPrice:selectedPrice,
      nextDueDate:nextDueDate,
      lstInvoices: selectedInvoices,
      username: this.cognito.getCurrentUser()
    };

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options:RequestOptions = new RequestOptions();
    options.headers = new Headers();
    options.headers.append('Content-Type', 'application/json');
  

    // console.log("service called");
    return this.http.post<boolean>(this.submitInvoiceOfferURL,invoiceOfferRequest);
  }

  getCompanyInvoiceOffer(buyerId:number) {
    let requestParams = {
      username: this.cognito.getCurrentUser(),
      buyerId: buyerId.toString()
    }

    // console.log("service called");
    return this.http.get(this.companyInvoiceOfferURL,{params:requestParams});
  }

  generateOTP():Observable<boolean> {
    let requestParams = {
      username: this.cognito.getCurrentUser() 
    }

    return this.http.get<boolean>(this.otpGenerationURL,{params: requestParams})
  }

  checkOTP(enteredOTP:string): Observable<boolean> {
    let requestParams = {
      username: this.cognito.getCurrentUser(),  
      otp: enteredOTP
    }

    return this.http.get<boolean>(this.checkOTPURL,{params: requestParams});
  }

  getAuthDetails(): Observable<boolean> {
    const requestParams = {
      username: this.cognito.getCurrentUser(),
    };
    return this.http.get<boolean>(this.isTNCURL, {params: requestParams});
  }

  verfiyPAN(inp: string): Observable<boolean> {
    const requestParams = {
      username: this.cognito.getCurrentUser(),
      nPAN: inp
    };
    return this.http.get<boolean>(this.verfiyPanURL, {params: requestParams});
  }

  saveUserMob(mob: string) {
  const userMob: UserMobDto = {
    username: this.cognito.getCurrentUser(),
    mobileNumber: mob
  };
  const headers:HttpHeaders = new HttpHeaders();
  headers.append('Content-Type', 'application/json');
  const options: RequestOptions = new RequestOptions();
  options.headers = new Headers();
  options.headers.append('Content-Type', 'application/json');
  // console.log('Saving Mobile Number');
  return this.http.post(this.saveMobileNumberURL, userMob, {headers: headers});
  }

  checkIsBuyer() {
    const requestParams = {
      username: this.cognito.getCurrentUser()
    };
    return this.http.get(this.checkRoleURL, {params: requestParams});
  }

  changePasswordNotification() {
    const requestParams = {
      username: this.cognito.getCurrentUser()
    };
    return this.http.get(this.changePasswordNotificationURL, {params: requestParams});
  }

  changeForgotPasswordNotification(un: string) {
    const requestParams = {
      username: un
    };
    return this.oldHttp.get(this.forgotPasswordNotificationURL, {params: requestParams});
  }

  getBuyerRelationshipData() : Observable<boolean> {
    let requestParams = {
      username: this.cognito.getCurrentUser() 
    }
    return this.http.get<boolean>(this.getBuyerCompanyRelationshipURL,{params:requestParams});
  }

  

}
