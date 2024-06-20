import { CustomHttpInterceptor } from './services/custom-http-interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppComponent } from './app.component';
import { SupplierDashboardComponent } from './components/supplier-dashboard/supplier-dashboard.component';
import { SupplierDaysEarlyComponent } from './components/supplier-days-early/supplier-days-early.component';
import { SupplierUnderClearingComponent } from './components/supplier-under-clearing/supplier-under-clearing.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { BuyerAccountPayableComponent } from './components/buyer-account-payable/buyer-account-payable.component';
import { BuyerPendingApprovalComponent } from './components/buyer-pending-approval/buyer-pending-approval.component';
import { BuyerSavingsAchievedComponent } from './components/buyer-savings-achieved/buyer-savings-achieved.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SupplierInvoiceServiceService } from './services/supplier-invoice-service.service';
import { BuyerDashboardComponent } from './components/buyer-dashboard/buyer-dashboard.component';
import { SupplierSidebarComponent } from './components/supplier-sidebar/supplier-sidebar.component';
import { BuyerSidebarComponent } from './components/buyer-sidebar/buyer-sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AgreementComponent } from './components/agreement/agreement.component';
import { IAcceptComponent } from './components/i-accept/i-accept.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AuthServiceService } from './services/auth-service.service';
import { LoginComponent } from './components/login/login.component';
import { FgtPwdComponent } from './components/fgt-pwd/fgt-pwd.component';
import { CogServiceService } from './services/cog-service.service';
import {TooltipModule} from 'ngx-tooltip';
import { HeaderComponent } from './components/header/header.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NgxLoadingModule } from 'ngx-loading';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BuyerChangePasswordComponent } from './components/buyer-change-password/buyer-change-password.component';
import { LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import { BuyerSummaryComponent } from './components/reports/buyer-summary/buyer-summary.component';
import { ShortenPipePipe } from './shorten-pipe.pipe';
import { PopoverModule } from 'ng2-popover';
import { BuyerDiscountSetterComponent } from './components/buyer-discount-setter/buyer-discount-setter.component';
import { BuyerUnderClearingComponent } from './components/buyer-under-clearing/buyer-under-clearing.component';
import { MatMenuModule } from '@angular/material';
import { SetPaymentDatesComponent } from './components/set-payment-dates/set-payment-dates.component'
import { NgMaterialMultilevelMenuModule } from 'ng-material-multilevel-menu';
import { HolidayListComponent } from './components/holiday-list/holiday-list.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { CreateUserComponent } from './components/user/create-user/create-user.component';
import { UiSwitchModule } from 'ngx-toggle-switch';

@NgModule({
  declarations: [
    AppComponent,
    SupplierDashboardComponent,
    SupplierDaysEarlyComponent,
    SupplierUnderClearingComponent,
    NavBarComponent,
    BuyerAccountPayableComponent,
    BuyerPendingApprovalComponent,
    BuyerSavingsAchievedComponent,
    BuyerDashboardComponent,
    SupplierSidebarComponent,
    BuyerSidebarComponent,
    FooterComponent,
    PrivacyPolicyComponent,
    AgreementComponent,
    IAcceptComponent,
    LandingPageComponent,
    LoginComponent,
    FgtPwdComponent,
    HeaderComponent,
    ChangePasswordComponent,
    LoadingSpinnerComponent,
    BuyerChangePasswordComponent,
    BuyerSummaryComponent,
    ShortenPipePipe,
    BuyerDiscountSetterComponent,
    BuyerUnderClearingComponent,
    SetPaymentDatesComponent,
    HolidayListComponent,
    UserListComponent,
    CreateUserComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    TooltipModule,
    NgxPaginationModule,
    NgxLoadingModule,
    PopoverModule,
    MatMenuModule,
    NgMaterialMultilevelMenuModule,
    UiSwitchModule
  ],
  providers: [SupplierInvoiceServiceService,
    AuthServiceService,
    CogServiceService, { provide: HTTP_INTERCEPTORS, useClass: CustomHttpInterceptor, multi: true },
              {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
