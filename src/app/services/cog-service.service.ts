import { Router } from '@angular/router';
import { Injectable, OnInit } from '@angular/core';
import { CognitoUserPool, AuthenticationDetails, CognitoUser, CognitoUserSession, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Observable, Observer } from 'rxjs';
import * as jwtDecode from 'jwt-decode';
import { SupplierInvoiceServiceService } from './supplier-invoice-service.service';


@Injectable()
export class CogServiceService implements OnInit {
  authenticated = false;
  valid: boolean;
  session: CognitoUserSession = null;
  user: CognitoUser;
  POOL_DATA;
  userPool:CognitoUserPool;

  constructor(private router: Router) {
    if (sessionStorage.getItem('clientId') !== null) {
      this.registerUserPool();
    }
  }

  ngOnInit() { 
    this.valid = false; 
    this.initializeCognito();
  }

  initializeCognito() {
    if (this.userPool === undefined) {
      this.registerUserPool();
    }
  }

  registerUserPool() {
    this.POOL_DATA = {
      UserPoolId: sessionStorage.getItem('userPoolId'),
      ClientId: sessionStorage.getItem('clientId')
    };
    this.userPool = new CognitoUserPool(this.POOL_DATA);
  }

  onLogin(un: string, pwd: string): Observable<boolean> {
    const authData = {
    Username: un,
    Password: pwd
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: un,
      Pool: this.userPool
    };
    const cognitoUser = new CognitoUser(userData);
    this.user = cognitoUser;
    const that = this;
    that.valid = false;
    return Observable.create((observer: Observer<boolean>) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: result => {
          localStorage.setItem('auth', result.getAccessToken().getJwtToken());
          localStorage.setItem('ID', result.getIdToken().getJwtToken());

          observer.next(true);
          observer.complete();
        },
        onFailure: error => {
          console.log(error);
          observer.next(false);
          observer.complete();
        },
        newPasswordRequired: () => {
          cognitoUser.completeNewPasswordChallenge(authData.Password, {}, {
            onSuccess: () => {
              alert('You have currently logged in with your temporary password.\n'
              + 'Kindly go to "Change Password" section to set your new password.'
              );
              observer.next(true);
              observer.complete();
            },
            onFailure: () => {
              alert('Oops! Something went wrong.\nPlease try again later.\n\n' +
              'If it still doesnot work,please contact us at support@xpedize.com');
              observer.next(false);
              observer.complete();
            }
          });
        }
      });
    });

    }

    onForgotPassword(un: string): Observable<string> {
      const userData = {
        Username: un,
        Pool: this.userPool
      };
      const cognitUser = new CognitoUser(userData);
      return Observable.create((observer: Observer<string>) => {
        cognitUser.forgotPassword({
          onSuccess(data: any) {
            observer.next('true');
            observer.complete();
          },
          onFailure(err) {
            observer.next(err.message);
            console.log(err.message);
            observer.complete();
          },
          inputVerificationCode() {}
        });
      });
    }

    onConfirmPassword(un: string, code: string, npwd: string): Observable<string> {
      const userData = {
        Username: un,
        Pool: this.userPool
      };
      const cognitUser = new CognitoUser(userData);
      return Observable.create((observer: Observer<string>) => {
        cognitUser.confirmPassword(code, npwd, {
          onSuccess() {
            observer.next('true');
            observer.complete();
          },
          onFailure(err) {
            observer.next(err.message);
            console.log(err);
            observer.complete();
          }
        });
      });
    }

    getAuthenticatedUser() {
      return this.userPool.getCurrentUser();
    }

    getCurrentUser(): string {
      try {
        const value = jwtDecode(localStorage.getItem('ID'));
        return value.email;
      } catch (error) {
        console.log(error);
        this.logout().subscribe((res) => {
          localStorage.clear();
          this.router.navigate(['/login']);
          return false;
        });
      }
    }

    isUserSessionValid(): boolean {
      if (this.userPool == undefined) {
        localStorage.clear();
        this.router.navigate(['/login']);
        return false;
      }
      else {
        const cogUser: CognitoUser = this.userPool.getCurrentUser();
        if (cogUser != null) {
          return cogUser.getSession((err, session) => {
            if (err) {
              this.logout().subscribe((res) => {
                localStorage.clear();
                this.router.navigate(['/login']);
                return false;
              });
            } else {
              return true;
            }
        });
      }
    }
  }
  getUserSession(): Observable<CognitoUserSession> {
    return this.getAuthenticatedUser().getSession(function(err, session) {
        return session;
    });
  }

  logout(): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      if (this.getAuthenticatedUser()) {
        this.getAuthenticatedUser().signOut();
      observer.next(true);
      observer.complete();
      }
    });
  }

  updateUserMobileNumber(mob: string): Observable<string> {
    const attrList = [];
    const mobNumber = '+91' + mob;
    const userMobileNumber = {
      Name: 'phone_number',
      Value: mobNumber
    };
    attrList.push(new CognitoUserAttribute(userMobileNumber));
    const copyUser: CognitoUser = this.user;
    return Observable.create((observer: Observer<string>) => {
      if (this.user === null || this.user === undefined) {
        this.user = this.getAuthenticatedUser();
        this.user.updateAttributes(attrList, (err, result) => {
          if (err) {
            observer.next('Oops! Something went wrong.\nPlease try again later.\n\n' +
            'If it still doesnot work,please contact us at\n' +
            'info@xpedize.com | +91 9810325445 | +91 9820670506');
            observer.complete();
        } else {
          this.user.getAttributeVerificationCode('phone_number', {
            onFailure(er: Error) {
              console.log(er.message);
            },
            onSuccess() {},
            inputVerificationCode() {
            const verificationCode = prompt('Please input verification code: ' , '');
            this.user.verifyAttribute('phone_number', verificationCode, this);
            }
          });
          observer.next('true');
          observer.complete();
        }
        });
    } else {
      this.user.updateAttributes(attrList, (err, result) => {
        if (err) {
          observer.next(err.message);
          observer.complete();
      } else {
          this.user.getAttributeVerificationCode('phone_number', {
            onSuccess: () => {
            },
            onFailure: (er) => {
              observer.next(er.message);
              observer.complete();
            },
            inputVerificationCode() {
            const verificationCode = prompt('Please input verification code: ' , '');
            if ( (verificationCode.length > 0) && (verificationCode !== null)
            && (verificationCode !== undefined) && (verificationCode !== '')) {
              setTimeout(() => {
                copyUser.verifyAttribute('phone_number', verificationCode, {
                  onSuccess: () => {
                    observer.next('true');
                    observer.complete();
                  },
                  onFailure: (ee) => {
                    observer.next(ee.message);
                    observer.complete();
                  }
                });
              }, 1000);
            } else {
              observer.next('Transaction Cancelled...!\nUnable to update mobile number\nPlease try again later');
              observer.complete();
            }
            }
          });
      }
      });
    }
    });
  }

  changeUserPassword (oldPwd, newPwd): Observable<string> {
        if (this.user === null || this.user === undefined) {
        let status = '';
        const authData = {
        Username: this.getCurrentUser(),
        Password: oldPwd
        };
        const authDetails = new AuthenticationDetails(authData);
        const userData = {
          Username: this.getCurrentUser(),
          Pool: this.userPool
        };
        const cognitoUser: CognitoUser = new CognitoUser(userData);
        return Observable.create( (observer: Observer<string>) => {
          cognitoUser.authenticateUser(authDetails, {
            onFailure(err) {
                // status = 'Wrong Old Password';
                status = err.message;
                console.log(status);
                observer.next(status);
                observer.complete();
            }, onSuccess(data) {
                this.user = cognitoUser;
                cognitoUser.changePassword(oldPwd, newPwd, (err, result) => {
                  if (err) {
                    status = err.message;
                    observer.next(status);
                    observer.complete();
                  } else {
                    status = 'Password Changed Successfully...!';
                    observer.next(status);
                    observer.complete();
                  }
                });
            }
          });
        } );
    } else {
          const cogUser: CognitoUser = this.user;
          return Observable.create((observer: Observer<string>) => {
            cogUser.changePassword(oldPwd, newPwd, (err, result) => {
              if (err) {
                observer.next(err.message);
                observer.complete();
              } else {
                observer.next('Password Changed Successfully...!');
                observer.complete();
              }
            });
          });
  }
}
}
