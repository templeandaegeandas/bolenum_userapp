import { Component, OnInit } from '@angular/core';
import { TradeNowService } from './tradeNow.service';
import { Order } from './entity/order.entity';

@Component({
  selector: 'app-tradeNow',
  templateUrl: './tradeNow.component.html',
  styleUrls: ['./tradeNow.component.css'],
  providers: [TradeNowService]
})
export class TradeNowComponent implements OnInit {

  currecyList: any;
  buyOrderList: any;
  sellOrderList: any;
  marketPrice: any;
  market1Btc: any;
  market1BtcEth: any;
  order = new Order();


  getBuyOrderBookData(pairId) {
    this.tradeNowService.buyOrderBook(pairId).subscribe(success => {
      this.buyOrderList = success.data.content;
      console.log(this.buyOrderList)
    })
  }

  getSellOrderBookData(pairId) {
    this.tradeNowService.sellOrderBook(pairId).subscribe(success => {
      this.sellOrderList = success.data.content;
      console.log(this.sellOrderList)
    })
  }

  getMarketPrice() {
    this.tradeNowService.getMarketPrice("ETH").subscribe(success => {
      this.marketPrice = success.data.priceBTC;
    })
  }

  getCurrencyList()
  {
      this.tradeNowService.getListOfCurrency().subscribe( success => {
        console.log("currency list >>>",success.data);
        this.currecyList = success.data;
        console.log("data by >>>>",  this.currecyList[0].currencyAbbreviation);

      },error =>{

      })
  }

  oneBtc() {
    this.order.price = this.order.volume / this.marketPrice;
    if (this.market1BtcEth == 'Infinity') {
      this.market1BtcEth = 0;
    }
  }

  createOrder(orderType) {
    if (this.isMarket) {
      this.order.orderStandard = 'LIMIT';
    }
    else {
      this.order.orderStandard = 'MARKET';
    }
    this.order.orderType = orderType;
    this.order.pairId = 1;
    this.order.totalVolume = this.order.volume;
    console.log(this.order)
    this.tradeNowService.createOrder(this.order).subscribe(success => {
      console.log(success);
    }, error => {
      console.log(error)
    })
    this.order.price = '';
    this.order.volume = '';
    this.getBuyOrderBookData(1);
    this.getSellOrderBookData(1);
  }

  public isMarket: boolean = true;
  public tradeValue: any[] = [
    { "valueType": "MarketOrder" },
    { "valueType": "LimitOrder" }
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
  constructor(private tradeNowService: TradeNowService) {
    this.getMarketPrice();
    this.getBuyOrderBookData(1);
    this.getSellOrderBookData(1);
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
    this.setTradingValue = "MarketOrder";
    this.setTradeValue("MarketOrder");
    this.getCurrencyList();
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

  isBtc() {
    this.btc = true;
    this.eth = false;
    this.bln = false;
    this.ngn = false;
  }

  isEth() {
    this.eth = true;
    this.btc = false;
    this.bln = false;
    this.ngn = false;
  }

  isBln() {
    this.bln = true;
    this.btc = false;
    this.eth = false;
    this.ngn = false;
  }

  isNgn() {
    this.ngn = true;
    this.btc = false;
    this.eth = false;
    this.bln = false;
  }

  setTradeValue(setData) {
    if (setData === "LimitOrder") {
      this.isMarket = true;
    }
    else {
      this.isMarket = false;

    }
    this.order.price = '';
    this.order.volume = '';

  }

}
