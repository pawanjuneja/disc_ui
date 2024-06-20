import { XpdCompany } from 'src/app/models/xpd-company';
export interface XpdUser {
    id?:number;
    username?:string;
    isBuyer?:boolean;
    isTNC?:boolean;
    isApprover?:boolean;
    isChecker?:boolean;
    isAdmin?:boolean;
    mobileNumber?:string;
    selected?:boolean;
    linkedCompany?:XpdCompany[];
    xpdcompany?:XpdCompany;
    strCompanies?:string;

}