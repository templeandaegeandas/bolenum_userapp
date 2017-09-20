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
  constructor(private signUpService: SignUpService, private toastrService: ToastrService) { }

  ngOnInit() {
  }

  signUpUser(form) {
    if(form.invalid || this.user.repassword!=this.user.password) return;
    if(this.user.lastName==""){
      this.user.setLastName(null);
    }
    this.loading = true;
    this.signUpService.signUp(this.user).subscribe(success => {
      form.resetForm();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    },error => {
      form.resetForm();
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

}
