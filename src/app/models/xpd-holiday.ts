import { XpdCompany } from "./xpd-company";
import { XpdOrgMaster } from "./xpd-org-master";

export interface XpdHoliday {
    id?:number;
    company?: XpdCompany;
    location?:XpdOrgMaster;
    holidayDescription?:string;
    holidayId?:string;
    isNationalHoliday?:boolean;
    holidayDate?:Date;
    selected?:boolean;
    locations?:XpdOrgMaster[];
}