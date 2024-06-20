import { XpdOrgMaster } from "./xpd-org-master";

export interface XpdCompany {
    id?: number;
    companyName?: string;
    description?: string;
    // syncToken: string;
    // createdBy: number;
    // createdDate: Date;
    // modifiedBy: number;
    // modifiedDate: Date;
    // legalName: string;
    // email: string;
    // landline: string;
    // mobile: string;
    // fax: string;
    // website: string;
    // pan: string;
    // tan: string;
    // cin: string;
    // iec: string;
    // logo: string;
    // priority: number;
    // stockTicker: string;
    // linkedinPage: string;
    // twitterPage: string;
    // facebookPage: string;
    selected?:boolean;
    isBuyer?: boolean;
    orgMasters?: XpdOrgMaster[];
    // added by vishal
    offerType?: string;
    constantPercentage?: number;
    minPercentage?: number;
    maxPercentage?: number;
    offerStartDate?: Date;
    offerEndDate?: Date;
}
