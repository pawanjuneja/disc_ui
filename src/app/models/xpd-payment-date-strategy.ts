import { XpdCompany } from "./xpd-company";

export interface XpdPaymentDateStrategy {
    id?:number;
    workingDays?:string;
    paymentDateStrategy?:string;
    minimumDaysGap?:number;
    particularDayOfWeek?:string;
    company?:XpdCompany;
}