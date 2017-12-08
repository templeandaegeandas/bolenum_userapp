import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'toastr-ng2';
import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  providers:[FooterService],
})
export class FooterComponent implements OnInit {

  constructor(private toastrService: ToastrService, private router: Router, private activatedRouter: ActivatedRoute ,private footerService:FooterService) { }

  public email: any;
  ngOnInit() {
  }

  notification() {
    this.footerService.subscribeUser(this.email).subscribe(success => {
      console.log(success);
      this.toastrService.success(success.message, 'Success!');
    },error=> {
       this.toastrService.error(error.json().message, 'Error!');
    })
  }
}
