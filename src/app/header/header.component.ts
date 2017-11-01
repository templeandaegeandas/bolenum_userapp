import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HeaderService } from './header.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [HeaderService]
})
export class HeaderComponent implements OnInit {
  public isOpen: boolean = false;
  public subMenu = false;
  token: String;
  fullName: String;
  lastName:String;
  profilePic: String = "assets/images/pic.png";
  constructor(private headerService: HeaderService, private router: Router) {
  }

  ngOnInit() {
    if (localStorage.getItem("profilePic") != null) {
        this.profilePic = environment.profilePicUrl + localStorage.getItem("profilePic") + "?decache=" + Math.random();
    }
    this.token = localStorage.getItem("token");
    this.lastName = localStorage.getItem("lName");
    if(this.lastName){

        this.fullName = localStorage.getItem("fName") + " " + localStorage.getItem("lName");

    }
    else{
  this.fullName = localStorage.getItem("fName");
    }

  }

  signOut() {
    this.headerService.logOut().subscribe(success => {
      localStorage.clear();
      this.router.navigate(['login']);
    }, error => {
      localStorage.clear();
      this.router.navigate(['login']);
    })
  }
  showDropdown() {
    this.subMenu = !this.subMenu;
  }

}
