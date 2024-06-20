export interface XpdInvoiceOffer {
    id:number;
    annualPercentage:number;
	discountAmount:number;
	daysRemaining:number;
	discountPercent30Days:number;
	appliedDiscount:number;
	netAmount:number;
	newDueDate:Date;
	dueAmount:number;
}