import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
token: String;
  constructor() {
    this.token = localStorage.getItem("token");
    console.log("constructor"+this.token)
  }

  ngOnInit() {
    this.token = localStorage.getItem("token");
    console.log("onInit"+this.token)
  }

}
