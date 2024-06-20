import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import { HttpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {MyDateRangePickerModule} from  'mydaterangepicker'
import { AppRoutingModule } from './app.routing';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { MyDatePickerModule } from 'mydatepicker';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SupplierDashboardComponent } from './components/supplier-dashboard/supplier-dashboard.component';
import { InvoiceService } from './services/invoice-service';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    SupplierDashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    CollapseModule.forRoot(),
    MyDateRangePickerModule ,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    MyDatePickerModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    BrowserAnimationsModule
  ],
  providers: [InvoiceService],
  bootstrap: [AppComponent]
})
export class AppModule {}
