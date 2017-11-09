import { Injectable } from '@angular/core';
import { HttpClient } from '../app.client.interceptor';
import 'rxjs/add/operator/map';

@Injectable()
export class BeforeLoginTradeNowService {
  pageNumber: number;
  constructor(private http: HttpClient) { }

  buyOrderBook(pairId) {
    return this.http.get('/api/v1/user/get/buy/orders?pairId=' + pairId)
      .map(res => res.json());
  }

  sellOrderBook(pairId) {
    return this.http.get('/api/v1/user/get/sell/orders?pairId=' + pairId)
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

  getPairedCurrenciesByPairId(pairId) {
    return this.http.get('/api/v1/admin/currency/pair?pairId=' + pairId)
      .map(res => res.json());
  }

  getPairedCurrencies(currencyId) {
    return this.http.get('/api/v1/admin/paired/currency/list?currencyId=' + currencyId)
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
