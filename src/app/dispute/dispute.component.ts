import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'toastr-ng2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DisputeService } from './dispute.service';
import { TradingService } from '../trading/trading.service';
import { AppEventEmiterService } from '../app.event.emmiter.service';

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
  public spinner:any;
  public showDisupteSection:boolean=false;
  public isImageUploaderVisibile:boolean=false;
  public showReplyScreen:boolean=false;
  public getImageLink:any;
  public getAddress:any;
  public saveButton: boolean = false;
  public disputeStatus: any;
  @ViewChild('fileInput') fileInput;
  @ViewChild('showUploadedImage') showUploadedImage;
  @ViewChild('showUploadedImageLink') showUploadedImageLink;

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
  jsonMessage:any
  matchedOn: any;
  isConfirmed: any;

  constructor(private disputeService: DisputeService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tradingService: TradingService,
    private appEventEmiterService: AppEventEmiterService) {
      this.appEventEmiterService.currentMessage.subscribe(message => {
      if(message == "PAID_NOTIFICATION") {
        this.router.navigate(['market']);
        toastrService.success("You trade is completed successfully! You will get the BLN after some time!", "Success");
      }
    });
    }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.activatedRoute.params.subscribe(params => {
      this.orderId = +params['orderId'];
    });
    if (this.orderId == null) {
      this.router.navigate(['market']);
    }
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.tradingService.orderDetails(this.orderId).subscribe(success => {
      if (success.data == null) {
        this.router.navigate(['market']);
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
    }, error => {
         this.appEventEmiterService.changeMessage("cancelPay");
        this.router.navigate(['market']);
    });
  }

  raiseDispute(form) {
    if (form.invalid) return;
     // this.spinner=true;
    // this.loading = true;
    this.showReplyScreen = true;
    
    let fileBrowser = this.fileInput.nativeElement;
      console.log(fileBrowser);
    if ((fileBrowser.files && fileBrowser.files[0])) {
      let fileName = fileBrowser.files[0].name;

      let dot = fileName.lastIndexOf(".");
      let extension = (dot == -1) ? "" : fileName.substring(dot + 1).toLowerCase();
      if (extension != "png" && extension != "jpeg" && extension != "jpg" && extension != "pdf") {
        // this.loading = false;
        // this.spinner=false;
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
        // this.loading = false;
        this.toastrService.success(success.message, 'Success!')
        this.router.navigate(['market']);
      }, error => {
        console.log(error)
        this.toastrService.error(error.json().message, 'Error!')
        this.loading = false;
      })
    }
  }

 getUploadedDocument(fileInput: any){
  this.isImageUploaderVisibile=true;
  this.showUploadedImage.nativeElement.src=URL.createObjectURL(fileInput.target.files[0]);
  this.showUploadedImageLink.nativeElement.href=URL.createObjectURL(fileInput.target.files[0]);
   this.getAddress=this.fileInput.nativeElement.files[0].name;// this.getImageLink=URL.createObjectURL(fileInput.target.files[0]);
}

  cancelPay() {
    this.tradingService.cancelPay(this.orderId).subscribe(success => {
      this.getOrderDetails();
      // if (this.subscription != null) {
      //   this.subscription.unsubscribe();
      // }
       this.router.navigate(['market']);
      this.toastrService.success(success.message, 'Success!')
    }, error => {
      console.log(error)
      this.toastrService.error(error.json().message, 'Error!')
    })
  }

  disputeSection(){
   this.showDisupteSection = !this.showDisupteSection;
  }

}
