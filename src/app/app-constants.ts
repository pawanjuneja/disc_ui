import { SupplierInvoiceServiceService } from './services/supplier-invoice-service.service';
import { Router } from '@angular/router';

export class AppConstants {
    public static pool = {
        UserPoolId: '',
        ClientId: ''
      };

    // public static BASE_SERVICE_URL = '/';
    public static BASE_SERVICE_URL = 'http://localhost:8080/';

    public static FIRST_APPROVAL_XPD_DESC = 'Verified by Checker';
    public static SECOND_APPROVAL_XPD_DESC = 'Approved by Level 1';
    public static VERIFICATION_PENDING_XPD_DESC = 'Requested by Supplier';
    public static APPROVED_XPD_DESC = 'Approved';
    public static POSTED_ON_ERP_XPD_DESC = 'Posted on ERP';
    public static PAID_XPD_DESC = 'Paid';
    public static REJECTED_XPD_DESC = 'Rejected';
    public static OPEN_XPD_DESC = 'Open';
}
