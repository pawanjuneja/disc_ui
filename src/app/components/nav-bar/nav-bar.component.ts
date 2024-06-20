import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor() { }

  showBar: boolean = false;

  ngOnInit() {
  }

  toggleClassActive() {
    this.showBar = !this.showBar;
  }
}
