import { Injectable } from '@angular/core';
import { HttpClient } from '../app.client.interceptor';
import 'rxjs/add/operator/map';

@Injectable()
export class TradeNowService {
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

  createOrder(order) {
    return this.http.post('/api/v1/user/create/order', order)
      .map(res => res.json());
  }

  createAdvertisment(order) {
    return this.http.post('/api/v1/user/create/order/fiat', order)
      .map(res => res.json());
  }

  createFiatOrder(order, orderId) {
    return this.http.put('/api/v1/user/create/order/fiat?orderId=' + orderId, order)
      .map(res => res.json());
  }

  getListOfCurrency() {
    return this.http.get('/api/v1/admin/currency/list/market')
      .map(res => res.json());
  }

  getCurrency(currencyId) {
    return this.http.get('/api/v1/admin/currency?currencyId=' + currencyId)
      .map(res => res.json());
  }

  getTradedOrders(currentPage: number, pageSize: number, sortBy: String, sortOrder: String) {
    this.pageNumber = currentPage - 1;
    return this.http.get('/api/v1/user/get/loggedin/trade/list?pageNumber='
      + this.pageNumber + '&pageSize='
      + pageSize + '&sortBy='
      + sortBy + '&sortOrder='
      + sortOrder + '&orderType=both&date=')
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

  getMyOrdersFromBook(currentPage: number, pageSize: number, sortBy: String, sortOrder: String) {
    this.pageNumber = currentPage - 1;
    return this.http.get('/api/v1/user/get/my/orders?pageNumber='
      + this.pageNumber + '&pageSize='
      + pageSize + '&sortBy='
      + sortBy + '&sortOrder=' + sortOrder)
      .map(res => res.json());
  }

  getUserDetails() {
    return this.http.get("/api/v1/user/get/loggedin")
      .map(res => res.json());
  }

  getListFiatOrders(volume, price, orderType, marketCurrencyId, pairedCurrencyId) {
    return this.http.get("/api/v1/user/orders?volume=" + volume + "&price=" + price + "&orderType=" + orderType + "&marketCurrencyId=" + marketCurrencyId + "&pairedCurrencyId=" +pairedCurrencyId)
      .map(res => res.json());
  }

  tradingFee() {
    return this.http.get("/api/v1/admin/trade/fees")
      .map(res => res.json());
  }

  cancelOrder(orderId) {
    return this.http.delete("/api/v1/user/cancel/order?orderId=" + orderId)
      .map(res => res.json());
  }

  marketData(marketCurrencyId, pairedCurrencyId) {
    return this.http.get("/api/v1/user/order/coin/data?marketCurrencyId=" + marketCurrencyId + "&pairedCurrencyId=" + pairedCurrencyId)
      .map(res => res.json());
  }
}
