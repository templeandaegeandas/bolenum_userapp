import { Injectable } from '@angular/core';
import { HttpClient } from '../app.client.interceptor';
import 'rxjs/add/operator/map';

@Injectable()
export class TradingService {
  constructor(private http: HttpClient) { }

  orderDetails(orderId) {
    return this.http.get('/api/v1/user/order/fiat?orderType=BUY&orderId=' + orderId)
      .map(res => res.json());
  }

  confirmPay(orderId) {
    return this.http.put('/api/v1/user/order/fiat/confirm?orderId=' + orderId, '')
      .map(res => res.json());
  }

  cancelPay(orderId) {
    return this.http.put('/api/v1/user/order/fiat/cancel?orderId=' + orderId, '')
      .map(res => res.json());
  }
}
