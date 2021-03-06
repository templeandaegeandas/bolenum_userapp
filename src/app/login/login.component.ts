import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import { LoginService } from './login.service';
import { Login } from './entity/login';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { Ng2DeviceService } from 'ng2-device-detector';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  hasShowPassword : boolean;
  viewPassword : any = 'SHOW'
  passwordType :any = 'password';
  login = new Login("", "");
  loading = false;
  afterloading: boolean = false;
  returnUrl: string;
  ip: String;
  deviceInfo: any;
  is2FaOn: any = false;
  otp: any;
  twoFaOption: any;
  public formModel: FormModel = {};
  constructor(private route: ActivatedRoute,
    private loginService: LoginService,
    private toastrService: ToastrService,
    private router: Router,
    private deviceService: Ng2DeviceService) { }
  token: String;
  ngOnInit() {
    this.loading = true;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.token = this.route.snapshot.queryParams['token']) {
      this.verifyUserEmail(this.token);

    }
    this.loginService.getUserIpAddress().subscribe(success => {
      
      setTimeout(()=>{
        this.loading = false;
      },1000);
      this.ip = success.ip;
    });
  }

  loginUser(form) {
   
    if (form.invalid) {
       this.afterloading = true;
       setTimeout(()=>{
        this.afterloading = false;
       },1000);
      return;
    }
    if (this.formModel.captcha == null) {
      this.afterloading = true;
       setTimeout(()=>{
        this.afterloading = false;
       },1000);
      return;
    }
   
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.login.setIpAddress(this.ip);
    this.login.setBrowserName(this.deviceInfo.browser);
    this.login.setClientOsName(this.deviceInfo.os);
    this.login.setRole('ROLE_USER');
    this.loginService.logIn(this.login).subscribe(success => {

      console.log("login data");


      if (success.status == 202) {
        this.twoFaOption = success.data
        this.is2FaOn = true;
        
        return;
      }
      localStorage.setItem("userId", success.data.userId);
      localStorage.setItem("token", success.data.token);
      localStorage.setItem("fName", success.data.fName);
      if (success.data.lName != null) {
        localStorage.setItem("lName", success.data.lName);
      }
      if (success.data.profilePic != null) {
        localStorage.setItem("profilePic", success.data.profilePic);
      }
      this.router.navigate([this.returnUrl]);
      window.scrollTo(0, 0);
      
    }, error => {
      
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

  verify2Fa(form) {
    if (form.invalid) return;
    this.loading = true;
    this.loginService.verify2FaOtp(this.otp, this.login).subscribe(success => {
      localStorage.setItem("userId", success.data.userId);
      localStorage.setItem("token", success.data.token);
      localStorage.setItem("fName", success.data.fName);
      if (success.data.lName != null) {
        localStorage.setItem("lName", success.data.lName);
      }
      if (success.data.profilePic != null) {
        localStorage.setItem("profilePic", success.data.profilePic);
      }
      this.router.navigate([this.returnUrl]);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

  resend2FaOtp() {
    this.loginService.resend2FaOtp(this.login).subscribe(success => {
      this.toastrService.success(success.message, 'Success!');
    })
  }

  verifyUserEmail(token: String) {
      this.loginService.verifyMail(token).subscribe(success => {
      localStorage.clear();
      this.router.navigate(['login']);
      this.toastrService.success(success.data.message, 'Success!');
    }, error => {
      this.toastrService.error(error.json().message, 'Error!')
    })
  }

  hideShowPassword(){

     if(this.passwordType == 'password'){
      this.hasShowPassword = true;
      this.passwordType = 'text';
      this.viewPassword = 'HIDE';
     }
     else{
       this.passwordType = 'password';
       this.viewPassword = 'SHOW';
       this.hasShowPassword = false;
     }
  }

}

export interface FormModel {
  captcha?: string;
}
