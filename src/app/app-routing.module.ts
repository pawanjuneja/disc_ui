import { CreateUserComponent } from './components/user/create-user/create-user.component';
import { HolidayListComponent } from './components/holiday-list/holiday-list.component';
import { BuyerUnderClearingComponent } from './components/buyer-under-clearing/buyer-under-clearing.component';
import { BuyerDiscountSetterComponent } from './components/buyer-discount-setter/buyer-discount-setter.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import {SupplierDashboardComponent} from './components/supplier-dashboard/supplier-dashboard.component';
import {SupplierUnderClearingComponent} from './components/supplier-under-clearing/supplier-under-clearing.component';
import {SupplierDaysEarlyComponent} from './components/supplier-days-early/supplier-days-early.component';
import {BuyerAccountPayableComponent} from './components/buyer-account-payable/buyer-account-payable.component';
import {BuyerPendingApprovalComponent} from './components/buyer-pending-approval/buyer-pending-approval.component';
import {BuyerSavingsAchievedComponent} from './components/buyer-savings-achieved/buyer-savings-achieved.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AgreementComponent } from './components/agreement/agreement.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { FgtPwdComponent } from './components/fgt-pwd/fgt-pwd.component';
import { IAcceptComponent } from './components/i-accept/i-accept.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { BuyerChangePasswordComponent } from './components/buyer-change-password/buyer-change-password.component';
import { SetPaymentDatesComponent } from './components/set-payment-dates/set-payment-dates.component';
import { UserListComponent } from './components/user/user-list/user-list.component';

const appRoutes: Routes = [
  {path: 'supplier-dashboard', component: SupplierDashboardComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'supplierUnderClearing', component: SupplierUnderClearingComponent},
  {path: 'supplierDaysRecievedEarly', component: SupplierDaysEarlyComponent},
  {path: 'buyer-account-payable', component: BuyerAccountPayableComponent},
  {path: 'buyer-pending-approval', component: BuyerPendingApprovalComponent},
  {path: 'buyer-savings-achieved', component: BuyerSavingsAchievedComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'terms', component: AgreementComponent},
  {path: 'Xpedize', component: LandingPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'forgot-password', component: FgtPwdComponent},
  {path: 'i-accept', component: IAcceptComponent},
  {path: 's/change-password', component: ChangePasswordComponent},
  {path: 'b/buyer-change-password', component: BuyerChangePasswordComponent},
  {path: 'supplier-rate-maintenance', component: BuyerDiscountSetterComponent},
  {path: 'update-approved-invoices', component: BuyerUnderClearingComponent},
  {path: 'user-list', component: UserListComponent},
  {path: 'create-user', component: CreateUserComponent},
  {path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
