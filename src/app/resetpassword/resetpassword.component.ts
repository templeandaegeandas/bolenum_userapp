import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router,ActivatedRoute } from '@angular/router';
import { ResetPassword } from './entity/reset';
import { ToastrService } from 'toastr-ng2';
import { ResetPasswordService } from './resetpassword.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'] ,
  providers:[ResetPasswordService]
})
export class ResetpasswordComponent implements OnInit {
  resetPassword = new ResetPassword("","");
  token : any ;
  constructor(private resetPasswordService: ResetPasswordService, private toastrService: ToastrService, private router: Router,private activatedRouter:ActivatedRoute)
  {  }


  ngOnInit() {
    window.scrollTo(0, 0);
    this.activatedRouter
    .queryParams
    .subscribe(params => {
        this.token = params['token'];
    });

  }

  passwordReset(form) {
    if (form.invalid || this.resetPassword.newPassword!=this.resetPassword.confirmPassword) {
        return;
    }
    console.log(this.resetPassword);
    this.resetPasswordService.resetPass(this.token,this.resetPassword).subscribe(success => {
      console.log(success);
      this.toastrService.success(success.message, 'Success!');
      this.router.navigate(['login']);
    },error=> {
       this.toastrService.error(error.json().message, 'Error!');
    })
  }

}
