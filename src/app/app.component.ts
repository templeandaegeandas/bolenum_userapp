import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  token;
  constructor() {
    this.isLoggedIn();
  }
  title = 'app';

  isLoggedIn() {
    if(localStorage.getItem("token")!=null) {
      return true;
     }
     else{
       return false;
     }
  }


}
