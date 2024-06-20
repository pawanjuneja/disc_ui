import { XpdInvoice } from './xpd-invoice';

export interface InvoiceApproveRejectRequest {
    approve?: boolean;
    lstInvoices: XpdInvoice[];
    username: string;
}
