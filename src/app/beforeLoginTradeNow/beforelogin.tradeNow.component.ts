import { Component, OnInit, ViewChild } from '@angular/core';
import { BeforeLoginTradeNowService } from './beforelogin.tradeNow.service';
import { DepositService } from '../deposit/deposit.service';
import { ToastrService } from 'toastr-ng2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { WebsocketService } from '../web-socket/web.socket.service';
import { AppEventEmiterService } from '../app.event.emmiter.service';

@Component({
  selector: 'app-beforelogintradeNow',
  templateUrl: './beforelogin.tradeNow.component.html',
  styleUrls: ['./beforelogin.tradeNow.component.css'],
  providers: [BeforeLoginTradeNowService, DepositService, WebsocketService]
})
export class BeforLoginTradeNowComponent implements OnInit {
  public sellColor: boolean = false;
  public beforeActiveSELL: boolean = true;
  public buyColor: boolean = true;
  public beforeActiveBUY: boolean = false;
  public hasSellData: boolean = false;
  public hasData: boolean = false;
  public hasAmount: boolean = false;
  public isLoadingForMyTrade: boolean = false;
  public hasBlurForMyTrading: boolean = false;
  public isOpenOrders: boolean = false;
  public hasBlurOpenOrders: boolean = false;
  public hasBlur: boolean = false;
  public isLoading: boolean = false;
  public pairData: any;
  public hasBuy: boolean = false;
  public hasSell: boolean = false;
  public myTradedListLength: any;
  public allTradedListLength: any;
  public myOrdersInBookLength: any;
  public marketTrade: boolean = true;
  public myTrade: boolean = false;
  public marketTradeColor: boolean = true;
  public myTradeColor: boolean = false;
  public beforeActiveMarket: boolean = false;
  public beforeActiveMyTrade: boolean = true;
  orders: any;
  currecyList: any;
  buyOrderList: any;
  sellOrderList: any;
  marketPrice: any;
  market1Btc: any;
  market1BtcEth: any;
  pairList: any;
  pairName: any;
  firstCurrency: any;
  secondCurrency: any;
  firstCurrencyBal: any;
  secondCurrencyBal: any;
  pairId: any;
  loading = false;
  myTradedList: any;
  allTradedList: any;
  myOrdersInBook: any;
  userId: any;
  selecedOrderId: any;
  showModal: boolean = false;
  amount: any;
  price: any;
  minPrice: any = 10;
  sellOrderLength: any;
  buyOrderLength: any;
  tradeFee: any = 0.15;
  tradeFeeFiat: any = 0.0;
  firstCurrencyType: any;
  secondCurrencyType: any;
  totalPrice: any;
  tradingFee: any;
  priceWithFee: any;
  totalSell = 0.0;
  totalBuy = 0.0;
  cancelOrderId: any;
  public btc: boolean = true;
  public eth: boolean = false;
  public bln: boolean = false;
  public ngn: boolean = false;

  // table
  public beforeLogin: boolean = true;
  public afterLogin: boolean = false;
  options: any;
  pairedCurrency = [];

  constructor(
    private tradeNowService: BeforeLoginTradeNowService,
    private depositService: DepositService,
    private toastrService: ToastrService,
    private websocketService: WebsocketService,
    private appEventEmiterService: AppEventEmiterService) {
    if (this.beforeLogin) {
      websocketService.connectForNonLoggedInUser();
    }
    this.appEventEmiterService.currentMessage.subscribe(message => {
      if (message == "ORDER_BOOK_NOTIFICATION") {
        this.getBuyOrderBookData(this.pairId);
        this.getSellOrderBookData(this.pairId);
        this.getAllTradedOrders();
      }
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getCurrencyList();
    this.getAllTradedOrders();
    this.userId = localStorage.getItem('userId');
  }

  getBuyOrderBookData(pairId) {
    this.totalBuy = 0.0;
    this.tradeNowService.buyOrderBook(pairId).subscribe(success => {
      this.buyOrderList = success.data.content;
      this.buyOrderList.map(value => {
        this.totalBuy += value.volume * value.price;
      });
      this.buyOrderLength = this.buyOrderList.length;
    })
  }

  getSellOrderBookData(pairId) {
    this.totalSell = 0.0;
    this.tradeNowService.sellOrderBook(pairId).subscribe(success => {
      this.sellOrderList = success.data.content;
      this.sellOrderList.map(value => {
        this.totalSell += value.volume;
      });
      this.sellOrderLength = this.sellOrderList.length;
    })
  }

  getCurrencyList() {
    this.tradeNowService.getListOfCurrency().subscribe(success => {
      this.currecyList = success.data;
      let currencyId = this.currecyList[0].currencyId;
      let pairedCurrency;
      for (let i = 0; i < this.currecyList.length; i++) {
        this.tradeNowService.getPairedCurrencies(this.currecyList[i].currencyId).subscribe(success => {
          this.pairedCurrency[this.currecyList[i].currencyAbbreviation] = success.data;
          pairedCurrency = this.pairedCurrency[this.currecyList[0].currencyAbbreviation];
        });
      }
      setTimeout(() => {
        this.firstCurrencyType = pairedCurrency[0].toCurrency[0].currencyType;
        this.marketPrice = pairedCurrency[0].toCurrency[0].priceBTC;
        this.secondCurrencyType = pairedCurrency[0].pairedCurrency[0].currencyType;
        this.pairId = pairedCurrency[0].pairId;
        this.pairName = pairedCurrency[0].pairName;
        let pairArray = this.pairName.split("/")
        this.firstCurrency = pairArray[0];
        this.secondCurrency = pairArray[1];
        if (pairArray[0] == 'BLN') {
          this.minPrice = pairedCurrency[0].toCurrency[0].priceNGN;
        }
        if (this.secondCurrency == 'NGN') {
          this.secondCurrencyType = 'FIAT';
        }
        this.getBuyOrderBookData(this.pairId);
        this.getSellOrderBookData(this.pairId);
      }, 1000)
    }, error => {
      this.getCurrencyList();
    })
  }

  changePair(pairId, pairName, firstCurrencyType, secondCurrencyType) {
    this.loading = true;
    this.pairId = pairId;
    this.firstCurrencyType = firstCurrencyType;
    this.secondCurrencyType = secondCurrencyType;
    this.pairName = pairName;
    let pairArray = pairName.split("/")
    this.firstCurrency = pairArray[0];
    this.secondCurrency = pairArray[1];
    if (this.secondCurrency == 'NGN') {
      this.secondCurrencyType = 'FIAT';
    }
    this.getBuyOrderBookData(pairId);
    this.getSellOrderBookData(pairId);
    this.loading = false;
  }

  getAllTradedOrders() {
    this.isLoading = true;
    this.hasBlur = true;
    this.tradeNowService.getAllTradedOrders(1, 10, "createdOn", "desc").subscribe(success => {
      this.isLoading = false;
      this.hasBlur = false;
      this.allTradedList = success.data.content;
      this.allTradedListLength = this.allTradedList.length;
    }, error => {
      console.log(error);
    })
  }

  marketTradeList() {
    this.marketTrade = true;
    this.myTrade = false;
    this.marketTradeColor = true;
    this.myTradeColor = false;
    this.beforeActiveMarket = false;
    this.beforeActiveMyTrade = true;

  }

  showBuyOrder() {
    this.hasSell = false;
    this.hasBuy = true;
    this.amount = '';
    this.price = '';
  }

  showSellOrder() {
    this.hasBuy = false;
    this.hasSell = true;
    this.amount = '';
    this.price = '';
  }

  getMoreOrders() {
    let currentPage = 1;
    let pageSize = 10;
    this.isLoading = true;
    this.hasBlur = true;
    pageSize = pageSize + 10;

    this.tradeNowService.getAllTradedOrders(currentPage, pageSize, "createdOn", "desc").subscribe(success => {
      this.isLoading = false;
      this.hasBlur = false;
      this.allTradedList = success.data.content;
      this.allTradedListLength = this.allTradedList.length;


    }, error => {
      console.log(error);
    })
  }
}
