import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { SellService } from './sell.service';
import { AppEventEmiterService } from '../app.event.emmiter.service';
declare var $:any;

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
  providers: [SellService]
})
export class SellComponent implements OnInit {
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

  constructor(
    private sellService: SellService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    $(window).on('beforeunload', function() {
      this.cancelPay();
    });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    this.cancelPay();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.orderId = +params['orderId'];
    });
    this.sellService.orderDetails(this.orderId).subscribe(success => {
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
      console.log("Our data: ", );
    })
  }
  startTradingTimer() {
    // for timer
    // Set the date we're counting down to
    var date = new Date(this.createdDate);
    var countDownDate = new Date(date.setMinutes(date.getMinutes() + 40)).getTime();

    // Update the count down every 1 second
    if(this.orderStatus == 'LOCKED') {
    var x = setInterval(function() {

      // Get todays date and time
      var now = date.getTime();
      console.log(date)
      console.log(now)

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
        document.getElementById("demo").innerHTML = "EXPIRED";
        this.cancelPay();
      }
    }, 1000);
    // for timer
  }
  else if (this.orderStatus == 'COMPLETED') {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "Order Completed";
  }
  else {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "Order Canclled";
  }

  }

  confirmPay() {
    this.sellService.confirmPay(this.orderId).subscribe(success => {
      console.log(success);
    })
  }

  cancelPay() {
    this.sellService.cancelPay(this.orderId).subscribe(success => {
      console.log(success);
    })
  }

}
