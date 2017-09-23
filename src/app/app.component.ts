import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  token;
  url: String;
  constructor(private activatedRouter: ActivatedRoute, private router: Router) {
    this.isLoggedIn();
  }
  title = 'app';

  isLoggedIn() {
    if(localStorage.getItem('token')) {
      return true;
    }
    else {
      return false;
    }
  }
}
