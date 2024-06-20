import { XpdInvoice } from './../../models/XpdInvoice';
import { XpdOrgMaster } from './../../models/XpdOrgMaster';
import { InvoiceService } from './../../services/invoice-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'supplier-dashboard',
  templateUrl: './supplier-dashboard.component.html',
  styleUrls: ['./supplier-dashboard.component.css']
})
export class SupplierDashboardComponent implements OnInit {

  lstCompanyLoations:XpdOrgMaster[];
  selectedLocation:XpdOrgMaster;
  lstInvoices:XpdInvoice[];

  constructor(private invoiceService:InvoiceService) { }

  ngOnInit() {
    this.invoiceService.getLocations().subscribe (suc => {
      this.lstCompanyLoations = suc;
      console.log(this.lstCompanyLoations);
    });
  }

  getInvoicesForLocation(selectedLocationId:number) {
    console.log(selectedLocationId);
    this.invoiceService.getInvoices(selectedLocationId).subscribe (suc => {
      this.lstInvoices = suc;
      console.log(this.lstInvoices);
    });
  }

}
