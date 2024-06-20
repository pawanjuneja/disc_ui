import { XpdCompany } from './xpd-company';
export interface XpdInvoice {
    id: number;
    invoiceNumber: string;
    invoiceDate: Date;
    totalTrasactionValue: number;
    dueDate: Date;
    companyName:string;
    selected:boolean;
    enabledForStatusChange:boolean;
    supplierDesc:string;
	buyerDesc:string;
	xpdDesc:string;
	currency:string;
	
	//invoice offer
	annualPercentage:number;
	discountAmount:number;
	daysRemaining:number;
	discountPercent30Days:number;
	appliedDiscount:number;
	netAmount:number;
	newDueDate:Date;
	dueAmount:number;
	clearingDate:Date;
	submissionDate:Date;
	orgMasterName:string;
	lastApprover:string;
}