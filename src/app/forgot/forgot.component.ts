import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { ForgetPasswordService } from './forgot.password.service';
import { ToastrService } from 'toastr-ng2';


@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css'],
  providers: [ForgetPasswordService]
})
export class ForgotComponent implements OnInit {
  public errorMsg: boolean = false;

  email: String
  constructor(private forgetpasswordService: ForgetPasswordService, private toastrService: ToastrService, private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  forgetPassword(form) {
    if (form.invalid) {
      return;
    }

    this.forgetpasswordService.forgetpass(this.email).subscribe(success => {
      console.log(success);
      this.toastrService.success(success.message, 'Success!');
      this.router.navigate(['login']);
    }, error => {

      this.errorMsg = true;
      setTimeout(() => {
        this.errorMsg = false;
      }, 3000);




    })
  }

}
