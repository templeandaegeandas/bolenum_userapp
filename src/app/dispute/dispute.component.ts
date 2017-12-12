import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'toastr-ng2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DisputeService } from './dispute.service';
import { TradingService } from '../trading/trading.service';

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.css'],
  providers: [DisputeService, TradingService]
})

export class DisputeComponent implements OnInit {

  orderId: any;
  transactionId: any;
  public commentByDisputeRaiser: any;
  public isOff: boolean = false;
  public isOn: boolean = true;
  public saveButton: boolean = false;
  public disputeStatus: any;
  @ViewChild('fileInput') fileInput;

  loading = false;
  addressPdf: Boolean = false;
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

  constructor(private disputeService: DisputeService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tradingService: TradingService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.activatedRoute.params.subscribe(params => {
      this.orderId = +params['orderId'];
    });
    if (this.orderId == null) {
      this.router.navigate(['tradeNow']);
    }
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
    }, error => this.router.navigate(['tradeNow']))
  }

  raiseDispute(form) {
    if (form.invalid) return;
    this.loading = true;
    let fileBrowser = this.fileInput.nativeElement;
    if ((fileBrowser.files && fileBrowser.files[0])) {
      let fileName = fileBrowser.files[0].name;
      let dot = fileName.lastIndexOf(".");
      let extension = (dot == -1) ? "" : fileName.substring(dot + 1).toLowerCase();
      if (extension != "png" && extension != "jpeg" && extension != "jpg" && extension != "pdf") {
        this.loading = false;
        this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!');
        fileBrowser.value = "";
        return;
      }
      const formData = new FormData();
      formData.append("file", fileBrowser.files[0]);
      formData.append("orderId", this.orderId);
      formData.append("transactionId", this.transactionId);
      formData.append("commentByDisputeRaiser", this.commentByDisputeRaiser);
      this.disputeService.raiseDispute(formData).subscribe(success => {
        this.loading = false;
        this.toastrService.success(success.message, 'Success!')
      }, error => {
        this.toastrService.error(error.json().message, 'Error!')
        this.loading = false;
      })
    }
  }

  cancelPay() {
    this.tradingService.cancelPay(this.orderId).subscribe(success => {
      if (this.subscription != null) {
        this.subscription.unsubscribe();
      }
      this.getOrderDetails();
      this.toastrService.success(success.message, 'Success!')
    })
  }

}
