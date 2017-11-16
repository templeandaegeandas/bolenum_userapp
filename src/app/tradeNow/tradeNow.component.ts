import { Component, OnInit, ViewChild } from '@angular/core';
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
   public hasBlur:boolean=false;
  public isLoading:boolean=false;
  public pairData:any;
  public hasBuy:boolean = false;
  public hasSell:boolean = false;
  public myTradedListLength:any;
  public allTradedListLength:any;
  public myOrdersInBookLength:any;
  public marketTrade: boolean = true;
  public myTrade: boolean = false;
  public marketTradeColor:boolean = true;
  public myTradeColor:boolean = false;
  public beforeActiveMarket:boolean = false;
  public beforeActiveMyTrade:boolean = true;
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
          this.getAllTradedOrders();
          this.getMyOrdersFromBook();
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
    this.isLogIn();
    this.setTradingValue = "Market Order";
    this.setTradeValue("Market Order");
    //this.getMarketPrice();
    this.getCurrencyList();
    this.getAllTradedOrders();
    this.getMyOrdersFromBook();
    this.tradeNowService.getUserDetails().subscribe(success => {
      this.userId = success.data.userId;
    }, error => {
      console.log(error)
    })
  }

  getBuyOrderBookData(pairId) {
    this.tradeNowService.buyOrderBook(pairId).subscribe(success => {
      this.buyOrderList = success.data.content;
    })
  }

  getSellOrderBookData(pairId) {
    this.tradeNowService.sellOrderBook(pairId).subscribe(success => {
      this.sellOrderList = success.data.content;
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
      if(currencyId=='Undefined' || currencyId==null) {
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
    this.loading = true;
    this.order.totalVolume = this.order.volume;
    this.tradeNowService.createFiatOrder(this.order, this.pairId, this.selecedOrderId).subscribe(success => {
      this.buySellModel.hide();
      this.order.price = '';
      this.order.volume = '';
      this.ngOnInit();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      console.log(error);
      this.buySellModel.hide();
      this.order.price = '';
      this.order.volume = '';
      this.ngOnInit();
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })
  }

  createOrder() {
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
      this.ngOnInit();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      console.log(error);
      this.buySellModel.hide();
      this.order.price = '';
      this.order.volume = '';
      this.ngOnInit();
      this.loading = false;
      this.toastrService.error(error.json().message, 'Error!');
    })

  }

  getPair(currencyId) {
    this.loading = true;
    this.tradeNowService.getPairedCurrencies(currencyId).subscribe(success => {
      this.pairList = success.data;
      let firstCurrencyType = this.pairList[0].toCurrency[0].currencyType;
      this.marketPrice = this.pairList[0].toCurrency[0].priceBTC;
      let secondCurrencyType = this.pairList[0].pairedCurrency[0].currencyType;
      let pairId = this.pairList[0].pairId;
      let pairName = this.pairList[0].pairName;
      this.changePair(pairId, pairName, firstCurrencyType, secondCurrencyType);
      this.loading = false;
    }, error => {
      this.loading = false;
    })
  }

  changePair(pairId, pairName, firstCurrencyType, secondCurrencyType) {
    this.loading = true;
    this.pairId = pairId;
    this.pairName = pairName;
    let pairArray = pairName.split("/")
    this.firstCurrency = pairArray[0];
    this.secondCurrency = pairArray[1];
    this.depositService.getCoin(firstCurrencyType, this.firstCurrency).subscribe(success => {
      this.firstCurrencyBal = success.data.data.balance+" "+this.firstCurrency;
    }, error => {
      this.firstCurrencyBal = "0.0 " + this.firstCurrency;
    })
    this.depositService.getCoin(secondCurrencyType, this.secondCurrency).subscribe(success => {
      this.secondCurrencyBal = success.data.data.balance+" "+this.secondCurrency;
    }, error => {
      this.secondCurrencyBal = "0.0 " + this.secondCurrency;
    })
    this.getBuyOrderBookData(pairId);
    setTimeout(() => {
      this.getSellOrderBookData(pairId);
    }, 500);
    this.order.price = '';
    this.order.volume = '';
    this.loading = false;
  }

  fillData(volume, price) {
    this.setTradingValue = "Limit Order";
    this.setTradeValue("Limit Order");
    this.order.volume = volume;
    this.order.price = price
    this.order.orderStandard = "LIMIT"
  }

  getMyTradedOrders() {
    // this.loading = true;
    this.isLoading = true;
     this.hasBlur = true;
    this.tradeNowService.getTradedOrders(1, 10, "createdOn", "desc").subscribe(success => {
     this.isLoading = false;
     this.hasBlur = false;
      this.myTradedList = success.data.content;
      this.myTradedListLength = success.data.length;
       console.log("length of mytradeList>>>>>>>>>>>",this.myTradedList);
      console.log("length of mytradeList>>>>>>>>>>>",this.myTradedListLength);

      // this.loading = false;
    }, error => {
      console.log(error);
      // this.loading = false;
    })
  }

  getAllTradedOrders() {
     this.isLoading = true;
     this.hasBlur = true;
    this.tradeNowService.getAllTradedOrders(1, 10, "createdOn", "desc").subscribe(success => {
      this.isLoading = false;
     this.hasBlur = false;
      this.allTradedList = success.data.content;
      this.allTradedListLength = success.data.length;
    }, error => {
      console.log(error);
    })
  }

  getMyOrdersFromBook() {
     this.isLoading = true;
     this.hasBlur = true;
    this.tradeNowService.getMyOrdersFromBook(1, 10, "createdOn", "desc").subscribe(success => {
      this.isLoading = false;
     this.hasBlur = false;
      this.myOrdersInBook = success.data;
      this.myOrdersInBookLength = success.data.length;
    }, error => {
      console.log(error);
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

showBuyOrder(){
this.hasSell=false;
this.hasBuy=true;
}

showSellOrder(){
  this.hasBuy=false;
  this.hasSell=true;

}

}
