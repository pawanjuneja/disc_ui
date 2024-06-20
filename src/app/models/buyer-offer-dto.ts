import { CompanyOfferDto } from './company-offer-dto';
import { XpdCompany } from './xpd-company';
export interface BuyerDto {
    username:string,
    offerTypeId:number, 
    supplierCompanies:CompanyOfferDto[], 
    constantPercentage:number, 
    minPercentage:number, 
    maxPercentage:number, 
    offerStartDate:string, 
    offerEndDate:string
}
