import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { TradingService } from './trading.service';
import { Observable } from 'rxjs/Rx';
declare var $: any;

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.css'],
  providers: [TradingService]
})
export class TradingComponent implements OnInit {

  hasTrading: boolean = false;
  hasTimer: boolean = true;
  hasPaymentConfirm: boolean = false;
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
  constructor(
    private tradingService: TradingService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    // $(window).on('beforeunload', function() {
    //   this.cancelPay();
    // });
  }

  // @HostListener('window:popstate', ['$event'])
  // onPopState(event) {
  //   console.log('Back button pressed');
  //   this.cancelPay();
  // }

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
      this.hasTradeNow();
    }, error => this.router.navigate(['tradeNow']))
  }

  hasTradeNow() {
    this.hasTrading = false;
    this.hasTimer = true;
    // for timer
    // Set the date we're counting down to
    var date = new Date(this.createdDate);
    var countDownDate = new Date(date.setMinutes(date.getMinutes() + 40)).getTime();
    // Update the count down every 1 second
    if (this.orderStatus == 'LOCKED') {
      var subscription = Observable.interval(1000).subscribe(() => {
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
        var minutes = Math.floor((distance % (1000 * 30 * 30)) / (1000 * 30));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Output the result in an element with id="demo"
        if (path == 'trading') {
          document.getElementById("demo").innerHTML = minutes + " : " + seconds;
        }
        // If the count down is over, write some text
        if (distance < 0) {
          subscription.unsubscribe();
          if (path == 'trading') {
            document.getElementById("demo").innerHTML = "EXPIRED";
          }
          this.cancelPay();
        }
      });
      // for timer
    }
    else if (this.orderStatus == 'COMPLETED') {
      if (subscription != null) {
        subscription.unsubscribe();
      }
      document.getElementById("demo").innerHTML = "Order Completed";
    }
    else {
      if (subscription != null) {
        subscription.unsubscribe();
      }
      document.getElementById("demo").innerHTML = "Order Cancelled";
    }
  }

  paymentConfirmation() {
    this.confirmPay();
    this.hasPaymentConfirm = true;
    this.hasTrading = false;
    this.hasTimer = false;
  }

  confirmPay() {
    this.tradingService.confirmPay(this.orderId).subscribe(success => {
      console.log(success);
    })
  }

  cancelPay() {
    this.tradingService.cancelPay(this.orderId).subscribe(success => {
      console.log(success);
    })
  }
}
