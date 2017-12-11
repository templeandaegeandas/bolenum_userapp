import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';
import { TradeNowService } from './tradeNow.service';
import { Order } from './entity/order.entity';
import { DepositService } from '../deposit/deposit.service';
import { ToastrService } from 'toastr-ng2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { WebsocketService } from '../web-socket/web.socket.service';
import { AppEventEmiterService } from '../app.event.emmiter.service';

@Component({
  selector: 'app-tradeNow',
  templateUrl: './tradeNow.component.html',
  styleUrls: ['./tradeNow.component.css'],
  providers: [TradeNowService, DepositService, WebsocketService]
})
export class TradeNowComponent implements OnInit {
  @ViewChild('buySellModel') public buySellModel: ModalDirective;
  public hasSellData:boolean = false;
  public hasData:boolean = false;
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
  userId: number;
  selecedOrderId: any;
  showModal: boolean = false;
  amount: any;
  price: any;
  minPrice: any = 10;
  sellOrderLength: any;
  buyOrderLength: any;
  tradeFee: any = 0.0;
  tradeFeeFiat: any = 0.0;
  firstCurrencyType: any;
  secondCurrencyType: any;
  public isMarket: boolean = true;
  public tradeValue: any[] = [
    { "valueType": "Market Order" },
    { "valueType": "Limit Order" }
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
        setTimeout(() => {
          this.getAllTradedOrders();
        }, 100);
        setTimeout(() => {
          this.getMyOrdersFromBook();
        }, 100);
      }
    });
    this.options = {
      chart: {
        type: 'areaspline'
      },
      title: {
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
    this.order.volume = 0;
    this.order.price = 0;
    this.isLogIn();
    this.setTradingValue = "Market Order";
    this.setTradeValue("Market Order");
    //this.getMarketPrice();
    this.getCurrencyList();
    setTimeout(() => {
      this.getAllTradedOrders();
    }, 100);
    setTimeout(() => {
      this.getMyOrdersFromBook();
    }, 100);
    this.tradeNowService.getUserDetails().subscribe(success => {
      this.userId = success.data.userId;
    }, error => {
      console.log(error)
    })
    this.tradingFees()
  }

  getBuyOrderBookData(pairId) {
    this.tradeNowService.buyOrderBook(pairId).subscribe(success => {
      this.buyOrderList = success.data.content;
      this.buyOrderLength = this.buyOrderList.length;
    })
  }

  getSellOrderBookData(pairId) {
    this.tradeNowService.sellOrderBook(pairId).subscribe(success => {
      this.sellOrderList = success.data.content;
      this.sellOrderLength = this.sellOrderList.length;
    })
  }

  /*getMarketPrice() {
    this.tradeNowService.getMarketPrice("ETH").subscribe(success => {
      this.marketPrice = success.data.priceBTC;
    })
  }*/

  getCurrencyList() {
    this.tradeNowService.getListOfCurrency().subscribe(success => {
      this.currecyList = success.data;
      let currencyId = this.currecyList[0].currencyId;
      if (success.data.length == 'Undefined' || success.data.length == 0) {
        this.getCurrencyList();
      }
      this.getPair(currencyId);
    }, error => {
    })
  }


  oneBtc() {
    this.order.price = this.marketPrice;
    if (this.market1BtcEth == 'Infinity') {
      this.market1BtcEth = 0;
    }
  }

  showModel(orderType, volume, price, orderId) {

    if((this.order.price * this.order.volume) < 0.0001) {
      this.buySellModel.hide();
      this.toastrService.error("Order value should be 0.0001", 'Error!');
      return;
    }
    /*if(volume < 0.0001) {
      this.toastrService.error("You can't create order with less than 0.0001 volume!", 'Success!');
      return;
    }
    if(price < 0.0001) {
      this.toastrService.error("You can't create order with less than 0.0001 price!", 'Error!');
      return;
    }*/
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
  }

  hideModel() {
    this.buySellModel.hide();
  }

  createFiatOrder() {
    if(this.order.volume < 1) {
      this.buySellModel.hide();
      this.toastrService.error("You can't create order with less than 1.0 volume!", 'Error!');
      return;
    }
    if(this.order.price < 1) {
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
      setTimeout(() => {
        this.getAllTradedOrders();
      }, 100);
      setTimeout(() => {
        this.getMyOrdersFromBook();
      }, 100);
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
      console.log(success.data)
      if (this.order.orderType == 'BUY') {
        // this.appEventEmiterService.changeMessage(JSON.stringify(success.data));
        this.router.navigate(['trading/' + success.data.orderId]);
      }
      else {
        // this.appEventEmiterService.changeMessage(JSON.stringify(success.data));
        this.router.navigate(['sell/' + success.data.orderId]);
      }
    }, error => {
      this.buySellModel.hide();
      this.order.price = '';
      this.order.volume = '';
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

  createOrder() {
   /* if(this.order.volume < 0.0001) {
      this.buySellModel.hide();
      this.toastrService.error("You can't create order with less than 0.0001 volume!", 'Error!');
      return;
    }*/
    if((this.order.price * this.order.volume) < 0.0001) {
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
      setTimeout(() => {
        this.getAllTradedOrders();
      }, 100);
      setTimeout(() => {
        this.getMyOrdersFromBook();
      }, 100);
      this.getUserBalance();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      console.log(error);
      this.buySellModel.hide();
      this.order.price = '';
      this.order.volume = '';
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })

  }

  getPair(currencyId) {
    this.loading = true;
    this.tradeNowService.getPairedCurrencies(currencyId).subscribe(success => {
      this.pairList = success.data;
      this.firstCurrencyType = this.pairList[0].toCurrency[0].currencyType;
      this.marketPrice = this.pairList[0].toCurrency[0].priceBTC;
      this.secondCurrencyType = this.pairList[0].pairedCurrency[0].currencyType;
      let pairId = this.pairList[0].pairId;
      let pairName = this.pairList[0].pairName;
      this.changePair(pairId, pairName);
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  changePair(pairId, pairName) {
    this.loading = true;
    this.pairId = pairId;
    this.pairName = pairName;
    let pairArray = pairName.split("/")
    this.firstCurrency = pairArray[0];
    this.secondCurrency = pairArray[1];
    if(this.secondCurrency == 'NGN') {
      this.secondCurrencyType = 'FIAT';
    }
    this.getUserBalance();
    this.getBuyOrderBookData(pairId);
    setTimeout(() => {
      this.getSellOrderBookData(pairId);
    }, 500);
    this.order.price = '';
    this.order.volume = '';
    this.loading = false;
  }

  getUserBalance() {
    this.depositService.getCoin(this.firstCurrencyType, this.firstCurrency).subscribe(success => {
      this.firstCurrencyBal = success.data.data.balance;
    }, error => {
      this.firstCurrencyBal = 0.0;
    })
    this.depositService.getCoin(this.secondCurrencyType, this.secondCurrency).subscribe(success => {
      if(success.data != null)
      this.secondCurrencyBal = success.data.data.balance;
    }, error => {
      this.secondCurrencyBal = 0.0;
    })
  }

  fillData(volume, price) {
    this.setTradingValue = "Limit Order";
    this.setTradeValue("Limit Order");
    this.order.volume = volume;
    this.order.price = price
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
      if(success.data != null) {
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

  changedList(orderType) {
    if (this.amount == '' || this.amount == null || this.price == null) {
      if(orderType == 'SELL') {
        this.getBuyOrderBookData(this.pairId);
      }
      else {
        this.getSellOrderBookData(this.pairId);
      }
    }
    else {
      if(this.price == '') {
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

  createAdvertisement(orderType) {
    if(this.amount < 1) {
      this.toastrService.error("You can't create order with less than 1.0 volume!", 'Error!');
      return;
    }

    if(orderType == 'BUY' && (this.amount == '' || this.price == '')){
      this.hasData = !this.hasData;
        setTimeout(() => {
      this.hasData = ! this.hasData;
    },3000);
      return ;

    }

     else if(orderType == 'SELL' && (this.amount == '' || this.price == '')){
      this.hasSellData = !this.hasSellData;
        setTimeout(() => {
      this.hasSellData = ! this.hasSellData;
    },3000);
      return ;

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
      console.log(success);
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




}
