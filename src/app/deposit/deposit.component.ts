import { Component, OnInit } from '@angular/core';
import {QRCodeComponent} from 'angular2-qrcode';
import { DepositService } from './deposit.service';
import { ToastrService } from 'toastr-ng2';
import { AppEventEmiterService } from '../app.event.emmiter.service';
@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
   providers: [DepositService]

})
export class DepositComponent implements OnInit {
  
  public hasBlur:boolean=false;
  public isLoading:boolean=false;
  public coinAbbreviation:any;
  public setItemValue:any;
  public currencyData:any;
  public balance:any;
  public errorCoin:boolean;
  public qrCode:boolean=true;
  public shortIfo: boolean = false;
  public pageNumber: number;
  public date: any = "";
  address="";
  public txList:any;
  public coinDataValue:any;
  loading = false;
  isCopied: boolean = false;


  constructor( private depositService:DepositService,private appEventEmiterService:AppEventEmiterService,private toastrService: ToastrService) {
    this.appEventEmiterService.currentMessage.subscribe(message => {
      if (message == "DEPOSIT_NOTIFICATION") {
           this.getListOfUserDepositTransaction();
      }
    });
  }


  ngOnInit() {
    this.getListOfUserDepositTransaction();
    this.getCurrencyName();

   
  }

  getCoin(data){
    this.isCopied = false;
    this.loading = true;
    let c = this.currencyData.find(x => x.currencyAbbreviation == data);
    this.depositService.getCoin(c.currencyType, data).subscribe( success => {
      let successData = success.data;
      if(successData.data!=null) {
        this.address = successData.data.address;
        this.balance = successData.data.balance+" "+data;
        this.coinAbbreviation = successData.data.coinAbbreviation;
      }
       this.qrCode = true;
        this.errorCoin =false;
        this.loading = false;
    },errorData => {
      this.qrCode = false;
      this.errorCoin =true;
      this.loading = false;
    })

  }

  getCurrencyName(){
    this.depositService.getCurrencyData().subscribe(successData => {
      this.currencyData = successData.data;
      this.setItemValue = this.currencyData[0].currencyAbbreviation;
      this.getCoin(this.setItemValue);

    },errorData => {

    })
  }

  getListOfUserDepositTransaction() {
     this.isLoading = true;
     this.hasBlur = true;
      this.depositService.getListOfDepositTransaction(1,10,"createdOn","desc").subscribe(success => {
         this.isLoading = false;
       this.hasBlur = false;
      this.txList = success.data.content;
    })
  }

  isCoppied(){
    setTimeout(()=>{  
      this.isCopied = false;
 },1000);

  }
}
