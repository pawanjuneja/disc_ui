import { AppConstants } from './app-constants';
import { Router } from "@angular/router";
import { SupplierInvoiceServiceService } from "./services/supplier-invoice-service.service";

export class AppUtil {
    private static invoiceService: SupplierInvoiceServiceService;
    
    static checkDateIsSame(firstDate:Date, secondDate:Date) {
        return (firstDate.getDate() == secondDate.getDate() 
        && firstDate.getMonth() == secondDate.getMonth() 
        && firstDate.getFullYear() == secondDate.getFullYear()) 
    }
    
    static checkGreaterThanFromDate(fromDate:Date, currentDate:Date) {
        return (fromDate.valueOf() <= currentDate.valueOf())
    }

    static checkLessThanToDate(toDate:Date, currentDate:Date) {
        return (toDate.valueOf() >= currentDate.valueOf())
    }

    static checkDateRange (currentDate:Date, filterStartDate:string, filterEndDate:string) {
        let checkStartDate:boolean = false;
        let checkEndDate:boolean = false;
        let isValid:boolean = true;

        if (filterStartDate != "") 
            checkStartDate = true;
        if (filterEndDate != "") 
            checkEndDate = true;
        
        if (checkStartDate) {
            if(AppUtil.checkGreaterThanFromDate(new Date(filterStartDate), currentDate)) 
            isValid = true;
            else {
            isValid = false;
            return isValid;
            }
        }
        if (checkEndDate) {
            if (AppUtil.checkLessThanToDate(new Date(filterEndDate), currentDate)) 
            isValid = true;
            else
            isValid = false;
        }
        return isValid; 
    }

    static getDiscountAmount(totalValue:number, remainingDays:number, percentage:number):number {
        let discountValue:number = 0;
        let disPercent:number = percentage / 30 * remainingDays;
        discountValue = totalValue * disPercent / 100;
        return discountValue;
    }

    static reDirectToHomepage(router: Router) {
        router.navigate(['/i-accept']);
        // router.navigate(['/supplier-dashboard']);
    }

    static reDirectToLogin(router: Router) {
        router.navigate(['/login']);
    }

    static getStyleForSupplierUnderClearing(sts: string) {
        if (sts === AppConstants.POSTED_ON_ERP_XPD_DESC) {
          return '#ff6f00';
        } else if (sts === AppConstants.PAID_XPD_DESC) {
          return '#00733e';
        } else if (sts === AppConstants.VERIFICATION_PENDING_XPD_DESC || 
                sts === AppConstants.FIRST_APPROVAL_XPD_DESC || 
                sts === AppConstants.SECOND_APPROVAL_XPD_DESC) {
          return '#3399ff';
        } else if (sts === AppConstants.REJECTED_XPD_DESC) {
          return 'red';
        } else if (sts === AppConstants.OPEN_XPD_DESC) {
          return '#5264AE';
        } else if (sts === AppConstants.APPROVED_XPD_DESC) {
              return  '#99cc66';
        } else {
          return 'lightblue';
        }
      }
  
  
      static getStyleForSupplierDashboard(sts: boolean) {
          if (sts === true) {
            return '#99cc66';
          } else {
            return '#f47564';
          }
      }
  
      static getStyleForBuyerPendingApproval(sts: string) {
        if (sts === AppConstants.VERIFICATION_PENDING_XPD_DESC) {
          return '#ff6f00';
        } else if (sts === AppConstants.FIRST_APPROVAL_XPD_DESC) {
          return '#f39c12';
        } else if (sts === AppConstants.PAID_XPD_DESC) {
          return '#00733e';
        }  else if (sts === AppConstants.REJECTED_XPD_DESC) {
          return 'red';
        } else if (sts === AppConstants.OPEN_XPD_DESC) {
          return '#5264AE';
        } else if (sts === AppConstants.APPROVED_XPD_DESC) {
              return  '#99cc66';
        } else if (sts === AppConstants.SECOND_APPROVAL_XPD_DESC) {
            return '#367fa9';
        } else if (sts === AppConstants.POSTED_ON_ERP_XPD_DESC) {
          return '#3c8dcb';
        } else {
          return 'lightblue';
        }
      }
}
