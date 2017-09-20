import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { ForgetPasswordService } from './forgot.password.service';
import { ToastrService } from 'toastr-ng2';


@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'] ,
  providers: [ForgetPasswordService]
})
export class ForgotComponent implements OnInit {

    email:String
    constructor(private forgetpasswordService: ForgetPasswordService, private toastrService: ToastrService, private router: Router) {}

  ngOnInit() {
  }

  forgetPassword(form) {
    if (form.invalid) {
        return;
    }

      this.forgetpasswordService.forgetpass(this.email).subscribe(success => {
      console.log(success);
      this.toastrService.success(success.message, 'Success!');
      this.router.navigate(['login']);
    },error=> {
       this.toastrService.error(error.json().message, 'Error!');
    })
  }

}
