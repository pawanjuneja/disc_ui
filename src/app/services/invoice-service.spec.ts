import { TestBed, inject } from '@angular/core/testing';

import { InvoiceService } from './invoice-service';

describe('InvoiceServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvoiceService]
    });
  });

  it('should be created', inject([InvoiceService], (service: InvoiceService) => {
    expect(service).toBeTruthy();
  }));
});
