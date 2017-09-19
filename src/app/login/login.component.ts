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
  constructor(private loginService: LoginService, private toastrService: ToastrService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn();
  }

  loginUser(form) {
    if (form.invalid) {
        return;
    }
    console.log(this.login);
    this.loginService.logIn(this.login).subscribe(success => {
      console.log(success)
      localStorage.setItem("token",success.data.token);
      this.toastrService.success(success.message, 'Success!');
      this.router.navigate(['dashboard']);
    },error=> {
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
