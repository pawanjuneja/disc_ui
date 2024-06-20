export interface InvoiceStatus {
    id: number;
    supplierDesc: string;
    buyerDesc: string;
    xpdDesc: string;
    workflowSequence: number;
    daysReceivedEarly: number;
}
