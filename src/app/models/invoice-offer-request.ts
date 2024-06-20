import { XpdInvoice } from './xpd-invoice';
import { InvoiceDto } from './invoice-dto';
export interface InvoiceOfferRequest {
    lstInvoices: XpdInvoice[];
    selectedPrice: number;
    nextDueDate: Date;
    username: string;
}
