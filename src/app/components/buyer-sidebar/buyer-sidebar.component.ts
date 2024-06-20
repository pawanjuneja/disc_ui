import { XpdCompany } from './../../models/xpd-company';
import { AuthServiceService } from './../../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoreCompaniesDto } from 'src/app/models/more_companies-dto';

@Component({
  selector: 'buyer-sidebar',
  templateUrl: './buyer-sidebar.component.html',
  styleUrls: ['./buyer-sidebar.component.css']
})
export class BuyerSidebarComponent implements OnInit {

  constructor( private authService:AuthServiceService, private router:Router) { }
  showCompanies:boolean = true;
  userCompanies:MoreCompaniesDto;
  moreCompaniesFound:boolean = false;
  userIsAdmin:boolean = false;
  config = {
    paddingAtStart: true,
    interfaceWithRoute: true,
    classname: 'sidebar-menu',
    selectedListFontColor: `#00a65a`,
    highlightOnSelect: true,
    highlightColor:'#00a65a',
    collapseOnSelect: true,
    rtlLayout: false
  };
  appitems = [
    {
        label: 'Admin',
        items: [
            {
                label: 'Set Supplier Percentage',
                link: '/buyer-settings'
            },
            {
                label: 'Update Approved Invoices',
                link: '/buyer-under-clearing'
            },
            {
              label: 'Set Payment Dates',
              link: '/set-payment-dates'
          },
          {
            label: 'Holidays List',
            link: '/holiday-list'
        }
        ]
    },
];

  ngOnInit() {
    this.authService.getUserCompanies("false").subscribe(suc => {
      this.userCompanies = suc as MoreCompaniesDto;
      if (this.userCompanies.lstBuyerCompanies.length > 0 || this.userCompanies.lstSupplierCompanies.length>0)
        this.moreCompaniesFound = true;
    },
    error => {
      console.log("Error occured while Fetching companies");
      console.log(error);
    });
    this.authService.getUser().subscribe(suc => {
      this.userIsAdmin = suc.isAdmin;
    });
  }

  changeCurrentCompany(newCompany:XpdCompany, isSupplier:boolean) {
    this.authService.changeCurrentCompany(newCompany.id).subscribe( suc => {
      if (suc) {
        if (isSupplier) {
          this.router.navigateByUrl("supplier-dashboard");
        } else {
          window.location.reload();
        }
      }
    }, 
    error => {
      console.log("An error occurred");
      console.log(error);
    });
  }

}
