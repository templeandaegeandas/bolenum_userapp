import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class SellComponent implements OnInit{
  orderId: any;
  bankName: string;
  branch: string;
  showTime: any;
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
  getMessage: any;
  isMatchedConfirm = false;
  dispute = false;
  constructor(
    private sellService: SellService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private appEventEmiterService: AppEventEmiterService) {
    this.appEventEmiterService.currentMessage.subscribe(message => {
      this.getMessage = message;
      console.log("Get message", this.getMessage);
      if (this.getMessage == "ORDER_CANCELLED") {
        this.dispute = false;
        if (this.subscription != null) {
          clearInterval(this.subscription);
        }
        toastrService.error("Your matching order cancelled! So your order is now in submitted state and added in order book!", "Error");
        this.showTime = "Order Canceled";
        this.appEventEmiterService.changeMessage("cancelPay");
        //this.clearInterval();
        // this.ngOnInit(); 
      }
      else if (this.getMessage == "CONFIRM_NOTIFICATION") {
        this.ngOnInit();
      }else if(this.getMessage =="reloadWindow"){
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

  

  // ngOnDestroy() {
  //   this.clearInterval();
  // }

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
      this.startTimer();
    }, error => this.router.navigate(['market']))
  }

  clearInterval(){
    console.log("in");
     clearInterval(this.subscription);

  }



  // startTradingTimer() {
  //   var date = new Date(this.matchedOn);
  //   var countDownDate = new Date(date.setMinutes(date.getMinutes() + 40)).getTime();
  //   // Update the count down every 1 second
  //   if (this.orderStatus == 'LOCKED' && this.isMatchedConfirm) {
  //     this.subscription = setInterval(() => {
  //       if (this.getMessage != "receivedPayment" && this.getMessage != "ORDER_BOOK_NOTIFICATION") {
  //         this.startTimer(countDownDate);
  //       }
  //     }, 1000)

  //   }
  //   else 
  // }

  startTimer() {
     var date = new Date(this.matchedOn);
    var countDownDate = new Date(date.setMinutes(date.getMinutes() + 40)).getTime();
     if (this.orderStatus == 'LOCKED' && this.isMatchedConfirm) {
       this.subscription =setInterval(() => {
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
  },1000);
}
  else if (this.orderStatus == 'COMPLETED' && this.getMessage != "CONFIRM_NOTIFICATION") {
       if (this.subscription != null) {
        this.clearInterval();
      }
      try {
        console.log("IN:;;;;;;;;;;;;;;");
       this.showTime = "Order Completed";
        this.clearInterval();
      }
      catch (e) {
        console.log("exception handled");
        this.clearInterval();
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
         if (this.subscription != null) {
          this.clearInterval();
      }
        this.showTime = "Please wait for buyer to make payment";
        //this.clearInterval();
      }
      catch (e) {
        console.log(this.subscription);
      }
    }
     else if (this.orderStatus == 'CANCELLED') {
       if (this.subscription != null) {
        this.clearInterval();
      }
      try {
        this.showTime = "Order Cancelled";
        //this.clearInterval();
      }
      catch (e) {
        console.log(this.subscription);
      }
    }
    else {
      if (this.subscription != null) {
        this.clearInterval();
      }
      try {
       this.showTime = "Order Confirmed";
      }
      catch (e) {
        console.log("exception handled");
      }
    }
  }

  confirmPay() {
    this.appEventEmiterService.changeMessage("receivedPayment");
    this.sellService.confirmPay(this.orderId).subscribe(success => {
        if (this.subscription != null) {
        this.clearInterval();
      }
      this.getOrderDetails();
      this.toastrService.success("Trade Completed!", "Success!");
    }, error => {
      this.toastrService.error(error.message, "Error!");
    })
  }

  cancelPay() {
    if (this.subscription != null) {
      this.clearInterval();
    }
    this.appEventEmiterService.changeMessage("cancelPay");
    this.sellService.cancelPay(this.orderId).subscribe(success => {
      this.getOrderDetails();
      console.log("success.message");
      this.toastrService.success(success.message, "Success!");
    }, error => {
      this.toastrService.error(error.message, "Error!");
    })
  }

  disputeTrade() {
    this.dispute = true;
    this.sellService.dispute(this.orderId).subscribe(success => {
      console.log("success.message");
      this.toastrService.success(success.message, "Success");
    }, error => {
      this.toastrService.error(error.json().message, "Error!");
    })
  }



}
