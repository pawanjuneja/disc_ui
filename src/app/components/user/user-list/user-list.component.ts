import { CogServiceService } from 'src/app/services/cog-service.service';
import { AuthServiceService } from './../../../services/auth-service.service';
import { XpdUser } from './../../../models/xpd-user';
import { Component, OnInit } from '@angular/core';
import { XpdCompany } from 'src/app/models/xpd-company';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(private authService:AuthServiceService, private cognitoService:CogServiceService) { }

  lstUsers:XpdUser[] = [];
  lstAllUsers:XpdUser[] = [];
  errorOccured:boolean = false;
  errorMessage:string;
  listMode:boolean = true;
  selectedUser:XpdUser = {};
  lstAllCompanies:XpdCompany[] = [];
  defaultCompany:string = '';
  linkedCompanies:string[] = [];
  lstSelectedUsers:XpdUser[] = [];
  disableUsername:boolean = true;
  // sorting variables
  currentSortColumn: string;
  sortAscending: boolean = true;
  filterEmail:string = "";
  filterMobileNumber:string = "";

  ngOnInit() {
    this.authService.getAllUsers().subscribe (suc => {
      this.lstUsers = suc as XpdUser[];
      this.lstAllUsers = suc as XpdUser[];
      this.lstUsers.forEach (user => {
        let companyList:string = user.xpdcompany.companyName + ",";
        user.linkedCompany.forEach(linkedCompany => {
          if (user.xpdcompany.id != linkedCompany.id)
            companyList = companyList + linkedCompany.companyName + ",";
        });
        if (companyList.length > 0)
          companyList = companyList.substr(0,companyList.length-1);
        user.strCompanies = companyList;
      })
      this.lstSelectedUsers = [];
    }, error => {
      this.showErrorMessage();
    });
  }

  showErrorMessage(message?:string) {
    this.errorOccured = true;
    if (message === undefined || message === '') {
      this.errorMessage = 'An error occurred. Please contact administrator!';
    } else {
      this.errorMessage = message;
    }
      setTimeout(() => {
        this.errorOccured = false;
      }, 8000);
  }

  addNewUser() {
    this.disableUsername = false;
    this.selectedUser = {isBuyer:false};
    this.linkedCompanies = [];
    this.defaultCompany = '';
    this.listMode = false;
    this.authService.getAllRelatedCompanies().subscribe (suc => {
      this.lstAllCompanies = suc as XpdCompany[];
    }, error => {
      this.showErrorMessage();
    });
  }

  saveUser() {
    let defCompany:XpdCompany = {id:Number(this.defaultCompany)};
    this.selectedUser.xpdcompany = defCompany;
    this.selectedUser.linkedCompany = [];
    this.linkedCompanies.forEach(comId => {
      let linkCompany:XpdCompany = {id:Number(comId)};
      this.selectedUser.linkedCompany.push(linkCompany);
    });
    
    // this.authService.saveUser(this.selectedUser).subscribe(suc => {
    //   if (suc) {
    //     this.showErrorMessage("User saved successfully");
    //     this.listMode = true;
    //     this.ngOnInit();
    //   }
    //   else
    //     this.showErrorMessage();
    // });

  }

  editSelectedUser() {
    this.disableUsername = true;
    if (this.lstSelectedUsers.length == 0)
      this.showErrorMessage("Please select user to update");
    else if (this.lstSelectedUsers.length > 1) 
      this.showErrorMessage("Please select only one user to update");
    else {
      if ( this.lstSelectedUsers[0].username == this.cognitoService.getCurrentUser()) {
        this.showErrorMessage("Cannot update logged in user");
      } else {
        this.listMode = false;
        this.selectedUser = this.lstSelectedUsers[0];
        this.defaultCompany = this.selectedUser.xpdcompany.id.toString();
        this.linkedCompanies = [];
        if (this.selectedUser.linkedCompany != undefined) {
          this.selectedUser.linkedCompany.forEach(com => {
            this.linkedCompanies.push(com.id.toString());
          })
        }
        this.authService.getAllRelatedCompanies().subscribe (suc => {
          this.lstAllCompanies = suc as XpdCompany[];
        }, error => {
          this.showErrorMessage();
        });
      }
    }
  }

  updateSelectedUsers(user:XpdUser, selection:boolean) {
    if (selection)
      this.lstSelectedUsers.push(user);
    else
      this.lstSelectedUsers.splice(this.lstSelectedUsers.indexOf(user),1);
  }

  deleteSelectedUsers() {
    if ( this.lstSelectedUsers.length == 0)
      this.showErrorMessage("Please select user(s) to proceed");
    else if ( this.lstSelectedUsers[0].username == this.cognitoService.getCurrentUser()) {
      this.showErrorMessage("Logged in user cannot be deleted");
    } else {
      this.authService.deleteUsers(this.lstSelectedUsers).subscribe (suc => {
        if (suc) {
          this.listMode = true;
          this.ngOnInit();
          this.showErrorMessage("User removed successfully")
        } else
          this.showErrorMessage("Some error occurred while removing user(s)");
      })
    }
  }

  filterInvoiceList() {
    this.lstUsers = this.lstAllUsers.filter(user => {
      let isValid:boolean = false;
      isValid = this.filterEmail==null || this.filterEmail=='' || user.username.toLowerCase().indexOf(this.filterEmail.toLowerCase()) != -1;
      isValid = isValid && (this.filterMobileNumber==null || this.filterMobileNumber=='' || (user.mobileNumber != null && user.mobileNumber.toLowerCase().indexOf(this.filterMobileNumber.toLowerCase()) != -1));
      return isValid;
    });
  }

  sortUserList(sortColumn?: string) {
    if (this.currentSortColumn === '') {
      this.currentSortColumn = sortColumn;
    } else {
      if (sortColumn === this.currentSortColumn) {
        this.sortAscending = !this.sortAscending;
      } else {
        this.currentSortColumn = sortColumn;
        this.sortAscending = true;
      }
    }

    if (sortColumn === 'email') {
      this.lstUsers = this.lstUsers.sort((user1, user2) => {
        return this.compareValuesForSort(user1.username, user2.username);
      });
    } else if (sortColumn === 'mobileNumber') {
      this.lstUsers = this.lstUsers.sort((user1, user2) => {
        return this.compareValuesForSort(user1.mobileNumber, user2.mobileNumber);
      });
    } else if (sortColumn === 'isAdmin') {
      this.lstUsers = this.lstUsers.sort((user1, user2) => {
        return this.compareValuesForSort(user1.isAdmin, user2.isAdmin);
      });
    } else if (sortColumn === 'isChecker') {
      this.lstUsers = this.lstUsers.sort((user1, user2) => {
        return this.compareValuesForSort(user1.isChecker, user2.isChecker);
      });
    } else if (sortColumn === 'isApprover') {
      this.lstUsers = this.lstUsers.sort((user1, user2) => {
        return this.compareValuesForSort(user1.isApprover, user2.isApprover);
      });
    } else if (sortColumn === 'isBuyer') {
        this.lstUsers = this.lstUsers.sort((user1, user2) => {
        return this.compareValuesForSort(user1.isBuyer, user2.isBuyer);
      });
    }
  }

  compareValuesForSort(first:any, second:any) {
    if (this.sortAscending) {
      if (first > second)
        return 1;
      if (first < second)
        return -1;
    } else {
      if (first < second)
        return 1;
      if (first > second)
        return -1;
    }
    return 0;
  }

}
