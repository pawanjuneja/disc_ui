import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CogServiceService } from '../../services/cog-service.service';
import { resolveDirective } from '@angular/core/src/render3/instructions';
import { Router } from '@angular/router';
import { AppUtil } from '../../app-util';
import { SupplierInvoiceServiceService } from 'src/app/services/supplier-invoice-service.service';

@Component({
  selector: 'app-fgt-pwd',
  templateUrl: './fgt-pwd.component.html',
  styleUrls: ['./fgt-pwd.component.css']
})
export class FgtPwdComponent implements OnInit {
  @ViewChild('usrForm') form: NgForm;
  un = '';
  cnfrmOtp = false;
  msg = 'Enter Username';
  changed = 'false';
  type = 'password';

  constructor(private service: CogServiceService, private router: Router,
    private supplierInvoiceService: SupplierInvoiceServiceService) {

   }

  ngOnInit() {
  }
  onSubmit() {
    this.service.onForgotPassword(this.un.toLocaleLowerCase()).subscribe((res) => {
      if ( (res as string) !== 'true') {
        this.cnfrmOtp = false;
        this.msg = res;
        this.setDefaultMessage();
        return;
      }
    }
    );
    this.cnfrmOtp = true;
  }


  verifyOTP() {
    const code = this.form.value.otp;
    const newPass = this.form.value.npwd;
    if (this.un !== '') {
      this.service.onConfirmPassword(this.un.toLocaleLowerCase(), code, newPass).subscribe((response) => {
        this.changed = response as string;
        if (this.changed === 'true') {
          this.msg = 'Password Changed Successfully...Redirecting to Login Page';
          this.supplierInvoiceService.changeForgotPasswordNotification(this.un.toLocaleLowerCase()).subscribe(
            (res) => {
            },
            (err) => {
              console.log(err);
            }
          );
          setTimeout(() => {this.reDirect(); }, 2000);
        } else {
          this.msg = response as string;
          setTimeout( () => {this.msg = 'Enter Username'; }, 4000);
        }
      }
      );
    }
  }

  reDirect() {
    this.router.navigate(['/login']);
  }

  setDefaultMessage() {
    setTimeout( () => {this.msg = 'Enter Username'; }, 6000);
  }

  showHidePassword() {
    if (this.type === 'password') {
      this.type = 'text';
    } else if (this.type === 'text') {
      this.type = 'password';
    }
  }

}


