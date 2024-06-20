export interface SupplierDashboardDto {
    daysReceivedEarly?: number;
    amountDiscountedTillDate?: number;
    amountUnderClearing?: number;
    numberOfInvoicesUnderClearning?: number;
    totalAmount?: number;
    totalInvoices?: number;
    currencySymbol?: string;
}