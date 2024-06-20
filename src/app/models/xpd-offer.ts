export interface XpdOffer {
    id:number;
    offerName:string;
    description:string;
    processingDays:number;
    annualPercentage:number;
    auctionTargetAmmount:number;
    targetAveragePercentage:number;
    netAmount:number;
    fixedOffer:boolean;
    minPercentage:number;
    maxPercentage:number;
}