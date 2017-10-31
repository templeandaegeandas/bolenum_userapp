import { Injectable } from '@angular/core';
import { HttpClient } from '../app.client.interceptor';
import 'rxjs/add/operator/map';

@Injectable()
export class TradeNowService {
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

  createOrder(order, pairId) {
    return this.http.post('/api/v1/user/create/order?pairId='+pairId, order)
      .map(res => res.json());
  }

  getListOfCurrency() {
    return this.http.get('/api/v1/admin/currency/list')
      .map(res => res.json());
  }

  getPairedCurrencies(currencyId) {
    return this.http.get('/api/v1/admin/paired/currency/list?currencyId=' + currencyId)
      .map(res => res.json());
  }
}
