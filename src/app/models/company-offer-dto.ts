import { SysOfferParameter } from "./sys-offer-parameter";

export interface CompanyOfferDto {
    id:number;	
	companyName:string;
	companyDescription:string;
	offerType:SysOfferParameter;
	constantPercentage:number;
	minPercentage:number;
	maxPercentage:number;
	offerStartDate:Date;
	offerEndDate:Date;
	selected:boolean;
}