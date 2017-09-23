import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import { LoginService } from './login.service';
import { Login } from './entity/login';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  login = new Login("", "");
  loading = false;
  returnUrl: string;
  constructor(private route: ActivatedRoute, private loginService: LoginService, private toastrService: ToastrService, private router: Router) { }
  token: String;
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if(this.token = this.route.snapshot.queryParams['token']) {
      this.verifyUserEmail(this.token);
    }
  }

  loginUser(form) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    this.loginService.logIn(this.login).subscribe(success => {
      localStorage.setItem("token", success.data.token);
      localStorage.setItem("fName", success.data.fName);
      localStorage.setItem("lName", success.data.lName);
      this.router.navigate([this.returnUrl]);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

  verifyUserEmail(token: String) {
    this.loginService.verifyMail(token).subscribe(success => {
      this.router.navigate(['login']);
      this.toastrService.success(success.data.message, 'Success!');
    }, error => {
      this.toastrService.error(error.json().message, 'Error!')
    })
  }

}
