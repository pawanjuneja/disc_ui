import { XpdInvoice } from './xpd-invoice';
export interface InvoiceDto {
    xpdInvoice: XpdInvoice;
    daysRemaining: number;
    approved:boolean;
    newPaymentDate:Date;
    newDiscountAmount:number;
    userIsApprover:boolean;
    userIsChecker:boolean;
    notesSummary:string;
    notesDisplay:string;
    actualAmountDue:number;
    actualDiscountPercentage:number;
}
