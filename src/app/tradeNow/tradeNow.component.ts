import { Component, OnInit } from '@angular/core';
import { TradeNowService } from './tradeNow.service';

@Component({
  selector: 'app-tradeNow',
  templateUrl: './tradeNow.component.html',
  styleUrls: ['./tradeNow.component.css'],
  providers: [TradeNowService]
})
export class TradeNowComponent implements OnInit {

buyOrderList: any;
sellOrderList: any;

  getBuyOrderBookData(pairId) {
    this.tradeNowService.orderBook(pairId, "BUY").subscribe(success => {
      this.buyOrderList = success.data.content;
      console.log(this.buyOrderList)
    })
  }

  getSellOrderBookData(pairId) {
    this.tradeNowService.orderBook(pairId, "SELL").subscribe(success => {
      this.sellOrderList = success.data.content;
      console.log(this.sellOrderList)
    })
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
    console.log("setvalue is ", setData);
    if (setData === "LimitOrder") {
      this.isMarket = true;
    }
    else {
      this.isMarket = false;

    }

  }

}
