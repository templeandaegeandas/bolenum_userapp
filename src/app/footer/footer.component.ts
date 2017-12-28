import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'toastr-ng2';
import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers: [FooterService],
})
export class FooterComponent implements OnInit {

  constructor(private toastrService: ToastrService, private router: Router, private activatedRouter: ActivatedRoute, private footerService: FooterService) { }

  public email: any;
  public hasEmail: any = false;
  public hasValid: any = false;
  ngOnInit() {
  }

  notification(emailNotify) {
    let patt = new RegExp("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})");
    if (emailNotify.value == null) {
      this.hasValid = false;
      this.hasEmail = true;
      
      setTimeout(() => {
        this.hasEmail = false;
      }, 3000);
      return;
    }
    else if (!patt.test(emailNotify.value)) {
    this.hasEmail = false;
    this.hasValid = true;
    setTimeout(()=>{
      this.hasValid = false;
    },3000);
    return ;
    }
    this.footerService.subscribeUser(this.email).subscribe(success => {
      console.log(success);
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      this.toastrService.error(error.json().message, 'Error!');
    })
  }
}
