import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderService } from './header.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HeaderService]
})
export class HeaderComponent implements OnInit {
  public isOpen:boolean=false;
  public subMenu = false;
token: String;
fullName: String;
  constructor(private headerService: HeaderService, private router: Router) {
  }

  ngOnInit() {
    this.token = localStorage.getItem("token");
    this.fullName = localStorage.getItem("fName")+" "+localStorage.getItem("lName");
    console.log(this.token);
  }

  signOut() {
    this.headerService.logOut().subscribe(success => {
      localStorage.clear();
      this.router.navigate(['login']);
    },error => {
      this.router.navigate(['login']);
    })
  }
  showDropdown(){
    console.log("hhhdhsdhs");
    this.subMenu = !this.subMenu;
  }

}
