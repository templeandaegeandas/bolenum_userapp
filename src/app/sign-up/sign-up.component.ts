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
  constructor(private signUpService: SignUpService, private toastrService: ToastrService) { }

  ngOnInit() {
  }

  signUpUser(form) {
    if(form.invalid) return;
    this.signUpService.signUp(this.user).subscribe(success => {
      form.resetForm();
      this.toastrService.success(success.message, 'Success!');
    },error => {
      form.resetForm();
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

}
