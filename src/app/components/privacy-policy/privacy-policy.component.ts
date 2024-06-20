import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AppUtil } from '../../app-util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private location: Location, private router: Router) {

   }

  ngOnInit() {}
  goBack() {
    this.location.back();
  }
}
