import { Component, OnInit } from '@angular/core';
import {QRCodeComponent} from 'angular2-qrcode';
import { DepositService } from './deposit.service';
import { ToastrService } from 'toastr-ng2';
@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
   providers: [DepositService]
})
export class DepositComponent implements OnInit {
  public errorCoin:boolean;
  public qrCode:boolean=true;
  public shortIfo: boolean = false;
  address="";
  public coinDataValue:any;
  public setItemValue:any;
  public setItem:any=[
                        { coinValue:"BTC"},
                        { coinValue:"ETH"},
                        { coinValue:"BOLENO"}
                      ];

  constructor( private depositService:DepositService,private toastrService: ToastrService)  { }

  ngOnInit() {
    this.setItemValue = "BTC";
    this.getCoin("BTC");
  }

  getCoin(data){
    console.log("select value >>>>>>>>>>>>>>>>>>",data);
    this.depositService.getCoin(data).subscribe( successData => {
      let data = successData.data;
      this.address = data.data.address;
       this.qrCode = true;
        this.errorCoin =false; 
      
    },errorData => {
      this.qrCode = false;
      // this.toastrService.error("Address for this coin is not available!", 'Error!');
      this.errorCoin =true;  

    })
    
  }

}



