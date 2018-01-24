import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'toastr-ng2'

import { SignUpService } from './sign-up.service';
import { User } from './entity/user-signup';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [SignUpService]
})
export class SignUpComponent implements OnInit {
user = new User("","","","","",false);
loading = false;
public formModel: FormModel = {};
  constructor(private signUpService: SignUpService, private toastrService: ToastrService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    setTimeout(()=>{

      this.loading = false;

    },3000)
  }

  signUpUser(form) {
    if(form.invalid || this.user.repassword!=this.user.password) return;
    if (this.formModel.captcha == null) {
      return;
    }
    if(this.user.lastName==""){
      this.user.setLastName(null);
    }
    this.loading = true;
    this.signUpService.signUp(this.user).subscribe(success => {
      form.resetForm();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    },error => {
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

}

export interface FormModel {
  captcha?: string;
}
