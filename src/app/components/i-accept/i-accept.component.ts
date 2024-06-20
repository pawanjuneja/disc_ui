import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { SupplierInvoiceServiceService } from '../../services/supplier-invoice-service.service';
import { AppUtil } from '../../app-util';
import { CogServiceService } from 'src/app/services/cog-service.service';

@Component({
  selector: 'app-i-accept',
  templateUrl: './i-accept.component.html',
  styleUrls: ['./i-accept.component.css']
})
export class IAcceptComponent implements OnInit {
  @ViewChild('openModal') openModal: ElementRef;
  @ViewChild('usrForm') form: NgForm;
  isTNC: boolean;
  isPANVerified = false;
  mobileNumberLength: number;
  showWaiting = false;

    constructor(private router: Router, private invoiceService: SupplierInvoiceServiceService,
                private cognito:CogServiceService) {
      if(this.cognito.getCurrentUser() == undefined || this.cognito.getCurrentUser()=='' || this.cognito.getCurrentUser() == null) {
        AppUtil.reDirectToLogin(router);
      }
     }

    ngOnInit() {
      this.invoiceService.getAuthDetails().subscribe((response) => {
        this.isTNC = response as boolean;
        this.checkAuth();
      });
    }

    onSubmit() {
      const PAN = this.form.value.pan;
      const MOB = this.form.value.add;
      this.invoiceService.verfiyPAN(PAN).subscribe((response) => {
        this.isPANVerified = response as boolean;
        if (this.isPANVerified === true) {
          this.saveMobileNumber(MOB);
        } else {
          alert('Wrong Company PAN Number...!\n' +
          'info@xpedize.com | +91 9810325445 | +91 9820670506');
        }
      });
    }

    saveMobileNumber(mob: string) {
    this.cognito.updateUserMobileNumber(mob).subscribe((res) => {
      this.showWaiting = true;
      if ((res as string) === 'true') {
        this.invoiceService.saveUserMob(mob).subscribe((response) => {
          console.log('User tnc Done: ' + response);
          if (response as boolean) {
            this.checkRole();
            this.showWaiting = false;
          } else {
            this.showWaiting = false;
            alert('Unable to process your Request..!Please try after sometime\n' +
            'If it still doesnot work,please contact us at support@xpedize.com');
            this.onReject();
          }
        });
        // this.showWaiting = false;
      } else {
        alert( (res as string) );
              this.onReject();
      }
    });
    }

    onReject() {
      this.router.navigate(['/login']);
    }

    checkAuth() {
      if (this.isTNC === false) {
        this.openModal.nativeElement.click();
      } else if ( this.isTNC === true ) {
          this.checkRole();
      } else {
      }
    }

    checkRole() {
      this.invoiceService.checkIsBuyer().subscribe((res) => {
        const result: boolean = res as boolean;
        if (result === true) {
          this.router.navigate(['/buyer-pending-approval']);
        } else {
          this.router.navigate(['/supplier-dashboard']);
        }
      });
    }

}
