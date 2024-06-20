export interface XpdInvoice {
    id: number;
    invoiceNumber: string;
    invoiceDate: Date;
    stateOfSupply: string;
    invoiceType: string;
    gstStatus: string;
    isUinRegistered: boolean;
    returnFilingDate: Date;
    isReverseCharge: boolean;
    originalInvoiceDate: Date;
    originalInvoicenumeric: string;
    originalCustomerBillingGstin: string;
    isActive: boolean;
    ecomMarketPlaceGstin: string;
    isBillOfSupply: boolean;
    isTdsDeducted: boolean;
    documentType: string;
    balance: number;
    paymentStatus: string;
    discountAmount: number;
    totalTrasactionValue: number;
    dueDate: Date;
}