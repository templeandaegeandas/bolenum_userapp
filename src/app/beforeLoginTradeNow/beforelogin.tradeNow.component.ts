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
  @ViewChild('buySellModel') public buySellModel: ModalDirective;
  public marketTrade: boolean = true;
  public myTrade: boolean = false;
  public marketTradeColor:boolean = true;
  public myTradeColor:boolean = false;
  public beforeActiveMarket:boolean = false;
  public beforeActiveMyTrade:boolean = true;
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
  userId: number;
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
    private beforeLoginTradeNowService: BeforeLoginTradeNowService,
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
          this.getAllTradedOrders();
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
    // this.setTradeValue("Market Order");
    this.getMarketPrice();
    this.getCurrencyList();
    this.getAllTradedOrders();
  }

  getBuyOrderBookData(pairId) {
    this.beforeLoginTradeNowService.buyOrderBook(pairId).subscribe(success => {
      this.buyOrderList = success.data.content;
    })
  }

  getSellOrderBookData(pairId) {
    this.beforeLoginTradeNowService.sellOrderBook(pairId).subscribe(success => {
      this.sellOrderList = success.data.content;
    })
  }

  getMarketPrice() {
    this.beforeLoginTradeNowService.getMarketPrice("ETH").subscribe(success => {
      this.marketPrice = success.data.priceBTC;
    })
  }

  getCurrencyList() {
    this.beforeLoginTradeNowService.getListOfCurrency().subscribe(success => {
      this.currecyList = success.data;
      let currencyId = this.currecyList[0].currencyId;
      this.getPair(currencyId);
    }, error => {

    })
  }


  // oneBtc() {
  //   this.order.price = this.marketPrice;
  //   if (this.market1BtcEth == 'Infinity') {
  //     this.market1BtcEth = 0;
  //   }
  // }

  // showModel(orderType) {
  //   this.buySellModel.show();
  //   this.order.orderType = orderType;
  // }

  // hideModel() {
  //   this.buySellModel.hide();
  // }

  getPair(currencyId) {
    this.loading = true;
    this.beforeLoginTradeNowService.getPairedCurrencies(currencyId).subscribe(success => {
      this.pairList = success.data;
      let firstCurrencyType = this.pairList[0].toCurrency[0].currencyType;
      let secondCurrencyType = this.pairList[0].pairedCurrency[0].currencyType;
      let pairId = this.pairList[0].pairId;
      let pairName = this.pairList[0].pairName;
      this.changePair(pairId, pairName, firstCurrencyType, secondCurrencyType);
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
    this.getBuyOrderBookData(pairId);
    setTimeout(() => {
      this.getSellOrderBookData(pairId);
    }, 500);
    this.loading = false;
  }

  // fillData(volume, price) {
  //   this.setTradingValue = "Limit Order";
  //   this.setTradeValue("Limit Order");
  //   this.order.volume = volume;
  //   this.order.price = price
  //   this.order.orderStandard = "LIMIT"
  // }

  getAllTradedOrders() {
    this.beforeLoginTradeNowService.getAllTradedOrders(1, 10, "createdOn", "desc").subscribe(success => {
      this.allTradedList = success.data.content;
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

  // setTradeValue(setData) {
  //   if (setData === "Limit Order") {
  //     this.isMarket = true;
  //   }
  //   else {
  //     this.isMarket = false;
  //
  //   }
  //   this.order.price = '';
  //   this.order.volume = '';
  //
  // }

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
    this.marketTrade = false;
    this.myTrade = true;
     this.marketTradeColor = false;
    this.myTradeColor = true;
     this.beforeActiveMarket = true;
    this.beforeActiveMyTrade = false;

  }
  // method to show table of market trade and my trade

}