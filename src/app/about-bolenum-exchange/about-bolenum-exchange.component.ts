import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-bolenum-exchange',
  templateUrl: './about-bolenum-exchange.component.html',
  styleUrls: ['./about-bolenum-exchange.component.css']
})
export class AboutBolenumExchangeComponent implements OnInit {

 public loading: boolean;

  constructor() { this.loading = true;
  setTimeout(()=>{
  this.loading = false;
  },1000); }

  ngOnInit() {
  }
  


}
