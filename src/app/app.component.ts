import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) {
    this.isLoggedIn();
  }
  title = 'app';

  isLoggedIn() {
    if(localStorage.getItem("token")!=null) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['login']);
    }
  }
}
