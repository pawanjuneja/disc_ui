import { TestBed, inject } from '@angular/core/testing';

import { SupplierInvoiceServiceService } from './supplier-invoice-service.service';

describe('SupplierInvoiceServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplierInvoiceServiceService]
    });
  });

  it('should be created', inject([SupplierInvoiceServiceService], (service: SupplierInvoiceServiceService) => {
    expect(service).toBeTruthy();
  }));
});
