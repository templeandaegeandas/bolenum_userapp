import { Component, OnInit } from '@angular/core';
import { WithdrawService } from './withdraw.service';
import { WithdrawAmount } from './entity/withdraw.entity';
import { ToastrService } from 'toastr-ng2';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
  providers: [WithdrawService]
})

export class WithdrawComponent implements OnInit {
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


  withdrawForm = new WithdrawAmount();


  constructor(private withdrawService: WithdrawService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.getCurrencyList();
    this.getListOfUserWithdrawlTransaction();
  }

  withdrawAmount(form) {
    if (form.invalid) return;
    this.loading = true;
    let c = this.currencyData.find(x => x.currencyAbbreviation == this.setItemValue);
    this.withdrawService.withdrawFromWallet(c.currencyType, c.currencyAbbreviation, this.withdrawForm).subscribe(success => {
      console.log(success);
      this.ngOnInit();
      form.form.reset();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      console.log(error);
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

  getCurrencyList() {
    this.withdrawService.getCurrencyList().subscribe(success => {
      this.currencyData = success.data;
      this.setItemValue = this.currencyData[0].currencyAbbreviation;
      this.getCoin(this.setItemValue);
    }, error => {

    });

  }

  getCoin(data) {
    this.loading = true;
    let c = this.currencyData.find(x => x.currencyAbbreviation == data);
    this.withdrawService.getCoin(c.currencyType, data).subscribe(success => {
      let successData = success.data;
      if(successData.data!=null) {
        this.address = successData.data.address;
        this.balance = successData.data.balance+" "+data;
        this.coinAbbreviation = successData.data.coinAbbreviation;
      }
      this.loading = false;
    }, errorData => {
      this.getCoin(data);
      this.loading = false;
    })
  }

  getListOfUserWithdrawlTransaction() {
    this.withdrawService.getListOfWithdrawlTransaction(1, 10, "createdOn", "desc").subscribe(success => {
      this.txList = success.data.content;
    })
  }




}
