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
  pairList: any;
  order = new Order();
  pairName: any;
  firstCurrency: any;
  secondCurrency: any;
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










  constructor(private tradeNowService: TradeNowService) {
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
    this.getMarketPrice();
    this.getCurrencyList();
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

  getMarketPrice() {
    this.tradeNowService.getMarketPrice("ETH").subscribe(success => {
      this.marketPrice = success.data.priceBTC;
    })
  }

  getCurrencyList()
  {
      this.tradeNowService.getListOfCurrency().subscribe( success => {
        console.log("currency list >>>",success);
        this.currecyList = success.data;
        let currencyId = this.currecyList[0].currencyId;
        this.getPair(currencyId);
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
    this.tradeNowService.createOrder(this.order).subscribe(success => {
    }, error => {
      console.log(error)
    })
    this.order.price = '';
    this.order.volume = '';
    this.ngOnInit();
  }

  getPair(currencyId) {
    this.tradeNowService.getPairedCurrencies(currencyId).subscribe(success => {
      this.pairList = success.data;
      let pairId = this.pairList[0].pairId;
      let pairName = this.pairList[0].pairName;
      this.changePair(pairId, pairName);
    })
  }

  changePair(pairId, pairName) {
    this.pairName = pairName;
    let pairArray = pairName.split("/")
    this.firstCurrency = pairArray[0];
    this.secondCurrency = pairArray[1];
    this.getBuyOrderBookData(pairId);
    setTimeout(() => {
      this.getSellOrderBookData(pairId);
    }, 500);
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

}
