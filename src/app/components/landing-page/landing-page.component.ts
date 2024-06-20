import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { AppConstants } from '../../app-constants';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
idToken = '';
dec: string[] = null;
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  this.idToken = this.route.snapshot.fragment;
  if (this.idToken) {
    this.dec = jwt_decode(this.idToken);
    localStorage.setItem('username',this.dec['cognito:username']);
    this.router.navigate(['/supplier-dashboard']);
    }
  }

}
