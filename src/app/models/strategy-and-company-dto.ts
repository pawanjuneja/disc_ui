import { XpdCompany } from "./xpd-company";
import { XpdPaymentDateStrategy } from "./xpd-payment-date-strategy";

export interface PaymentDateStrategyDto {
    company?:XpdCompany;
    paymentStrategy?:XpdPaymentDateStrategy;
}