import { CogServiceService } from './services/cog-service.service';
import { Component, OnInit } from '@angular/core';
import { CognitoPoolDto } from './models/cognito-pool-dto';
import { Http } from '@angular/http';
import { AppConstants } from './app-constants';
import { AuthServiceService } from './services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private authService:AuthServiceService, private cogService:CogServiceService) {}

  ngOnInit() {
    // if (sessionStorage.getItem('clientId') === null ) {
    //   this.authService.getCognitoConfiguration().subscribe(suc => {
    //     // console.log(suc);
    //     var cogPoolProperties:CognitoPoolDto = suc.json();
    //     sessionStorage.setItem('clientId',cogPoolProperties.clientId);
    //     sessionStorage.setItem('userPoolId',cogPoolProperties.userPoolId);
    //     this.cogService.initializeCognito();
    //   });
    // }
  }
}
