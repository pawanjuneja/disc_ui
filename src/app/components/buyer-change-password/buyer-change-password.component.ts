import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CogServiceService } from 'src/app/services/cog-service.service';
import { Router } from '@angular/router';
import { AppUtil } from 'src/app/app-util';
import { NgForm } from '@angular/forms';
import { SupplierInvoiceServiceService } from 'src/app/services/supplier-invoice-service.service';

@Component({
  selector: 'app-buyer-change-password',
  templateUrl: './buyer-change-password.component.html',
  styleUrls: ['./buyer-change-password.component.css']
})
export class BuyerChangePasswordComponent implements OnInit {
  @ViewChild('usrForm') form: NgForm;
  @ViewChild('old') op: ElementRef;
  @ViewChild('np') np: ElementRef;
  @ViewChild('cp') cp: ElementRef;
  msg = 'Change Password';
  un: string;
  showWaiting = false;
  oldPwdType = 'password';
  newPwdType = 'password';

  constructor(private cognito: CogServiceService, private router: Router, private supplierInvoiceService: SupplierInvoiceServiceService) {
    if(this.cognito.getCurrentUser() == undefined ||
    this.cognito.getCurrentUser()=='' ||
    this.cognito.getCurrentUser() == null) {
      AppUtil.reDirectToLogin(router);
    }
  }

  ngOnInit() {
    this.un = this.cognito.getCurrentUser();
  }

  changePassword() {
    this.showWaiting = true;
    const op = this.form.value.otp;
    const np = this.form.value.npwd;
    this.cognito.changeUserPassword(op, np).subscribe((res) => {
      this.msg = res as string;
      if (this.msg === 'Password Changed Successfully...!') {
          this.formReset();
          this.supplierInvoiceService.changePasswordNotification().subscribe((res) => {
            // console.log('Sent Notification: '+ (res as boolean));
          });
      }
      this.showWaiting = false;
      setTimeout(() => {
        this.msg = 'Change Password';
      }, 6000);
    });
  }

  formReset() {
    this.op.nativeElement.value = '';
    this.np.nativeElement.value = '';
    this.cp.nativeElement.value = '';
  }

  showHidePassword() {
    if (this.oldPwdType === 'password') {
      this.oldPwdType = 'text';
    } else if (this.oldPwdType === 'text') {
      this.oldPwdType = 'password';
    }
  }

  showHidePassword2() {
    if (this.newPwdType === 'password') {
      this.newPwdType = 'text';
    } else if (this.newPwdType === 'text') {
      this.newPwdType = 'password';
    }
  }
}
