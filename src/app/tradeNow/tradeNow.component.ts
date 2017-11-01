import { Component, OnInit } from '@angular/core';
import { TradeNowService } from './tradeNow.service';
import { Order } from './entity/order.entity';
import { DepositService } from '../deposit/deposit.service';
import { ToastrService } from 'toastr-ng2';

@Component({
  selector: 'app-tradeNow',
  templateUrl: './tradeNow.component.html',
  styleUrls: ['./tradeNow.component.css'],
  providers: [TradeNowService, DepositService]
})
export class TradeNowComponent implements OnInit {
  public marketTrade:boolean = true;
  public myTrade:boolean = false;
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










  constructor(private tradeNowService: TradeNowService, private depositService: DepositService, private toastrService: ToastrService) {
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
    this.loading = true;
    if (this.isMarket) {
      this.order.orderStandard = 'LIMIT';
    }
    else {
      this.order.orderStandard = 'MARKET';
    }
    this.order.orderType = orderType;
    this.order.totalVolume = this.order.volume;
    this.tradeNowService.createOrder(this.order, this.pairId).subscribe(success => {
      this.order.price = '';
      this.order.volume = '';
      this.ngOnInit();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!');
    }, error => {
      console.log(error);
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
    this.depositService.getCoin(firstCurrencyType, this.firstCurrency).subscribe(success => {
      this.firstCurrencyBal = success.data.data.balance;
    }, error => {
      this.firstCurrencyBal = "0.0 " + this.firstCurrency;
    })
    this.depositService.getCoin(secondCurrencyType, this.secondCurrency).subscribe(success => {
      this.secondCurrencyBal = success.data.data.balance;
    }, error => {
      this.secondCurrencyBal = "0.0 " + this.secondCurrency;
    })
    this.getBuyOrderBookData(pairId);
    setTimeout(() => {
      this.getSellOrderBookData(pairId);
    }, 500);
    this.loading = false;
  }

  fillData(volume,price) {
    this.setTradeValue("Limit Order");
    this.order.volume = volume;
    this.order.price = price
    this.order.orderStandard = "LIMIT"
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

  marketTradeList(){
    this.marketTrade = true;
    this.myTrade = false;

  }

  myTradeList(){

    this.marketTrade = false;
    this.myTrade = true;

  }
  // method to show table of market trade and my trade

}
