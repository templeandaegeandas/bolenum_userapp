import { Component, OnInit } from '@angular/core';
import {QRCodeComponent} from 'angular2-qrcode';
import { DepositService } from './deposit.service';
//import { DepositeData } from './entity/deposit.entity';
@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
   providers: [DepositService]
})
export class DepositComponent implements OnInit {
   public shortIfo: boolean = false;
   address="";
  public coinDataValue:any;
  public setItemValue:any;
  public setItem:any=[
                        { coinValue:"BTC"},
                        { coinValue:"ETH"},
                        { coinValue:"BOLENO"}
                      ];

  constructor( private depositService:DepositService) { }

  ngOnInit() {
    this.setItemValue = "BTC";
    this.getCoin("BTC");
  }

  getCoin(data){
    console.log("select value >>>>>>>>>>>>>>>>>>",data);
    this.depositService.getCoin(data).subscribe( successData => {
      let data = successData.data;
      this.address = data.data.address;
      
    },errorData => {

    })
    
  }

}



