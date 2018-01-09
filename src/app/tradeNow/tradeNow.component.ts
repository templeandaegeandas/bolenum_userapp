import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { TradeNowService } from './tradeNow.service';
import { Order } from './entity/order.entity';
import { DepositService } from '../deposit/deposit.service';
import { ToastrService } from 'toastr-ng2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { WebsocketService } from '../web-socket/web.socket.service';
import { AppEventEmiterService } from '../app.event.emmiter.service';
import 'rxjs/add/operator/toPromise';

declare var $: any;

@Component({
  selector: 'app-tradeNow',
  templateUrl: './tradeNow.component.html',
  styleUrls: ['./tradeNow.component.css'],
  providers: [TradeNowService, DepositService, WebsocketService]
})
export class TradeNowComponent implements OnInit {
  @ViewChild('buySellModel') public buySellModel: ModalDirective;
  public sellColor: boolean = false;
  public beforeActiveSELL: boolean = true;
  public buyColor: boolean = true;
  public beforeActiveBUY: boolean = false;
  public hasSellData: boolean = false;
  public hasData: boolean = false;
  public showHide: boolean = false;
  public selected: boolean = false;
  public selectedRow;
  public selectedPair;
  @ViewChild('orderCancelModel') public orderCancelModel: ModalDirective;
  public hasBuyAmount: boolean = false;
  public hasSellAmount: boolean = false;
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
  public currencyName: any;
  orders: any;
  currecyList: any;
  buyOrderList: any;
  sellOrderList: any;
  marketPrice: any;
  market1Btc: any;
  market1BtcEth: any;
  pairList: any;
  order = new Order();
  pairName: any;
  marketCurrencyBal: any;
  pairedCurrencyBal: any;
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
  sellTotalPrice: any;
  buyTotalPrice: any;
  priceWithFee: any;
  totalSell = 0.0;
  totalBuy = 0.0;
  cancelOrderId: any;
  sellVolume;
  sellPrice;
  sellAmount;
  sellTradingFee = 0;
  sellPriceWithFee = 0;
  buyVolume;
  buyPrice;
  buyAmount;
  volume24h;
  countTrade24h;
  low24h;
  high24h;
  bid = 0;
  ask = 0;
  lastPrice = 0;
  buyTradingFee = 0;
  buyPriceWithFee = 0;
  public isBuyMarket: boolean = true;
  public isSellMarket: boolean = true;
  public tradeValue: any[] = [
    { "valueType": "Limit Order" },
    { "valueType": "Market Order" }
  ]

  public setBuyTradingValue: any;
  public setSellTradingValue: any;
  public coinMarketData: any = [];
  // table
  public btc: boolean = true;
  public eth: boolean = false;
  public bln: boolean = false;
  public ngn: boolean = false;

  // table
  public beforeLogin: boolean = true;
  public afterLogin: boolean = false;
  options: any;
  // pairedCurrency = [];
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
    private tradeNowService: TradeNowService,
    private depositService: DepositService,
    private toastrService: ToastrService,
    private router: Router,
    private websocketService: WebsocketService,
    private appEventEmiterService: AppEventEmiterService) {
    this.isLogIn();
    if (this.beforeLogin) {
      websocketService.connectForNonLoggedInUser();
    }
    this.appEventEmiterService.currentMessage.subscribe(message => {
      this.jsonMessage = message;
      if (this.jsonMessage.MARKET_UPDATE == "MARKET_UPDATE") {
        this.currecyList.map((value) => {
          value.market.map((marketValue) => {
            if (marketValue.currencyAbbreviation == this.jsonMessage.pairedCurrency) {
              if (marketValue.lastPrice == null || marketValue.lastPrice == 0 || marketValue.lastPrice > this.jsonMessage.price) {
                marketValue.lastPrice = this.jsonMessage.price;
                return marketValue;
              }
            }
          })
        })
      }
      if (message == "ORDER_BOOK_NOTIFICATION") {
        this.getBuyOrderBookData();
        this.getSellOrderBookData();
        this.getMyTradedOrders();
        this.getAllTradedOrders();
        this.getMyOrdersFromBook();
      }
    });
    this.options = {
      chart: {
        type: 'areaspline'
      },
      position: {
        width: 700
      },
      title: {
        text: ''
      },
      legend: {
        marker: { symbol: 'square', radius: 12 }

      },
      xAxis: {
        categories: [
          'JAN',
          'FEB',
          'MAR',
          'APR',
          'MAY',
          'JUN',
          'JUL',
          'AUG'
        ],

      },
      yAxis: {
        title: {
          text: ' '
        }
      },

      tooltip: {
        shared: false,
        valueSuffix: ' units'
      },

      credits: {
        enabled: false
      },

      plotOptions: {
        areaspline: {
          fillOpacity: 0.5
        },
        series: {

          marker: {

            enabled: false

          }

        }

      },
      series: [{
        name: 'BTC',
        data: [3, 4, 3, 5, 4, 10, 12],
      }, {
        name: 'ETH',

        data: [1, 3, 4, 3, 3, 5, 4]
      }],
      colors: ["#e42d2d", "#3ad1e4"]

    };

  }



  ngOnInit() {
    window.scrollTo(0, 0);
    this.order.volume = 0;
    this.order.price = 0;
    this.isLogIn();
    this.setBuyTradingValue = "Limit Order";
    this.setSellTradingValue = "Limit Order";
    this.setBuyTradeValue("Limit Order");
    this.setSellTradeValue("Limit Order");
    this.getCurrencyList();
    this.getAllTradedOrders();
    this.getMyOrdersFromBook();
    this.userId = localStorage.getItem('userId');
    this.tradingFees();

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
      this.buyOrderLength = this.buyOrderList.length;
    })
  }

  getSellOrderBookData() {
    this.totalSell = 0.0;
    this.tradeNowService.sellOrderBook(this.marketCurrencyId, this.pairedCurrencyId).subscribe(success => {
      this.sellOrderList = success.data.content;
      if (this.sellOrderList.length > 0) {
        this.bid = this.sellOrderList[0].price;
        this.lastPrice = this.bid;
      }
      else {
        this.bid = 0;
        this.lastPrice = this.bid;
      }
      this.sellOrderList.map(value => {
        this.totalSell += value.volume;
      });
      this.sellOrderLength = this.sellOrderList.length;
    })
  }

  /*getMarketPrice() {
    this.tradeNowService.getMarketPrice("ETH").subscribe(success => {
    this.marketPrice = success.data.priceBTC;
    })
  }*/

  oneBuyBtc() {
    this.order.price = this.marketPrice;
    if (this.market1BtcEth == 'Infinity') {
      this.market1BtcEth = 0;
    }

    this.buyTotalPrice = this.buyPrice * this.buyVolume;
    if (this.buyPrice == undefined || this.buyVolume == undefined) {
      this.buyTotalPrice = 0;
    }
    this.buyTradingFee = this.buyTotalPrice * this.tradeFee / 100;
    this.buyPriceWithFee = this.buyTotalPrice + this.buyTradingFee;
  }

  oneSellBtc() {
    this.order.price = this.marketPrice;
    if (this.market1BtcEth == 'Infinity') {
      this.market1BtcEth = 0;
    }
    this.sellTotalPrice = this.sellPrice * this.sellVolume;
    if (this.sellPrice == undefined || this.sellVolume == undefined) {
      this.sellTotalPrice = 0;
    }
    this.sellTradingFee = this.sellTotalPrice * this.tradeFee / 100;
    this.sellPriceWithFee = this.sellTotalPrice - this.sellTradingFee;
  }

  calculateBuyFee() {
    this.buyTotalPrice = this.buyPrice * this.buyVolume;
    if (this.buyPrice == undefined || this.buyVolume == undefined) {
      this.buyTotalPrice = 0;
    }
    this.buyTradingFee = this.buyTotalPrice * this.tradeFee / 100;
    this.buyPriceWithFee = this.buyTotalPrice + this.buyTradingFee;
  }

  calculateSellFee() {
    this.sellTotalPrice = this.sellPrice * this.sellVolume;
    if (this.sellPrice == undefined || this.sellVolume == undefined) {
      this.sellTotalPrice = 0;
    }
    this.sellTradingFee = this.sellTotalPrice * this.tradeFee / 100;
    this.sellPriceWithFee = this.sellTotalPrice - this.sellTradingFee;
  }

  showModel(orderType, volume, price, orderId) {
    if ((price * volume) < 0.0001) {
      this.buySellModel.hide();
      this.toastrService.error("Order value should be 0.0001", 'Error!');
      return;
    }
    // if (this.setTradingValue == 'Limit Order') {
    if (orderType == 'BUY' && (this.buyVolume == undefined || this.buyPrice == undefined)) {
      this.hasBuyAmount = true;
      setTimeout(() => {
        this.hasBuyAmount = false;
      }, 3000);
      return;
    }
    if (orderType == 'SELL' && (this.sellVolume == undefined || this.sellPrice == undefined)) {
      this.hasSellAmount = true;
      setTimeout(() => {
        this.hasSellAmount = false;
      }, 3000);
      return;
    }

    // }
    // else if (this.setTradingValue == 'Market Order') {
    if (orderType == 'BUY' && (this.buyVolume == undefined || this.buyPrice == undefined)) {
      this.hasBuyAmount = true;
      setTimeout(() => {
        this.hasBuyAmount = false;
      }, 3000);
      return;
    }
    if (orderType == 'SELL' && (this.sellVolume == undefined || this.sellPrice == undefined)) {
      this.hasSellAmount = true;
      setTimeout(() => {
        this.hasSellAmount = false;
      }, 3000);
      return;
    }
    // }

    this.buySellModel.show();
    this.selecedOrderId = orderId;
    this.order.volume = volume;
    this.order.price = price;
    this.order.totalVolume = volume;
    this.order.orderStandard = "MARKET";
    this.order.orderType = orderType;

    if (orderType == 'SELL') {
      this.buySellModel.show();
      this.selecedOrderId = orderId;
      this.order.volume = volume;
      this.order.price = price;
      this.order.totalVolume = volume;
      this.order.orderStandard = "MARKET";
      this.order.orderType = orderType;
    }
    else {
      this.buySellModel.show();
      this.selecedOrderId = orderId;
      this.order.volume = volume;
      this.order.price = price;
      this.order.totalVolume = volume;
      this.order.orderStandard = "MARKET";
      this.order.orderType = orderType;
    }

  }

  hideModel() {
    this.buySellModel.hide();
  }

  cancelOrderModel(id) {
    this.cancelOrderId = id;
    this.orderCancelModel.show();
  }

  hideOrderCancelModel() {
    this.orderCancelModel.hide();
  }

  createFiatOrder() {
    if (this.order.volume < 1) {
      this.buySellModel.hide();
      this.toastrService.error("You can't create order with less than 1.0 volume!", 'Error!');
      return;
    }
    if (this.order.price < 1) {
      this.buySellModel.hide();
      this.toastrService.error("You can't create order with less than 1.0 price!", 'Error!');
      return;
    }
    this.loading = true;
    this.order.totalVolume = this.order.volume;
    this.order.marketCurrency = this.marketCurrencyObj;
    this.order.pairedCurrency = this.pairedCurrencyObj;
    this.tradeNowService.createFiatOrder(this.order, this.selecedOrderId).subscribe(success => {
      this.buySellModel.hide();
      this.order.price = '';
      this.order.volume = '';
      this.getAllTradedOrders();
      this.getMyOrdersFromBook();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
      if (this.order.orderType == 'BUY') {
        this.router.navigate(['trading/' + success.data.orderId]);
      }
      else {
        this.router.navigate(['sell/' + success.data.orderId]);
      }
    }, error => {
      this.buySellModel.hide();
      this.order.price = '';
      this.order.volume = '';
      this.priceWithFee = 0.0;
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

  createOrder() {
    if ((this.order.price * this.order.volume) < 0.0001) {
      this.buySellModel.hide();
      this.toastrService.error("Order value should be 0.0001", 'Error!');
      return;
    }
    this.loading = true;
    if (this.isBuyMarket || this.isSellMarket) {
      this.order.orderStandard = 'LIMIT';
    }
    else {
      this.order.orderStandard = 'MARKET';
    }
    this.order.totalVolume = this.order.volume;
    this.order.marketCurrency = this.marketCurrencyObj;
    this.order.pairedCurrency = this.pairedCurrencyObj;
    this.tradeNowService.createOrder(this.order).subscribe(success => {
      this.buySellModel.hide();
      this.buyPrice = '';
      this.buyVolume = '';
      this.buyTotalPrice = 0.0;
      this.buyTradingFee = 0.0;
      this.buyPriceWithFee = 0.0;
      this.sellPrice = '';
      this.sellVolume = '';
      this.sellTotalPrice = 0.0;
      this.sellTradingFee = 0.0;
      this.sellPriceWithFee = 0.0;
      this.getAllTradedOrders();
      this.getMyOrdersFromBook();
      this.getUserBalance();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      this.buySellModel.hide();
      this.order.price = '';
      this.order.volume = '';
      this.priceWithFee = 0.0;
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
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
      this.getUserBalance();
      this.getBuyOrderBookData();
      this.getSellOrderBookData();
      this.getOurMarketData();
      this.getCoinMarketCapData(this.marketCurrencyObj.currencyName, this.pairedCurrency);
      this.select(this.pairedCurrencyId, this.marketCurrencyId);
      this.isActive(this.pairedCurrencyId, this.marketCurrencyId);
      // this.currecyList = success.data;
      // let currencyId = this.currecyList[0].currencyId;
      // this.currencyName = this.currecyList[0].currencyName;
      // this.getCoinMarketCapData(this.currencyName, this.currecyList[0].currencyAbbreviation);
      // let pairedCurrency;
      // for (let i = 0; i < this.currecyList.length; i++) {
      //   this.tradeNowService.getPairedCurrencies(this.currecyList[i].currencyId).subscribe(success => {
      //     this.pairedCurrency[this.currecyList[i].currencyAbbreviation] = success.data;
      //     pairedCurrency = this.pairedCurrency[this.currecyList[0].currencyAbbreviation];
      //   });
      // }
      // setTimeout(() => {
      //   this.marketCurrencyType = pairedCurrency[0].toCurrency[0].currencyType;
      //   this.marketPrice = pairedCurrency[0].toCurrency[0].priceBTC;
      //   this.pairedCurrencyType = pairedCurrency[0].pairedCurrency[0].currencyType;
      //   this.pairId = pairedCurrency[0].pairId;
      //   console.log(this.pairId);
      //   // if(this.jsonMessage=="cancelPay"){
      //   //    this.select(4, 3);
      //   //   this.isActive(4, 3);
      //   //    // this.pairId=4;
      //   //   this.pairName="BLN/NGN";
      //   // }else{
      //   this.select(this.pairId, pairedCurrency[0].toCurrency[0].currencyId);
      //   this.isActive(this.pairId, pairedCurrency[0].toCurrency[0].currencyId);
      //   this.pairName = pairedCurrency[0].pairName;
      // // }
      //   let pairArray = this.pairName.split("/")
      //   this.marketCurrency = pairArray[0];
      //   this.pairedCurrency = pairArray[1];
      //   let temp = this.pairedCurrency['BLN'];
      //   this.minPrice =temp[0].lastPrice;
      //   if (this.pairedCurrency == 'NGN') {
      //     this.pairedCurrencyType = 'FIAT';
      //   }
      //   this.getUserBalance();
      //   this.getBuyOrderBookData(this.pairId);
      //   this.getSellOrderBookData(this.pairId);
      //   this.getOurMarketData();
      // }, 1000)
    }, error => {
      this.getCurrencyList();
    })
  }

  cancelOrder() {
    this.tradeNowService.cancelOrder(this.cancelOrderId).subscribe(success => {
      this.hideOrderCancelModel();
      this.getMyOrdersFromBook();
      this.toastrService.success(success.message, "Success!");
    })
  }

  changePair(marketCurrency, pairedCurrency) {
    this.loading = true;
    this.marketCurrencyObj = marketCurrency;
    this.pairedCurrencyObj = pairedCurrency;
    this.marketCurrencyType = marketCurrency.currencyType;
    this.pairedCurrencyType = pairedCurrency.currencyType;
    this.marketCurrencyId = marketCurrency.currencyId;
    this.pairedCurrencyId = pairedCurrency.currencyId;
    this.select(this.pairedCurrencyId, this.marketCurrencyId);
    this.marketCurrency = marketCurrency.currencyAbbreviation;
    this.pairedCurrency = pairedCurrency.currencyAbbreviation;
    this.pairName = this.pairedCurrency + "/" + this.marketCurrency;
    if (this.pairedCurrencyType == 'FIAT') {
      this.marketCurrency = pairedCurrency.currencyAbbreviation;
      this.pairedCurrency = marketCurrency.currencyAbbreviation;
    }
    this.getUserBalance();
    this.getBuyOrderBookData();
    this.getSellOrderBookData();
    this.getOurMarketData();
    this.getCoinMarketCapData(marketCurrency.currencyName, this.pairedCurrency);
    this.buyPrice = '';
    this.buyVolume = '';
    this.buyPriceWithFee = 0.0;
    this.buyTotalPrice = 0.0;
    this.buyTradingFee = 0.0;
    this.sellPrice = '';
    this.sellVolume = '';
    this.sellPriceWithFee = 0.0;
    this.sellTradingFee = 0.0;
    this.sellTotalPrice = 0.0;
    this.loading = false;
  }

  getUserBalance() {
    if (this.pairedCurrencyType != 'FIAT') {
      this.depositService.getCoin(this.pairedCurrencyType, this.pairedCurrency).subscribe(success => {
        this.pairedCurrencyBal = success.data.data.balance;
      }, error => {
        this.pairedCurrencyBal = 0.0;
      })
      this.depositService.getCoin(this.marketCurrencyType, this.marketCurrency).subscribe(success => {
        if (success.data != null)
          this.marketCurrencyBal = success.data.data.balance;
      }, error => {
        this.marketCurrencyBal = 0.0;
      })
    }
  }

  fillBuyData(volume, price) {
    this.setBuyTradingValue = "Limit Order";
    this.setBuyTradeValue("Limit Order");
    this.buyVolume = volume;
    this.buyPrice = price;
    this.buyTotalPrice = this.buyPrice * this.buyVolume;
    this.buyTradingFee = this.buyTotalPrice * this.tradeFee / 100;
    this.buyPriceWithFee = this.buyTotalPrice + this.buyTradingFee;
    this.order.orderStandard = "LIMIT";
    this.sellVolume = volume;
    this.sellPrice = price;
    this.sellTotalPrice = this.sellPrice * this.sellVolume;
    this.sellTradingFee = this.sellTotalPrice * this.tradeFee / 100;
    this.sellPriceWithFee = this.sellTotalPrice - this.sellTradingFee;
  }

  fillSellData(volume, price) {
    this.setSellTradingValue = "Limit Order";
    this.setSellTradeValue("Limit Order");
    this.sellVolume = volume;
    this.sellPrice = price;
    this.sellTotalPrice = this.sellPrice * this.sellVolume;
    this.sellTradingFee = this.sellTotalPrice * this.tradeFee / 100;
    this.sellPriceWithFee = this.sellTotalPrice - this.sellTradingFee;
    this.order.orderStandard = "LIMIT"
  }

  getMyTradedOrders() {
    this.isLoadingForMyTrade = true;
    this.hasBlurForMyTrading = true;
    this.tradeNowService.getTradedOrders(1, 10, "createdOn", "desc").subscribe(success => {
      this.isLoadingForMyTrade = false;
      this.hasBlurForMyTrading = false;
      this.myTradedList = success.data.content;
      this.myTradedListLength = this.myTradedList.length;

    }, error => {
      console.log(error);
    })
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

  getMyOrdersFromBook() {
    this.isOpenOrders = true;
    this.hasBlurOpenOrders = true;
    this.tradeNowService.getMyOrdersFromBook(1, 10, "createdOn", "desc").subscribe(success => {
      this.isOpenOrders = false;
      this.hasBlurOpenOrders = false;
      this.myOrdersInBook = success.data.content;
      this.myOrdersInBookLength = this.myOrdersInBook.length;


    }, error => {
      console.log(error);
    })
  }

  tradingFees() {
    this.tradeNowService.tradingFee().subscribe(success => {
      if (success.data != null) {
        this.tradeFee = success.data.fee;
        this.tradeFeeFiat = success.data.fiat;
      }
    })
  }

  isLogIn() {

    if (localStorage.getItem("token") == null) {
      return;
    }
    else {
      this.beforeLogin = false;
      this.afterLogin = true;

    }

  }

  setBuyTradeValue(setData) {
    if (setData === "Limit Order") {
      this.isBuyMarket = true;
    }
    else {
      this.isBuyMarket = false;

    }
    this.buyPrice = '';
    this.buyVolume = '';

  }

  setSellTradeValue(setData) {
    if (setData === "Limit Order") {
      this.isSellMarket = true;
    }
    else {
      this.isSellMarket = false;

    }
    this.sellPrice = '';
    this.sellVolume = '';

  }

  // method to show table of market trade and my trade

  marketTradeList() {
    this.marketTrade = true;
    this.myTrade = false;
    this.marketTradeColor = true;
    this.myTradeColor = false;
    this.beforeActiveMarket = false;
    this.beforeActiveMyTrade = true;

  }

  myTradeList() {
    this.getMyTradedOrders();
    this.marketTrade = false;
    this.myTrade = true;
    this.marketTradeColor = false;
    this.myTradeColor = true;
    this.beforeActiveMarket = true;
    this.beforeActiveMyTrade = false;

  }

  // method to show table of market trade and my trade

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

  changedBuyList() {
    if (this.buyAmount == '' || this.buyAmount == null || this.buyPrice == null) {
      this.getSellOrderBookData();
    }
    else {
      if (this.buyPrice == '') {
        this.buyPrice = this.minPrice;
      }
      this.tradeNowService.getListFiatOrders(this.buyAmount, this.buyPrice, 'BUY', this.marketCurrencyId, this.pairedCurrencyId).subscribe(success => {
        this.sellOrderList = success.data.content;
        console.log("Sell Order List", this.sellOrderList);
        this.sellOrderLength = this.sellOrderList.length;
      })
    }
  }

  changedSellList() {
    if (this.sellAmount == '' || this.sellAmount == null || this.sellPrice == null) {
      this.getBuyOrderBookData();
    }
    else {
      if (this.sellPrice == '') {
        this.sellPrice = this.minPrice;
      }
      this.tradeNowService.getListFiatOrders(this.sellAmount, this.sellPrice, 'SELL', this.marketCurrencyId, this.pairedCurrencyId).subscribe(success => {
        this.buyOrderList = success.data.content;
        console.log("Buy Order List", this.buyOrderList);
        this.buyOrderLength = this.buyOrderList.length;
      })
    }
  }

  createAdvertisement(orderType) {
    if (orderType == 'BUY' && this.buyAmount < 1) {
      this.toastrService.error("You can't create order with less than 1.0 volume!", 'Error!');
      return;
    }
    if (orderType == 'SELL' && this.sellAmount < 1) {
      this.toastrService.error("You can't create order with less than 1.0 volume!", 'Error!');
      return;
    }
    if (orderType == 'BUY' && (this.buyAmount == '' || this.buyPrice == '')) {
      this.hasData = !this.hasData;
      setTimeout(() => {
        this.hasData = !this.hasData;
      }, 3000);
      return;

    }

    else if (orderType == 'SELL' && (this.sellAmount == '' || this.sellPrice == '')) {
      this.hasSellData = !this.hasSellData;
      setTimeout(() => {
        this.hasSellData = !this.hasSellData;
      }, 3000);
      return;

    }
    if ((orderType == 'BUY' && this.buyPrice < this.minPrice) || (orderType == 'SELL' && this.sellPrice < this.minPrice)) {
      this.toastrService.error("You can't place order less than " + this.minPrice + " NGN", "Error!");
      return;
    }
    if (orderType == 'BUY') {
      this.order.orderType = orderType;
      this.order.orderStandard = 'LIMIT';
      this.order.volume = this.buyAmount;
      this.order.price = this.buyPrice;
      this.order.totalVolume = this.buyAmount;
      this.order.marketCurrency = this.marketCurrencyObj;
      this.order.pairedCurrency = this.pairedCurrencyObj;
      this.tradeNowService.createAdvertisment(this.order).subscribe(success => {
        this.getBuyOrderBookData();
        this.getSellOrderBookData();
        this.getMyOrdersFromBook();
        this.toastrService.success("Your order created successfully!", "Success!")
      }, error => {
        this.toastrService.error(error.json().message, "Error!");
      })
    }
    else {
      this.order.orderType = orderType;
      this.order.orderStandard = 'LIMIT';
      this.order.volume = this.sellAmount;
      this.order.price = this.sellPrice;
      this.order.totalVolume = this.sellAmount;
      this.order.marketCurrency = this.marketCurrencyObj;
      this.order.pairedCurrency = this.pairedCurrencyObj;
      this.tradeNowService.createAdvertisment(this.order).subscribe(success => {
        this.getBuyOrderBookData();
        this.getSellOrderBookData();
        this.getMyOrdersFromBook();
        this.toastrService.success("Your order created successfully!", "Success!")
      }, error => {
        this.toastrService.error(error.json().message, "Error!");
      })
    }
    this.buyAmount = '';
    this.sellAmount = '';
    this.buyPrice = '';
    this.sellPrice = '';
  }

  // to get more orders on tradeHistory table on click of more

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

  getMoreMyTradeList() {

    let currentPage = 1;
    let pageSize = 10;
    this.isLoadingForMyTrade = true;
    this.hasBlurForMyTrading = true;
    pageSize = pageSize + 10;
    this.tradeNowService.getTradedOrders(currentPage, pageSize, "createdOn", "desc").subscribe(success => {
      this.isLoadingForMyTrade = false;
      this.hasBlurForMyTrading = false;
      this.myTradedList = success.data.content;
      this.myTradedListLength = this.myTradedList.length;

    }, error => {
      console.log(error);
    })


  }

  getMoreMyOrder() {

    let currentPage = 1;
    let pageSize = 10;

    this.isOpenOrders = true;
    this.hasBlurOpenOrders = true;
    pageSize = pageSize + 10;
    this.tradeNowService.getMyOrdersFromBook(currentPage, pageSize, "createdOn", "desc").subscribe(success => {
      this.isOpenOrders = false;
      this.hasBlurOpenOrders = false;
      this.myOrdersInBook = success.data;
      this.myOrdersInBookLength = this.myOrdersInBook.length;


    }, error => {
      console.log(error);
    })
  }

  buyToggle() {
    this.beforeActiveSELL = true;
    this.sellColor = false;
    this.beforeActiveBUY = false;
    this.buyColor = true;
    this.order.volume = '';
    this.order.price = '';
    this.priceWithFee = 0.0;
    this.amount = '';
    this.price = '';
    if (this.marketCurrency == 'NGN' || this.pairedCurrency == 'NGN') {
      this.getBuyOrderBookData();
    }
  }

  sellToggle() {

    this.beforeActiveSELL = false;
    this.sellColor = true;
    this.beforeActiveBUY = true;
    this.buyColor = false;
    this.order.volume = '';
    this.order.price = '';
    this.priceWithFee = 0.0;
    this.amount = '';
    this.price = '';
    if (this.marketCurrency == 'NGN' || this.pairedCurrency == 'NGN') {
      this.getSellOrderBookData();
    }
  }

  showHideDiv() {
    this.showHide = !this.showHide;
    this.selected = !this.selected;
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

  getCoinMarketCapData(currencyName, currencyAbber) {
    let seturl: any;

    seturl = 'https://api.coinmarketcap.com/v1/ticker/' + currencyName + '/?convert=' + currencyAbber;

    $.ajax({
      url: seturl,
      type: 'GET',
      success: resp => {
        this.coinMarketData = resp;
      },
      error: e => {
        console.log(e)
      }
    });
  }

  getOurMarketData() {
    this.tradeNowService.marketData(this.marketCurrencyId, this.pairedCurrencyId).subscribe(success => {
      this.volume24h = success.data.volume24h;
      this.low24h = success.data.low24h;
      this.high24h = success.data.high24h;
      this.countTrade24h = success.data.countTrade24h;
    })
  }

}
