import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { ForgetPasswordService } from './forget.password.service';
import { ToastrService } from 'toastr-ng2';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: [] ,
  providers: [ForgetPasswordService]
})
export class ForgetComponent implements OnInit {
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
      this.router.navigate(['dashboard']);
    },error=> {
       this.toastrService.error(error.json().message, 'Error!');
    })
  }

}
