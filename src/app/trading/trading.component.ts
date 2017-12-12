import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { TradingService } from './trading.service';
import { Observable } from 'rxjs/Rx';
import { AppEventEmiterService } from '../app.event.emmiter.service';
import { ToastrService } from 'toastr-ng2';
declare var $: any;

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.css'],
  providers: [TradingService]
})
export class TradingComponent implements OnInit {

  orderId: any;
  bankName: string;
  branch: string;
  ifscCode: string;
  accountNumber: string;
  walletAddress: string;
  sellerName: string;
  orderVolume: any;
  currencyAbr: string;
  createdDate: any;
  totalPrice: any;
  orderStatus: any;
  path: any;
  subscription: any;
  matchedOn: any;
  isConfirmed: any;
  constructor(
    private tradingService: TradingService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private appEventEmiterService: AppEventEmiterService) {
      this.appEventEmiterService.currentMessage.subscribe(message => {
        console.log(message)
      if (message == "ORDER_CANCELLED") {
        if (this.subscription != null) {
          clearInterval(this.subscription);
        }
        toastrService.error("Your matching order cancelled! So your order is now in submitted state and added in order book!", "Error");
        this.ngOnInit();
      }
      else if(message == "PAID_NOTIFICATION") {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.orderId = +params['orderId'];
    });
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.tradingService.orderDetails(this.orderId).subscribe(success => {
      if (success.data == null) {
        this.router.navigate(['tradeNow']);
        return;
      }
      this.bankName = success.data.accountDetails.bankName;
      this.accountNumber = success.data.accountDetails.accountNumber;
      this.branch = success.data.accountDetails.branch;
      this.ifscCode = success.data.accountDetails.ifscCode;
      this.walletAddress = success.data.walletAddress;
      this.totalPrice = success.data.totalPrice;
      this.sellerName = success.data.sellerName;
      this.currencyAbr = success.data.currencyAbr;
      this.orderVolume = success.data.orderVolume;
      this.createdDate = success.data.createdDate;
      this.orderStatus = success.data.orderStatus;
      this.matchedOn = success.data.matchedOn;
      this.isConfirmed = success.data.isConfirmed;
      this.hasTradeNow();
    }, error => this.router.navigate(['tradeNow']))
  }

  hasTradeNow() {
    // for timer
    // Set the date we're counting down to
    var date = new Date(this.matchedOn);
    var countDownDate = new Date(date.setMinutes(date.getMinutes() + 40)).getTime();
    // Update the count down every 1 second
    if (this.orderStatus == 'LOCKED' && !this.isConfirmed) {
    console.log("status locked", this.subscription)
      this.subscription = Observable.interval(1000).subscribe(() => {
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
        if (path == 'trading') {
          try {
            document.getElementById("demo").innerHTML = minutes + " : " + seconds;
          }
          catch (e) {
            console.log("exception handled");
            this.subscription.unsubscribe();
          }
        }
        // If the count down is over, write some text
        if (distance <= 0) {
          if (path == 'trading') {
            console.log("distance subscription", this.subscription)
            this.subscription.unsubscribe();
            try {
              document.getElementById("demo").innerHTML = "EXPIRED";
            }
            catch (e) {
              console.log("exception handled");
              this.subscription.unsubscribe();
            }
          }
          this.cancelPay();
        }
      });
      // for timer
    }
    else if (this.orderStatus == 'COMPLETED') {
      if (this.subscription != null) {
        this.subscription.unsubscribe();
      }
      try {
        document.getElementById("demo").innerHTML = "Order Completed";
      }
      catch (e) {
        console.log("exception handled");
        this.subscription.unsubscribe();
      }
    }
    else if (this.orderStatus == 'SUBMITTED') {
      if (this.subscription != null) {
        this.subscription.unsubscribe();
      }
      try {
        document.getElementById("demo").innerHTML = "Order Submitted";
      }
      catch (e) {
        console.log("exception handled");
        this.subscription.unsubscribe();
      }
    }
    else if (this.orderStatus == 'CANCELLED') {
      if (this.subscription != null) {
        this.subscription.unsubscribe();
      }
      try {
        document.getElementById("demo").innerHTML = "Order Canceled";
      }
      catch (e) {
        console.log("exception handled");
      }
    }

    else {
      if (this.subscription != null) {
        this.subscription.unsubscribe();
      }
      try {
        document.getElementById("demo").innerHTML = "Order Confirmed";
      }
      catch (e) {
        console.log("exception handled");
      }
    }
  }

  confirmPay() {
    this.tradingService.confirmPay(this.orderId).subscribe(success => {
      console.log("subscription: ",this.subscription)
      if (this.subscription != null) {
        this.subscription.unsubscribe();
      }
      this.router.navigate(['/dispute/' + this.orderId])
      console.log(success);
    })
  }

  cancelPay() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
    this.tradingService.cancelPay(this.orderId).subscribe(success => {
      this.getOrderDetails();
      console.log(success);
    })
  }
}
