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
token: String;
  constructor(private headerService: HeaderService, private router: Router) {
  }

  ngOnInit() {
    this.token = localStorage.getItem("token");
  }

  signOut() {
    this.headerService.logOut().subscribe(success => {
      localStorage.clear();
      this.router.navigate(['login']);
    },error => {
      this.router.navigate(['login']);
    })
  }

}
