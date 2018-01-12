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
  public pageSize:any =10;
  pairName;
  volume24h;
  countTrade24h;
  low24h;
  high24h;
  bid = 0;
  ask = 0;
  currecyList: any;
  buyOrderList: any;
  sellOrderList: any;
  loading = false;
  allTradedList: any;
  userId: any;
  totalSell = 0.0;
  totalBuy = 0.0;
  selectedRow;
  selectedPair;
  public btc: boolean = true;
  public eth: boolean = false;
  public bln: boolean = false;
  public ngn: boolean = false;

  // table
  public beforeLogin: boolean = true;
  public afterLogin: boolean = false;
  options: any;
  jsonMessage: any;
  marketCurrency;
  pairedCurrency;
  marketCurrencyType;
  pairedCurrencyType;
  marketCurrencyId;
  pairedCurrencyId;
  marketCurrencyObj;
  pairedCurrencyObj;

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
      this.jsonMessage = message;
      if (this.jsonMessage.MARKET_UPDATE == "MARKET_UPDATE") {
        this.currecyList.map((value) => {
          value.market.map((marketValue) => {
            if (marketValue.currencyAbbreviation == this.jsonMessage.pairedCurrency) {
              if (this.jsonMessage.priceBTC > 0 && (marketValue.priceBTC == null || marketValue.priceBTC == 0 || marketValue.priceBTC > this.jsonMessage.priceBTC)) {
                marketValue.priceBTC = this.jsonMessage.priceBTC;
                return marketValue;
              }
              else if (this.jsonMessage.priceETH > 0 && (marketValue.priceETH == null || marketValue.priceETH == 0 || marketValue.priceETH > this.jsonMessage.priceETH)) {
                marketValue.priceETH = this.jsonMessage.priceETH;
                return marketValue;
              }
              else if (this.jsonMessage.priceBLN > 0 && (marketValue.priceBLN == null || marketValue.priceBLN == 0 || marketValue.priceBLN > this.jsonMessage.priceBLN)) {
                marketValue.priceBLN = this.jsonMessage.priceBLN;
                return marketValue;
              }
            }
          })
        })
      }
      if (message == "ORDER_BOOK_NOTIFICATION") {
        this.getBuyOrderBookData();
        this.getSellOrderBookData();
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

   getBuyOrderBookData() {
    this.totalBuy = 0.0;
    this.tradeNowService.buyOrderBook(this.marketCurrencyId, this.pairedCurrencyId).subscribe(success => {
      this.buyOrderList = success.data.content;
      if (this.buyOrderList.length > 0) {
        this.bid = this.buyOrderList[0].price;
      }
      else {
        this.bid = 0;
      }
      this.buyOrderList.map(value => {
        this.totalBuy += value.volume * value.price;
      });
    })
  }

  getSellOrderBookData() {
    this.totalSell = 0.0;
    this.tradeNowService.sellOrderBook(this.marketCurrencyId, this.pairedCurrencyId).subscribe(success => {
      this.sellOrderList = success.data.content;
      if (this.sellOrderList.length > 0) {
        this.bid = this.sellOrderList[0].price;
      }
      else {
        this.bid = 0;
      }
      this.sellOrderList.map(value => {
        this.totalSell += value.volume;
      });
    })
  }

  getCurrencyList() {
    this.tradeNowService.getListOfCurrency().subscribe(success => {
      this.currecyList = success.data;
      this.pairName = this.currecyList[0].market[0].currencyAbbreviation + "/" + this.currecyList[0].currencyAbbreviation;
      this.marketCurrencyObj = this.currecyList[0];
      this.pairedCurrencyObj = this.currecyList[0].market[0];
      this.pairedCurrency = this.currecyList[0].market[0].currencyAbbreviation;
      this.marketCurrency = this.currecyList[0].currencyAbbreviation;
      this.pairedCurrencyId = this.currecyList[0].market[0].currencyId;
      this.marketCurrencyId = this.currecyList[0].currencyId;
      this.pairedCurrencyType = this.currecyList[0].market[0].currencyType;
      this.marketCurrencyType = this.currecyList[0].currencyType;
      this.getBuyOrderBookData();
      this.getSellOrderBookData();
      
        this.select(this.pairedCurrencyId, this.marketCurrencyId);
        this.isActive(this.pairedCurrencyId, this.marketCurrencyId);
    }, error => {
      console.log("Error in getting currency list")
    })
  }

  changePair(marketCurrency, pairedCurrency) {
    this.selectedRow = pairedCurrency.currencyId;
    this.loading = true;
    this.marketCurrencyObj = marketCurrency;
    this.pairedCurrencyObj = pairedCurrency;
    this.marketCurrencyType = marketCurrency.currencyType;
    this.pairedCurrencyType = pairedCurrency.currencyType;
    this.marketCurrencyId = marketCurrency.currencyId;
    this.pairedCurrencyId = pairedCurrency.currencyId;
    // console.log("Get Currency Pair ID",this.pairedCurrencyId);
    // console.log("Get Market Currency ID",this.marketCurrencyId);
    this.select(this.pairedCurrencyId, this.marketCurrencyId);
    this.marketCurrency = marketCurrency.currencyAbbreviation;
    this.pairedCurrency = pairedCurrency.currencyAbbreviation;
    this.pairName = this.pairedCurrency + "/" + this.marketCurrency;
    if (this.pairedCurrencyType == 'FIAT') {
      this.marketCurrency = pairedCurrency.currencyAbbreviation;
      this.pairedCurrency = marketCurrency.currencyAbbreviation;
    }
    this.getBuyOrderBookData();
    this.getSellOrderBookData();
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
  }

  showSellOrder() {
    this.hasBuy = false;
    this.hasSell = true;
  }

  getMoreOrders() {
    let currentPage = 1;
    this.pageSize = this.pageSize+10;
    this.isLoading = true;
    this.hasBlur = true;
    this.tradeNowService.getAllTradedOrders(currentPage, this.pageSize, "createdOn", "desc").subscribe(success => {
      this.isLoading = false;
      this.hasBlur = false;
      this.allTradedList = success.data.content;
      this.allTradedListLength = this.allTradedList.length;


    }, error => {
      console.log(error);
    })
  }

  select(pairedCurrency, marketCurrency) {
    this.selectedPair = marketCurrency;
    this.selectedRow = pairedCurrency;
  }

  isActiveTab(marketCurrency) {
    return this.selectedPair === marketCurrency;
  }

  isActive(pairedCurrencyId, marketCurrencyId) {
    return this.selectedRow === pairedCurrencyId;
  }
}
