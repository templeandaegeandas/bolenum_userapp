import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import { LoginService } from './login.service';
import { Login } from './entity/login';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  login = new Login("","");
  loading = false;
  constructor(private loginService: LoginService, private toastrService: ToastrService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn();
  }

  loginUser(form) {
    if (form.invalid) {
        return;
    }
    this.loading = true;
    this.loginService.logIn(this.login).subscribe(success => {
      localStorage.setItem("token",success.data.token);
      localStorage.setItem("fName", success.data.fName);
      localStorage.setItem("lName", success.data.lName);
      this.router.navigate(['dashboard']);
      this.loading = false;
    },error=> {
      this.loading = false;
       this.toastrService.error(error.json().message, 'Error!');
    })
  }

  isLoggedIn() {
    if(localStorage.getItem("token")!=null) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['login']);
    }
  }

}
