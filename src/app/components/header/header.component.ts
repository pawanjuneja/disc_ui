import { MoreCompaniesDto } from './../../models/more_companies-dto';
import { BuyerInvoiceService } from './../../services/buyer-invoice.service';
import { SupplierInvoiceServiceService } from './../../services/supplier-invoice-service.service';
import { AuthServiceService } from './../../services/auth-service.service';
import { Router } from '@angular/router';
import { CogServiceService } from './../../services/cog-service.service';
import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { XpdCompany } from 'src/app/models/xpd-company';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  open = true;
  username: string;
  companyName: string;
  @Input() isSupplier:boolean;
  @Input() title:string;
  menuVisible:boolean = false;
  isAdmin:boolean = false;
  isSideBarToggle:boolean = true;
  public isScreensize:number = 767; 
  public innerWidth: any;
  companies:string = "Company1, company 2";
  userCompanies:MoreCompaniesDto;

  constructor(private cogService: CogServiceService,
    private router: Router,
    private authService:AuthServiceService,
    private supplierService:SupplierInvoiceServiceService,
    private buyerService:BuyerInvoiceService,
    ) {
      
     }

  ngOnInit() {  
    this.authService.getUser().subscribe(suc => {
      this.username = suc.username;
      this.isAdmin = suc.isAdmin;
    });
    this.getCompanyName();
    if (this.isSupplier) 
      this.getCompanySupplierRelationshipInformation();
    else
      this.getCompanyBuyerRelationshipInformation();    
    this.innerWidth = (window.screen.width);
    if(this.innerWidth !=null || this.innerWidth !=undefined){
      if(this.innerWidth <= this.isScreensize){           
        document.getElementById('isSideBarToggle').style.display='none'; 
      }else{    
        document.getElementById('isSideBarToggle').style.display='block';  
      } 
    }
    this.getUserCompanies();      
  }

  getUserCompanies() {
    this.companies = "";
    this.authService.getUserCompanies("false").subscribe(suc => {
      this.userCompanies = suc as MoreCompaniesDto;
        this.userCompanies.lstBuyerCompanies.forEach(buyer => {
          this.companies = this.companies + buyer.companyName + ",";
        });
        this.userCompanies.lstSupplierCompanies.forEach(supplier => {
          this.companies = this.companies + supplier.companyName + ",";
        });
        this.companies = this.companies.substr(0,this.companies.length-1);
    },
    error => {
      console.log("Error occured while Fetching companies");
      console.log(error);
    });
  }

  logout() {
    // this.cogService.logout().subscribe((res) => {
    //   if (res === true) {
    //     this.authService.logout();
    //     localStorage.clear();
    //     this.router.navigate(['/login']);
    //   } else {
    //     alert('Something Went Wrong...');
    //   }
    // });
        this.authService.logout();
        localStorage.clear();
        this.router.navigate(['/login']);
  }
  toggle() {
    if (this.open === true) {
      document.getElementById('toggle1').style.marginLeft = '-230px';
      document.getElementById('demo1').style.marginLeft = '0px';
      this.open = false;
    } else {
      document.getElementById('toggle1').style.marginLeft = '0px';
      document.getElementById('demo1').style.marginLeft = '230px';
      document.getElementById('toggle1').style.transition = '.15s';
      this.open = true;
    }
  }
  mobileToggle(){      
    if (this.isSideBarToggle) {
      document.getElementById('isSideBarToggle').style.display='block';
      this.isSideBarToggle = false;
    } else {         
      document.getElementById('isSideBarToggle').style.display='none';  
      this.isSideBarToggle = true; 
    }
  }
  getCompanyName() {
    this.authService.getUserCompany().subscribe(suc => {
      this.companyName = suc.companyName;
    },
    error => {
      console.log(error);  
    });
  }

  getCompanySupplierRelationshipInformation() {
    this.supplierService.getBuyerRelationshipData().subscribe (suc => {
      this.menuVisible = suc;
    });
  }

  getCompanyBuyerRelationshipInformation() {
    this.buyerService.getSupplierRelationshipData().subscribe (suc => {
      this.menuVisible = suc;
    });
  }

}
