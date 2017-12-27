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
  public showHide:boolean = true;
  public selected:boolean =false;
  @ViewChild('orderCancelModel') public orderCancelModel: ModalDirective;
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
  order = new Order();
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
  sellTotalPrice: any;
  buyTotalPrice: any;
  priceWithFee: any;
  totalSell = 0.0;
  totalBuy = 0.0;
  cancelOrderId: any;
  sellVolume;
  sellPrice;
  sellTradingFee = 0;
  sellPriceWithFee = 0;
  buyVolume;
  buyPrice;
  buyTradingFee = 0;
  buyPriceWithFee = 0;
  public isMarket: boolean = true;
  public tradeValue: any[] = [
    { "valueType": "Limit Order" },
    { "valueType": "Market Order" }
  ]

  public setTradingValue: any;
  // table
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
      if (message == "ORDER_BOOK_NOTIFICATION") {
        this.getBuyOrderBookData(this.pairId);
        this.getSellOrderBookData(this.pairId);
        this.getMyTradedOrders();
        // setTimeout(() => {
        this.getAllTradedOrders();
        // }, 100);
        // setTimeout(() => {
        this.getMyOrdersFromBook();
        // }, 100);
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
    this.setTradingValue = "Limit Order";
    this.setTradeValue("Limit Order");
    this.getCurrencyList();
    this.getAllTradedOrders();
    this.getMyOrdersFromBook();
    this.userId = localStorage.getItem('userId');
    this.tradingFees()
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
    if(this.buyPrice == undefined || this.buyVolume == undefined) {
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
    if(this.sellPrice == undefined || this.sellVolume == undefined) {
      this.sellTotalPrice = 0;
    }
    this.sellTradingFee = this.sellTotalPrice * this.tradeFee / 100;
    this.sellPriceWithFee = this.sellTotalPrice - this.sellTradingFee;
  }

  calculateBuyFee() {
    this.buyTotalPrice = this.buyPrice * this.buyVolume;
    if(this.buyPrice == undefined || this.buyVolume == undefined) {
      this.buyTotalPrice = 0;
    }
    this.buyTradingFee = this.buyTotalPrice * this.tradeFee / 100;
    this.buyPriceWithFee = this.buyTotalPrice + this.buyTradingFee;
  }

  calculateSellFee() {
    this.sellTotalPrice = this.sellPrice * this.sellVolume;
    if(this.sellPrice == undefined || this.sellVolume == undefined) {
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
    if (this.setTradingValue == 'Limit Order') {
      if (volume == '' || price == '') {
        this.hasAmount = true;
        setTimeout(() => {
          this.hasAmount = false;
        }, 3000);
        return;
      }

    }
    else if (this.setTradingValue == 'Market Order') {
      if (volume == '' || price == '') {
        this.hasAmount = true;
        setTimeout(() => {
          this.hasAmount = false;
        }, 3000);
        return;
      }
    }


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
    this.tradeNowService.createFiatOrder(this.order, this.pairId, this.selecedOrderId).subscribe(success => {
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
    if (this.isMarket) {
      this.order.orderStandard = 'LIMIT';
    }
    else {
      this.order.orderStandard = 'MARKET';
    }
    this.order.totalVolume = this.order.volume;
    this.tradeNowService.createOrder(this.order, this.pairId).subscribe(success => {
      this.buySellModel.hide();
      this.order.price = '';
      this.order.volume = '';
      this.priceWithFee = 0.0;
      this.getAllTradedOrders();
      this.getMyOrdersFromBook();
      this.getUserBalance();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      console.log(error);
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
        this.getUserBalance();
        this.getBuyOrderBookData(this.pairId);
        this.getSellOrderBookData(this.pairId);
      }, 500)
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
    this.getUserBalance();
    this.getBuyOrderBookData(pairId);
    this.getSellOrderBookData(pairId);
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
    if (this.firstCurrency == 'NGN') {
      this.secondCurrencyType = 'FIAT';
      this.firstCurrencyType = 'ERC20TOKEN';
    }
    if (this.secondCurrency == 'NGN') {
      this.secondCurrencyType = 'ERC20TOKEN';
      this.firstCurrencyType = 'FIAT';
    }
    this.depositService.getCoin(this.secondCurrencyType, this.firstCurrency).subscribe(success => {
      this.firstCurrencyBal = success.data.data.balance;
    }, error => {
      this.firstCurrencyBal = 0.0;
    })
    this.depositService.getCoin(this.firstCurrencyType, this.secondCurrency).subscribe(success => {
      if (success.data != null)
        this.secondCurrencyBal = success.data.data.balance;
    }, error => {
      this.secondCurrencyBal = 0.0;
    })
  }

  fillBuyData(volume, price) {
    this.setTradingValue = "Limit Order";
    this.setTradeValue("Limit Order");
    this.buyVolume = volume;
    this.buyPrice = price;
    this.buyTotalPrice = this.buyPrice * this.buyVolume;
    this.buyTradingFee = this.buyTotalPrice * this.tradeFee / 100;
    this.buyPriceWithFee = this.buyTotalPrice + this.buyTradingFee;
    this.order.orderStandard = "LIMIT"
  }

  fillSellData(volume, price) {
    this.setTradingValue = "Limit Order";
    this.setTradeValue("Limit Order");
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

  setTradeValue(setData) {
    if (setData === "Limit Order") {
      this.isMarket = true;
    }
    else {
      this.isMarket = false;

    }
    this.order.price = '';
    this.order.volume = '';

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

  changedList() {
    let orderType = 'BUY';
    if (this.sellColor) {
      orderType = 'SELL';
    }
    if (this.amount == '' || this.amount == null || this.price == null) {
      if (orderType == 'SELL') {
        this.getBuyOrderBookData(this.pairId);
      }
      else {
        this.getSellOrderBookData(this.pairId);
      }
    }
    else {
      console.log(this.price)
      if (this.price == '') {
        this.price = this.minPrice;
      }
      this.tradeNowService.getListFiatOrders(this.amount, this.price, orderType, this.pairId).subscribe(success => {
        if (orderType == 'SELL') {
          this.buyOrderList = success.data.content;
          this.buyOrderLength = this.buyOrderList.length;
        }
        else {
          this.sellOrderList = success.data.content;
          this.sellOrderLength = this.sellOrderList.length;
        }
      })
    }
  }

  createAdvertisement() {
    if (this.amount < 1) {
      this.toastrService.error("You can't create order with less than 1.0 volume!", 'Error!');
      return;
    }
    let orderType = 'BUY';
    if (this.sellColor) {
      orderType = 'SELL'
    }
    if (orderType == 'BUY' && (this.amount == '' || this.price == '')) {
      this.hasData = !this.hasData;
      setTimeout(() => {
        this.hasData = !this.hasData;
      }, 3000);
      return;

    }

    else if (orderType == 'SELL' && (this.amount == '' || this.price == '')) {
      this.hasSellData = !this.hasSellData;
      setTimeout(() => {
        this.hasSellData = !this.hasSellData;
      }, 3000);
      return;

    }
    if (this.price < this.minPrice) {
      this.toastrService.error("You can't place order less than 10 NGN", "Error!");
      return;
    }
    this.order.orderType = orderType;
    this.order.orderStandard = 'LIMIT';
    this.order.volume = this.amount;
    this.order.price = this.price;
    this.order.totalVolume = this.amount;
    this.tradeNowService.createAdvertisment(this.order, this.pairId).subscribe(success => {
      this.getBuyOrderBookData(this.pairId);
      this.getSellOrderBookData(this.pairId);
      this.getMyOrdersFromBook();
      this.toastrService.success("Your order created successfully!", "Success!")
    }, error => {
      this.toastrService.error(error.json().message, "Error!");
    })
    this.buyOrderLength = 0;
    this.sellOrderLength = 0;
    this.amount = '';
    this.price = '';
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
    if (this.firstCurrency == 'NGN' || this.secondCurrency == 'NGN') {
      this.getBuyOrderBookData(this.pairId);
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
    if (this.firstCurrency == 'NGN' || this.secondCurrency == 'NGN') {
      this.getSellOrderBookData(this.pairId);
    }
  }

  showHideDiv(){
   this.showHide = !this.showHide;
   this.selected = !this.selected;
 }


}
