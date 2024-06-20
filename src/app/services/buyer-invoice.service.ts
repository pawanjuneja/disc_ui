import { CompanyOfferDto } from './../models/company-offer-dto';
import { BuyerDto } from './../models/buyer-offer-dto';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BuyerDashboardDto } from './../models/buyer-dashboard-dto';
import { XpdInvoice } from './../models/xpd-invoice';
import { InvoiceDto } from './../models/invoice-dto';
import { XpdOrgMaster } from '../models/xpd-org-master';
import { AppConstants } from '../app-constants';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceApproveRejectRequest } from '../models/invoice-approve-reject-request';
import { CogServiceService } from './cog-service.service';
import { XpdCompany } from '../models/xpd-company';
import { SysOfferParameter } from '../models/sys-offer-parameter';


@Injectable({
  providedIn: 'root'
})
export class BuyerInvoiceService {

  locationsURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getCompanyLocations";
  getInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getLocationInvoices";
  getAllInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getAllCompanyInvoices";
  getAmountDueInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getAmountDueLocationInvoices";
  getPaidInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getPaidInvoices";
  approveInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/approveInvoices";
  rejectInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/rejectInvoices";
  getApprovalPendingInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getApprovalPendingInvoices";
  getDashboardDataURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getBuyerDashboardData";
  nextDueDateURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getNextDueDate";
  getBuyerInvoicesSummaryURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getSummaryInvoices";
  getSupplierCompanyRelationshipURL:string = AppConstants.BASE_SERVICE_URL + "buyer/companyIsSupplier";
  getSuppliersURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getSuppliers";
  getAllOfferTypesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getAllOfferTypes";
  saveSupplierOffersURL:string = AppConstants.BASE_SERVICE_URL + "buyer/saveSupplierOffers";
  getUnderClearingInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/getUnderClearingInovoices"
  postOnERPInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/postOnERPInvoices";
  payInvoicesURL:string = AppConstants.BASE_SERVICE_URL + "buyer/payInvoices";
  
  constructor(private http:HttpClient, private cognito:CogServiceService) { }

  getLocations() : Observable<XpdOrgMaster[]> {
    let requestParams = {
      username: this.cognito.getCurrentUser()  
    }
    return this.http.get<XpdOrgMaster[]>(this.locationsURL,{params:requestParams});
  }

  getNextDueDate() {
    return this.http.get(this.nextDueDateURL);
  }

  getPaidInvoices(selectedLocation:string, supplier:string, fromDate:string, toDate:string, invoiceNumber:string) : Observable<InvoiceDto[]> {
    let requestParams:HttpParams = new HttpParams();
    requestParams = requestParams.append("username", this.cognito.getCurrentUser());
      requestParams = requestParams.append("location", selectedLocation);
      requestParams = requestParams.append("supplier", supplier);
      requestParams = requestParams.append("fromDate", fromDate);
      requestParams = requestParams.append("toDate", toDate);
      requestParams = requestParams.append("invoiceNumber", invoiceNumber);

    return this.http.get<InvoiceDto[]>(this.getPaidInvoicesURL,{params:requestParams})
  }

  getPendingApprovalInvoices(selectedLocation:number) : Observable<InvoiceDto[]> {
    let requestParams = {
      currentLocationId: selectedLocation.toString(),
      username: this.cognito.getCurrentUser()
    }
    return this.http.get<InvoiceDto[]>(this.getApprovalPendingInvoicesURL,{params:requestParams});
  }

  getUnderClearingInvoices() : Observable<InvoiceDto[]> {
    let requestParams = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.get<InvoiceDto[]>(this.getUnderClearingInvoicesURL,{params:requestParams});
  }

  getInvoices(selectedLocation:number) : Observable<InvoiceDto[]> {
    let requestParams = {
      currentLocationId: selectedLocation.toString(),
      username: this.cognito.getCurrentUser()
    }
    return this.http.get<InvoiceDto[]>(this.getAmountDueInvoicesURL,{params:requestParams});
  }

  getAllInvoices(nextDueDate:Date) : Observable<InvoiceDto[]> {
    let dueDateString:string = (nextDueDate.getMonth()+1)+"/"+nextDueDate.getDate() + "/" + nextDueDate.getFullYear();
    let requestParams = {
      username: this.cognito.getCurrentUser(),
      newDueDate: dueDateString 
    }
    return this.http.get<InvoiceDto[]>(this.getAllInvoicesURL,{params:requestParams});
  }

  getDashboardData() : Observable<BuyerDashboardDto> {
    let requestParams = {
      username: this.cognito.getCurrentUser() 
    }
    return this.http.get<BuyerDashboardDto>(this.getDashboardDataURL,{params:requestParams});
  }

  approveInvoices(lstInvoices:XpdInvoice[]): Observable<boolean> {
    let approveRejectRequest:InvoiceApproveRejectRequest = {
      lstInvoices: lstInvoices,
      username: this.cognito.getCurrentUser(),
      approve:true
    };
    
    let headers:HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    
    return this.http.post<boolean>(this.approveInvoicesURL,approveRejectRequest,{headers: headers});
  }

  rejectInvoices(lstInvoices:XpdInvoice[]): Observable<boolean> {
    let approveRejectRequest:InvoiceApproveRejectRequest = {
      lstInvoices: lstInvoices,
      username: this.cognito.getCurrentUser(),
      approve:false
    };
    
    let headers:HttpHeaders = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    
    return this.http.post<boolean>(this.rejectInvoicesURL,approveRejectRequest,{headers: headers});
  }

  postOnERPInvoices(lstInvoices:XpdInvoice[], comments:string): Observable<boolean> {
    let requestParams = {
      comments: comments
    }
    let postOnERPRequest:InvoiceApproveRejectRequest = {
      lstInvoices: lstInvoices,
      username: this.cognito.getCurrentUser()
    };
    
    let headers:HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    
    return this.http.post<boolean>(this.postOnERPInvoicesURL,postOnERPRequest,{headers: headers, params: requestParams});
  }

  payInvoices(lstInvoices:XpdInvoice[], comments:string): Observable<boolean> {
    let requestParams = {
      comments: comments
    }
    let payRequest:InvoiceApproveRejectRequest = {
      lstInvoices: lstInvoices,
      username: this.cognito.getCurrentUser()
    };
    
    let headers:HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    
    return this.http.post<boolean>(this.payInvoicesURL,payRequest,{headers: headers, params:requestParams});
  }

  getBuyerInvoicesSummary(fromDate:string, toDate:string):Observable<XpdInvoice[]> {
    let requestParams:HttpParams = new HttpParams();
      requestParams = requestParams.append("username", this.cognito.getCurrentUser());
      requestParams = requestParams.append("fromDate", fromDate);
      requestParams = requestParams.append("toDate", toDate);
    return this.http.get<XpdInvoice[]>(this.getBuyerInvoicesSummaryURL,{params:requestParams})
  }

  getSupplierRelationshipData() : Observable<boolean> {
    let requestParams = {
      username: this.cognito.getCurrentUser() 
    }
    return this.http.get<boolean>(this.getSupplierCompanyRelationshipURL,{params:requestParams});
  }

  getSupplierComapnies() {
    let requestParams = {
      username: this.cognito.getCurrentUser() 
    }
    return this.http.get<CompanyOfferDto[]>(this.getSuppliersURL,{params:requestParams});
  }

  setSupplierOffers(offerType:string, supplierCompanies:CompanyOfferDto[], constantPercentage:number, 
          minPercentage:number, maxPercentage:number, offerStartDate:string, offerEndDate:string) {
    let buyerOfferDto:BuyerDto = {
      username: this.cognito.getCurrentUser(),
      offerTypeId:Number(offerType),
      supplierCompanies:supplierCompanies,
      constantPercentage:constantPercentage,
      minPercentage:minPercentage,
      maxPercentage:maxPercentage,
      offerStartDate:offerStartDate,
      offerEndDate:offerEndDate 
    }
    return this.http.post<boolean>(this.saveSupplierOffersURL,buyerOfferDto);
  }

  getAllOfferTypes() {
    return this.http.get<SysOfferParameter[]>(this.getAllOfferTypesURL);
  }
}
