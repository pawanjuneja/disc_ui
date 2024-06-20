import { AuthServiceService } from './../../services/auth-service.service';
import { AppUtil } from './../../app-util';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CogServiceService } from '../../services/cog-service.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('usrForm') form: NgForm;
  didFail = false;
  isValidUser = false;
  temp: boolean;
  type = 'password';
  constructor(private cogService: CogServiceService, private router: Router, private authService:AuthServiceService) { }

  ngOnInit() {
    // localStorage.clear();
    // sessionStorage.clear();
  }

  showHidePassword() {
    if (this.type === 'password') {
      this.type = 'text';
    } else if (this.type === 'text') {
      this.type = 'password';
    }
  }

  onSubmit() {
    const usrName: string = this.form.value.username;
    const password = this.form.value.password;
    // this.authService.preLogin(usrName, password)
    // .map((response: any) => response.json())
    // .subscribe(response => console.log(response));

    this.authService.preLogin(usrName, password).subscribe((response) => {
    console.log(response.text());
    if (response.text() !== 'null') {
      localStorage.setItem('username', usrName);
    localStorage.setItem('auth', response.text());
    localStorage.setItem('ID', response.text());
    this.authService.login().subscribe(suc => {
      console.log(suc);
          if (suc === true) {
            this.authService.savePwd(password).subscribe((res) => {
            });
            AppUtil.reDirectToHomepage(this.router);
          } else {
            this.didFail = !(suc as boolean);
          }
        });
        setTimeout( () => {
          this.didFail = false;
        }, 4000 );
    } else {
      this.didFail = true;
      setTimeout( () => {
        this.didFail = false;
      }, 4000 );
    }
    });


    // this.cogService.onLogin(usrName.toLocaleLowerCase(), password).subscribe( (res) => {
    //   this.isValidUser = res as boolean;
    //   this.didFail = !res as boolean;
    //   if (this.isValidUser === true) {
    //     localStorage.setItem('username', usrName);
    //   }
    //   this.authService.login().subscribe(suc => {
    //     if (suc === true) {
    //       this.authService.savePwd(password).subscribe((response) => {
    //       });
    //       AppUtil.reDirectToHomepage(this.router);
    //     } else {
    //       this.didFail = !(suc as boolean);
    //     }
    //   });
    //   setTimeout( () => {
    //     this.didFail = false;
    //   }, 4000 );
    // } );
  }

}
