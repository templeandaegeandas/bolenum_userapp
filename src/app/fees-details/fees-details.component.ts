import { Component, OnInit } from '@angular/core';
import { FeesService } from './fees-details.service';

@Component({
  selector: 'app-fees-details',
  templateUrl: './fees-details.component.html',
  styleUrls: ['./fees-details.component.css'],
  providers: [FeesService]
})
export class FeesDetailsComponent implements OnInit {
  public marketValue: any;
  public withdrawFee: any;

  constructor(private feesService: FeesService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getMarketValue();
    this.withdrawFees();
   }

   getMarketValue(){
     this.feesService.getMarketCurrencyValue().subscribe( success =>{
       this.marketValue = success.data.fee;
   },error =>{
  });
   }

   withdrawFees(){
     this.feesService.getWithdrawValue().subscribe( success =>{
       this.withdrawFee = success.data;
 },error => {

     });
   }

}
