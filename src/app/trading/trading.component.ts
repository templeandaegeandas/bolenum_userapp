import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { TradingService } from './trading.service';
import { AppEventEmiterService } from '../app.event.emmiter.service';

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
  success: {
    accountDetails: {
      bankName: string;
      branch: string;
      ifscCode: string;
      accountNumber: string;
    };
    orderId: string;
    walletAddress: string;
    sellerName: string;
    orderVolume: string;
  };

  constructor(
    private tradingService: TradingService,
    private router: Router,
    private appEventEmiterService: AppEventEmiterService) { }

  ngOnInit() {
    this.appEventEmiterService.currentMessage.subscribe(success => {
      console.log(success)
      if (success != 'default message' && success!=null) {
        this.success = JSON.parse(success);
      }
      else {
        this.router.navigate(['dashboard']);
      }
    })
    this.hasTradeNow();
  }
  hasTradeNow() {
    this.hasTrading = false;
    this.hasTimer = true;
    // for timer
    // Set the date we're counting down to
    var date = new Date();
    var countDownDate = new Date(date.setMinutes(date.getMinutes()+40)).getTime();
    // Update the count down every 1 second
    var x = setInterval(function() {

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
      document.getElementById("demo").innerHTML = minutes + " : " + seconds;

      // If the count down is over, write some text
      if (distance < 0) {
        clearInterval(x);
        this.cancelPay();
        document.getElementById("demo").innerHTML = "EXPIRED";
      }
    }, 1000);
    // for timer
  }

  paymentConfirmation() {
    this.confirmPay();
    this.hasPaymentConfirm = true;
    this.hasTrading = false;
    this.hasTimer = false;
  }

  confirmPay() {
    this.tradingService.confirmPay(this.success.orderId).subscribe(success => {
      console.log(success);
    })
  }

  cancelPay() {
    this.tradingService.cancelPay(this.success.orderId).subscribe(success => {
      console.log(success);
    })
  }
}
