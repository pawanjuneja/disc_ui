import { BuyerDashboardDto } from './../../models/buyer-dashboard-dto';
import { BuyerInvoiceService } from './../../services/buyer-invoice.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'buyer-dashboard',
  templateUrl: './buyer-dashboard.component.html',
  styleUrls: ['./buyer-dashboard.component.css']
})
export class BuyerDashboardComponent implements OnInit {
  @Input() buyerDashboardDto:BuyerDashboardDto = {};

  @Input() selectedComponent:string;

  constructor() { }

  ngOnInit() {
  }
}
