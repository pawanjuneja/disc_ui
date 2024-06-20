import { XpdCompany } from './../../models/xpd-company';
import { SupplierInvoiceServiceService } from './../../services/supplier-invoice-service.service';
import { AuthServiceService } from './../../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoreCompaniesDto } from 'src/app/models/more_companies-dto';

@Component({
  selector: 'supplier-sidebar',
  templateUrl: './supplier-sidebar.component.html',
  styleUrls: ['./supplier-sidebar.component.css']
})
export class SupplierSidebarComponent implements OnInit {

  constructor( private authService:AuthServiceService, private router:Router) { }

  showCompanies:boolean = true;
  userCompanies:MoreCompaniesDto;
  moreCompaniesFound:boolean = false;
  ngOnInit() {
    this.authService.getUserCompanies("true").subscribe(suc => {
      this.userCompanies = suc as MoreCompaniesDto;
      if (this.userCompanies.lstBuyerCompanies.length > 0 || this.userCompanies.lstSupplierCompanies.length>0)
        this.moreCompaniesFound = true;

    },
    error => {
      console.log("Error occured while Fetching companies");
      console.log(error);
    });
  }

  changeCurrentCompany(newCompany:XpdCompany, isSupplier:boolean) {
    this.authService.changeCurrentCompany(newCompany.id).subscribe( suc => {
      if (suc) {
        if (isSupplier) {
          window.location.reload();
        } else {
          this.router.navigateByUrl("buyer-pending-approval");
        }
      }
    }, 
    error => {
      console.log("An error occurred");
      console.log(error);
    });
  }

}
