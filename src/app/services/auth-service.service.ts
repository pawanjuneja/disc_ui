import { PaymentDateStrategyDto } from './../models/strategy-and-company-dto';
import { CognitoPoolDto } from './../models/cognito-pool-dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { XpdCompany } from './../models/xpd-company';
import { AppConstants } from './../app-constants';
import { map } from 'rxjs/operators';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { XpdUser } from '../models/xpd-user';
import { CogServiceService } from './cog-service.service';
import { AuthRequest } from '../models/authrequest';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
auth = false;

constructor(private http: HttpClient, private cognito: CogServiceService, private oldService: Http) { }

findCompanyNameURL:string = AppConstants.BASE_SERVICE_URL + "user/company";
findUser:string = AppConstants.BASE_SERVICE_URL + "user/getUser";
getAllUsersURL:string = AppConstants.BASE_SERVICE_URL + "user/getUsers";
loginUser:string = AppConstants.BASE_SERVICE_URL + "user/login";
logoutUser:string = AppConstants.BASE_SERVICE_URL + "user/logout";
findUserCompaniesURL:string = AppConstants.BASE_SERVICE_URL + "user/getUserCompanies";
getAllRelatedCompaniesURL:string = AppConstants.BASE_SERVICE_URL + "user/getAllRelatedCompanies";
findAllUserCompaniesURL:string = AppConstants.BASE_SERVICE_URL + "user/getAllUserCompanies";
findAllCompaniesWithPaymentDateStrategyURL:string = AppConstants.BASE_SERVICE_URL + "user/getAllUserCompaniesWithPaymentStrategies";
changeCurrentCompanyURL:string = AppConstants.BASE_SERVICE_URL + "user/setCurrentCompany";
poolPropertiesUrl = AppConstants.BASE_SERVICE_URL + 'user/userPoolConfig';
savePwdURL = AppConstants.BASE_SERVICE_URL + 'user/savePwd';
saveUserURP = AppConstants.BASE_SERVICE_URL + 'user/saveUser';
deleteUserURP = AppConstants.BASE_SERVICE_URL + 'user/deleteUser';
preLoginURL = AppConstants.BASE_SERVICE_URL + 'user/preLogin';

  preLogin(userName: string, password: string) {
    const authrequest: AuthRequest = {
      userName: userName,
      password: password,
      applicationName: 'invoicemanager'
    };
    return this.oldService.post(this.preLoginURL, authrequest);
  }
  getAuthDetails(): Observable<boolean> {
    // console.log('Auth Details Fetched from service');
    return of(this.auth);
  }

  getUserCompany():Observable<XpdCompany> {
    let parameters = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.get<XpdCompany>(this.findCompanyNameURL,{params: parameters});
  }

  getAllUserCompanies():Observable<XpdCompany[]> {
    let parameters = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.get<XpdCompany[]>(this.findAllUserCompaniesURL,{params: parameters});
  }

  getAllUserCompaniesWithPaymentStrategies():Observable<PaymentDateStrategyDto[]> {
    let parameters = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.get<PaymentDateStrategyDto[]>(this.findAllCompaniesWithPaymentDateStrategyURL,{params: parameters});
  }


  getUser():Observable<XpdUser> {
    let parameters = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.get<XpdUser>(this.findUser,{params: parameters});
  }

  login() {
    let parameters = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.get(this.loginUser,{params: parameters});
  }

  logout() {
    let parameters = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.get(this.logoutUser,{params: parameters});
  }

  getCognitoConfiguration() {
    return this.oldService.get(this.poolPropertiesUrl);
  }

  getUserCompanies(isSupplier:string) {
    let parameters = {
      username: this.cognito.getCurrentUser(),
      isSupplier: isSupplier
    }
    return this.http.get(this.findUserCompaniesURL,{params: parameters});
  }

  getAllRelatedCompanies() {
    let parameters = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.get(this.getAllRelatedCompaniesURL,{params: parameters});
  }

  changeCurrentCompany(companyId:number) {
    let parameters = {
      username: this.cognito.getCurrentUser(),
      companyId: companyId.toString()
    }
    return this.http.get(this.changeCurrentCompanyURL,{params: parameters});
  }


  getAllUsers() {
    let parameters = {
      username: this.cognito.getCurrentUser()
    }
    return this.http.get(this.getAllUsersURL,{params: parameters});
  }

  savePwd(pass: string) {
    const parameters = {
      username: this.cognito.getCurrentUser(),
      pwd: pass
    };
    return this.oldService.get(this.savePwdURL, {params: parameters});
  }

  saveUser(user:XpdUser) {
    const parameters = {
      username: this.cognito.getCurrentUser()
    };
    return this.http.post(this.saveUserURP,user, {params: parameters});
  }

  deleteUsers(users:XpdUser[]) {
    const parameters = {
      username: this.cognito.getCurrentUser()
    };
    return this.http.post(this.deleteUserURP, users, {params: parameters});
  }

}
