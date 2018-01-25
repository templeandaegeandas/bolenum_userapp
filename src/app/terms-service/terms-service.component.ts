import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router} from '@angular/router';

@Component({
  selector: 'app-terms-service',
  templateUrl: './terms-service.component.html',
  styleUrls: ['./terms-service.component.css']
})
export class TermsServiceComponent implements OnInit {
public loading: boolean = false;
  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    setTimeout(()=>{
      this.loading = false;
    },1000)
  }

}
