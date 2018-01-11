import { Component, OnInit , OnDestroy} from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { SellService } from './sell.service';
import { AppEventEmiterService } from '../app.event.emmiter.service';
import { Observable } from 'rxjs/Rx';
import { ToastrService } from 'toastr-ng2';

declare var $: any;

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
  providers: [SellService]
})
export class SellComponent implements OnInit, OnDestroy {
  orderId: any;
  bankName: string;
  branch: string;
  ifscCode: string;
  showTime:any;
  accountNumber: string;
  walletAddress: string;
  sellerName: string;
  buyerName: string;
  orderVolume: any;
  currencyAbr: string;
  createdDate: any;
  totalPrice: any;
  orderStatus: any;
  path: any;
  subscription: any;
  matchedOn: any;
  isConfirmed: any;
  getMessage:any;
  isMatchedConfirm = false;
  dispute = false;
  constructor(
    private sellService: SellService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private appEventEmiterService: AppEventEmiterService) {
    this.appEventEmiterService.currentMessage.subscribe(message => {
       this.getMessage=message;
       console.log("Get message",this.getMessage);      
       if (this.getMessage == "ORDER_CANCELLED") {
        this.dispute = false;
        toastrService.error("Your matching order cancelled! So your order is now in submitted state and added in order book!", "Error");
        this.showTime="Order Canceled";
        this.appEventEmiterService.changeMessage("cancelPay");
        this.clearInterval();
        // this.ngOnInit(); 
      }
      else if(this.getMessage == "CONFIRM_NOTIFICATION") {
         this.ngOnInit();
      }
    });
  }

   ngOnInit() {
    window.scrollTo(0, 0);
    this.activatedRoute.params.subscribe(params => {
      this.orderId = +params['orderId'];  
    });
     this.getOrderDetails();  
    
  }

  clearInterval(){
     this.subscription=undefined;
    clearInterval(this.subscription);
  }

  ngOnDestroy() {
     this.clearInterval();
  }

  getOrderDetails() {
    this.sellService.orderDetails(this.orderId).subscribe(success => {
      if (success.data == null) {
        this.router.navigate(['market']);
        return;
      }
      console.log("Data of success", success);
      this.bankName = success.data.accountDetails.bankName;
      this.accountNumber = success.data.accountDetails.accountNumber;
      this.branch = success.data.accountDetails.branch;
      this.ifscCode = success.data.accountDetails.ifscCode;
      this.walletAddress = success.data.walletAddress;
      this.totalPrice = success.data.totalPrice;
      this.sellerName = success.data.sellerName;
      this.buyerName = success.data.buyerName;
      this.currencyAbr = success.data.currencyAbr;
      this.orderVolume = success.data.orderVolume;
      this.createdDate = success.data.createdDate;
      this.orderStatus = success.data.orderStatus;
      console.log("Give status", this.orderStatus);
      this.matchedOn = success.data.matchedOn;
      this.isConfirmed = success.data.isConfirmed;
      this.isMatchedConfirm = success.data.isMatchedConfirm;
      this.dispute = success.data.isDispute;
        this.startTradingTimer();
    }, error => this.router.navigate(['market']))
  }


   
  startTradingTimer() {
    var date = new Date(this.matchedOn);
    var countDownDate = new Date(date.setMinutes(date.getMinutes() + 40)).getTime();
    // Update the count down every 1 second
    if (this.orderStatus == 'LOCKED' && this.isMatchedConfirm) {
    this.subscription = setInterval(() => {
      if(this.getMessage!="receivedPayment" && this.getMessage !="ORDER_BOOK_NOTIFICATION"){
      this.startTimer(countDownDate);
      }
    }, 1000)

    }
    else if (this.orderStatus == 'COMPLETED' && this.getMessage!="CONFIRM_NOTIFICATION") {
      try {
        this.showTime='';
        this.showTime = "Order Completed";
        console.log("this.orderStatus", this.getMessage , this.orderStatus);
        this.clearInterval();
      }
      catch (e) {
        console.log(this.subscription);
      }
    }
    else if (this.orderStatus == 'SUBMITTED') {
      try {
        this.showTime = "Order Submitted";
        this.clearInterval();
      }
      catch (e) {
         console.log(this.subscription);
      }
    }
    else if (this.orderStatus == 'LOCKED') {
      try {
        this.showTime = "Please wait for buyer to make payment";
        this.clearInterval();
      }
      catch (e) {
         console.log(this.subscription);
      }
    }
    else {
      try {
        this.showTime = "Order Cancelled";
        //this.clearInterval();
      }
      catch (e) {
        console.log(this.subscription);
      }
    }
  }

  startTimer(countDownDate) {
    var path;
    this.activatedRoute.url.subscribe(url => {
      path = url[0].path;
    })
    // Get todays date and time
    var now = new Date().getTime();
    // Find the distance between now an the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    // Output the result in an element with id="demo"
    if (path == 'sell') {
      try {
        this.showTime = minutes + " : " + seconds;
        
      }
      catch (e) {
        console.log("exception handled")
      }
    }
    // If the count down is over, write some text
    if (distance <= 0) {
      if (path == 'sell') {
        // this.clearInterval();
        try {
         this.showTime = "EXPIRED";

        }
        catch (e) {
        }
      }
    }
  }

  confirmPay() {
     this.clearInterval();
      this.appEventEmiterService.changeMessage("receivedPayment");
      this.sellService.confirmPay(this.orderId).subscribe(success => {
      this.getOrderDetails();
      this.toastrService.success("Trade Completed!", "Success!");
    })
  }

  cancelPay() {
    this.clearInterval();
    this.appEventEmiterService.changeMessage("cancelPay");
    this.sellService.cancelPay(this.orderId).subscribe(success => {
      this.getOrderDetails();
      console.log("success.message");
      this.toastrService.success(success.message, "Success!");
    })
  }

  disputeTrade() {
    this.dispute = true;
    this.sellService.dispute(this.orderId).subscribe(success => {
      console.log("success.message");
      this.toastrService.success(success.message, "Success");
    })
  }

   

}
