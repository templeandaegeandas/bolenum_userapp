import { Injectable } from '@angular/core';
import { HttpClient } from '../app.client.interceptor';
import 'rxjs/add/operator/map';

@Injectable()
export class TradeNowService {
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

  createOrder(order, pairId) {
    return this.http.post('/api/v1/user/create/order?pairId=' + pairId, order)
      .map(res => res.json());
  }

  createAdvertisment(order, pairId) {
    return this.http.post('/api/v1/user/create/order/fiat?pairId=' + pairId, order)
      .map(res => res.json());
  }

  createFiatOrder(order, pairId, orderId) {
    return this.http.put('/api/v1/user/create/order/fiat?pairId=' + pairId + "&orderId=" + orderId, order)
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

  getPairedCurrenciesByPairId(pairId) {
    return this.http.get('/api/v1/admin/currency/pair?pairId=' + pairId)
      .map(res => res.json());
  }

  getPairedCurrencies(currencyId) {
    return this.http.get('/api/v1/admin/paired/currency/list?currencyId=' + currencyId)
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

  getListFiatOrders(volume, price, orderType, pairId) {
    return this.http.get("/api/v1/user/orders?volume=" + volume + "&price=" + price + "&orderType=" + orderType + "&pairId=" + pairId)
      .map(res => res.json());
  }

  tradingFee() {
    return this.http.get("/api/v1/admin/get/trade/fees")
      .map(res => res.json());
  }

  cancelOrder(orderId) {
    return this.http.delete("/api/v1/user/cancel/order?orderId=" + orderId)
      .map(res => res.json());
  }
}
