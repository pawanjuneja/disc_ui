import { TestBed, inject } from '@angular/core/testing';

import { BuyerInvoiceService } from './buyer-invoice.service';

describe('BuyerInvoiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuyerInvoiceService]
    });
  });

  it('should be created', inject([BuyerInvoiceService], (service: BuyerInvoiceService) => {
    expect(service).toBeTruthy();
  }));
});
