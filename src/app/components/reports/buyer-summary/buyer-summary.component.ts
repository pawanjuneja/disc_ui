import { BuyerInvoiceService } from './../../../services/buyer-invoice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buyer-summary',
  templateUrl: './buyer-summary.component.html',
  styleUrls: ['./buyer-summary.component.css']
})
export class BuyerSummaryComponent implements OnInit {

  // displayedColumns: string[] = ['invoiceNumber', 'supplierName', 'submissionDate', 'invoiceStatus'];
  buyerInvoices:any=[];
  
  displayedColumns = [
    { prop: 'invoiceNumber' },
    { prop: 'companyName' },
    { prop: 'submissionDate', sortable: false },
    { prop: 'buyerDesc' }
  ];
  loadingIndicator: boolean = true;
  reorderable: boolean = true;

  fromDate:string;
  toDate:string;

  constructor(private buyerInvoiceService:BuyerInvoiceService) { }
  
  ngOnInit() {
  }
  
  fetchBuyerReport() {
    this.buyerInvoiceService.getBuyerInvoicesSummary(this.fromDate,this.toDate).subscribe(suc => {
      this.buyerInvoices = suc;
    })
  }

}
