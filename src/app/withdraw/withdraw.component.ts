import { Component, OnInit } from '@angular/core';
import { WithdrawService } from './withdraw.service';
import { WithdrawAmount } from './entity/withdraw.entity';
import { ToastrService } from 'toastr-ng2';
import { AppEventEmiterService } from '../app.event.emmiter.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
  providers: [WithdrawService]
})

export class WithdrawComponent implements OnInit {
  public transactionLength: any;
  public hasBlur: boolean = false;
  public isLoading: boolean = false;
  public currencyData: any;
  public setItemValue: any;
  public address: any;
  public balance: any;
  public coinAbbreviation: any;
  loading = false;
  txList: any;
  public beforeLogin: boolean = true;
  public afterLogin: boolean = false;
  options: any;
  minWithdrawAmount: any = 0.0;
  withdrawFee: any = 0.0;
  withdrawForm = new WithdrawAmount();
  data: any;

  constructor(private withdrawService: WithdrawService, private appEventEmiterService: AppEventEmiterService, private toastrService: ToastrService) {
    this.getCurrencyList();
    setTimeout(() => {
      this.getListOfUserWithdrawlTransaction();
    }, 200);
    this.appEventEmiterService.currentMessage.subscribe(message => {
      if (message == "WITHDRAW_NOTIFICATION") {
        this.getListOfUserWithdrawlTransaction();
        this.getCoin(this.data);
      }
      message = "default message";
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  withdrawAmount(form) {
    if (form.invalid) return;
    if (this.withdrawForm.withdrawAmount < this.minWithdrawAmount) {
      this.toastrService.error("You can not withdraw less than min withdraw limit", 'Error!');
      return;
    }
    this.loading = true;
    let currency = this.currencyData.find(x => x.currencyAbbreviation == this.setItemValue);
    this.withdrawService.withdrawFromWallet(currency.currencyType, currency.currencyAbbreviation, this.withdrawForm).subscribe(success => {
      this.getCoin(currency.currencyAbbreviation);
      form.resetForm();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

  getCurrencyList() {
    this.withdrawService.getCurrencyList().subscribe(success => {
      this.currencyData = success.data;
      if (this.currencyData.length > 0) {
        this.setItemValue = this.currencyData[0].currencyAbbreviation;
        this.getCoin(this.setItemValue);
      }
    }, error => {
      console.log(error)
    });

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
    })
    this.withdrawService.getCoin(currency.currencyType, data).subscribe(success => {
      let successData = success.data;
      if (successData.data != null) {
        this.address = successData.data.address;
        this.balance = successData.data.balance + " " + data;
        this.coinAbbreviation = successData.data.coinAbbreviation;
      }
      this.loading = false;
    }, errorData => {
      this.getCoin(data);
      this.loading = false;
    })
    this.withdrawFees(currency.currencyId);
  }

  getListOfUserWithdrawlTransaction() {
    this.isLoading = true;
    this.hasBlur = true;
    this.withdrawService.getListOfWithdrawlTransaction(1, 10, "createdOn", "desc").subscribe(success => {
      this.isLoading = false;
      this.hasBlur = false;
      this.txList = success.data.content;
      this.transactionLength = this.txList.length;
    })
  }

  //for get more transaction

  getMoreTransactionList() {
    let currentPage = 1;
    let pageSize = 10;
    this.isLoading = true;
    this.hasBlur = true;
    pageSize = pageSize + 10;
    this.withdrawService.getListOfWithdrawlTransaction(currentPage, pageSize, "createdOn", "desc").subscribe(success => {
      this.isLoading = false;
      this.hasBlur = false;
      this.txList = success.data.content;
      this.transactionLength = this.txList.length;
    })
  }

  withdrawFees(currencyId) {
    this.withdrawService.withdrawFee(currencyId).subscribe(success => {
      if (success.data != null) {
        this.withdrawFee = success.data.fee;
        this.minWithdrawAmount = success.data.minWithDrawAmount;
      }
    })
  }
}
