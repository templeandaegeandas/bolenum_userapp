import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import { WithdrawService } from './withdraw.service';
import { WithdrawAmount } from './entity/withdraw.entity';
import { ToastrService } from 'toastr-ng2';
import { AppEventEmiterService } from '../app.event.emmiter.service';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
  providers: [WithdrawService]
})

export class WithdrawComponent implements OnInit {
  @ViewChild('feeModal') public feeModal: ModalDirective;
  public withrawForm:any;
  public confirmDta:any;
  public userWithdrawFees:any;
  public transactionLength: any;
  public hasBlur: boolean = false;
  public isLoading: boolean = false;
  public currencyData: any;
  public setItemValue: any;
  public address: any;
  public balance: any;
  public coinAbbreviation: any;
  public pageSize: any = 10;
  loading = false;
  txList: any;
  public beforeLogin: boolean = true;
  public afterLogin: boolean = false;
  options: any;
  minWithdrawAmount: any = 0.0;
  withdrawFee: any = 0.0;
  withdrawForm = new WithdrawAmount();
  data: any;

  constructor(private withdrawService: WithdrawService, private appEventEmiterService: AppEventEmiterService,
    private toastrService: ToastrService) {
    this.appEventEmiterService.currentMessage.subscribe(message => {
      if (message == "WITHDRAW_NOTIFICATION") {
        this.getListOfUserWithdrawlTransaction(this.data);
        this.getCoin(this.data);
      }
      message = 'default message';
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getCurrencyList();
  }

  withdrawAmount(form) {
    if (form.invalid) {
      return;
    }
    if (this.withdrawForm.withdrawAmount < this.minWithdrawAmount) {
      this.toastrService.error('You can not withdraw less than min withdraw limit', 'Error!');
      return;
    }
    if(this.withdrawForm.withdrawAmount < this.withdrawFee){
      this.toastrService.error('You can not withdraw less than withdraw fee', 'Error!');
      return;
    }
    else if(this.withdrawForm.withdrawAmount == this.withdrawFee){
      this.toastrService.error('You can not withdraw with equall withdraw fee', 'Error!');
      return;
    }
    this.loading = true;
    let currency: any;
    currency = this.currencyData.find(x => x.currencyAbbreviation == this.setItemValue);
    this.withdrawService.withdrawFromWallet(currency.currencyType, currency.currencyAbbreviation, this.withdrawForm).subscribe(success => {
      this.getCoin(currency.currencyAbbreviation);
      form.resetForm();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    });
  }

  

  getCurrencyList() {
    this.loading = true;
    this.withdrawService.getCurrencyList().subscribe(success => {
      this.loading = false;
      this.currencyData = success.data;
      if (this.currencyData.length > 0) {
        this.setItemValue = this.currencyData[0].currencyAbbreviation;
        this.getCoin(this.setItemValue);
      }
    }, error => {
      console.log(error);
    });

  }


  log(event: boolean) {
    console.log(`Accordion has been ${event ? 'opened' : 'closed'}`);
  }

  getCoin(data) {
    this.loading = true;
    this.data = data;
    this.withdrawForm.toAddress = '';
    this.withdrawForm.withdrawAmount = '';
    let currency;
    this.currencyData.map(function(value) {
      if (value.currencyAbbreviation == data) {
        currency = value;
      }
    });
    this.withdrawService.getCoin(currency.currencyType, data).subscribe(success => {
      let successData: any;
      successData = success.data;
      if (successData.data != null) {
        this.address = successData.data.address;
        this.balance = successData.data.balance;
        if (this.balance < 0) {
          this.balance = 0;
        }
      }
      this.loading = false;
    }, errorData => {
      this.loading = false;
    });
    this.withdrawFees(currency.currencyId);
    this.getListOfUserWithdrawlTransaction(data);
  }

  getListOfUserWithdrawlTransaction(coinCode) {
    this.isLoading = true;
    this.hasBlur = true;
    this.withdrawService.getListOfWithdrawlTransaction(1, 10, "createdOn", "desc", this.data).subscribe(success => {
      this.isLoading = false;
      this.hasBlur = false;
      this.txList = success.data.content;
      this.transactionLength = this.txList.length;
    });
  }

  // for get more transaction

  getMoreTransactionList() {
    let currentPage: any;
    currentPage = 1;
    this.pageSize = this.pageSize + 10;
    this.isLoading = true;
    this.hasBlur = true;
    this.withdrawService.getListOfWithdrawlTransaction(currentPage, this.pageSize, "createdOn", "desc", this.data).subscribe(success => {
      this.isLoading = false;
      this.hasBlur = false;
      this.txList = success.data.content;
      this.transactionLength = this.txList.length;
    });
  }

  withdrawFees(currencyId) {
    this.withdrawService.withdrawFee(currencyId).subscribe(success => {
      if (success.data != null) {
        this.withdrawFee = success.data.fee;
        this.minWithdrawAmount = success.data.minWithDrawAmount;
      }
    });
  }

  hideModal(){
    this.feeModal.hide();
  }
}