import { Injectable } from '@angular/core';
import { HttpClient } from '../app.client.interceptor';
import 'rxjs/add/operator/map';

@Injectable()
export class BeforeLoginTradeNowService {
  pageNumber: number;
  constructor(private http: HttpClient) { }

  buyOrderBook(marketCurrencyId, pairedCurrencyId) {
    return this.http.get('/api/v1/user/get/buy/orders?marketCurrencyId=' + marketCurrencyId+ '&pairedCurrencyId='+pairedCurrencyId)
      .map(res => res.json());
  }

  sellOrderBook(marketCurrencyId, pairedCurrencyId) {
    return this.http.get('/api/v1/user/get/sell/orders?marketCurrencyId=' + marketCurrencyId+ '&pairedCurrencyId='+pairedCurrencyId)
      .map(res => res.json());
  }

  getMarketPrice(symbol) {
    return this.http.get('/api/v1/user/market/price?symbol=' + symbol)
      .map(res => res.json());
  }

  getListOfCurrency() {
    return this.http.get('/api/v1/admin/currency/list/market')
      .map(res => res.json());
  }

  getAllTradedOrders(currentPage: number, pageSize: number, sortBy: String, sortOrder: String) {
    this.pageNumber = currentPage - 1;
    return this.http.get('/api/v1/user/get/trade/list?pageNumber='
      + this.pageNumber + '&pageSize='
      + pageSize + '&sortBy='
      + sortBy + '&sortOrder=' + sortOrder)
      .map(res => res.json());
  }
}
