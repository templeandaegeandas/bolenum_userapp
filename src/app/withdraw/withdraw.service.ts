import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class WithdrawService {
  pageNumber: number;
  constructor(private http: HttpClient) {
  }
  withdrawFromWallet(currencyType, code, withdrawBalanceForm) {
    return this.http.post("/api/v1/user/withdraw?currencyType=" + currencyType + "&code=" + code, withdrawBalanceForm)
      .map(res => res.json());
  }

  getCurrencyList() {

    return this.http.get("api/v1/admin/currency/list")
      .map(res => res.json())
  }

  getCoin(currencyType, code) {
    return this.http.get("/api/v1/user/deposit?currencyType=" + currencyType + "&code=" + code)
      .map(res => res.json());
  }

  getListOfWithdrawlTransaction(currentPage: number, pageSize: number, sortBy: String, sortOrder: String) {
    this.pageNumber = currentPage - 1;
    return this.http.get('/api/v1/user/withdraw/list?pageNumber='
      + this.pageNumber + '&pageSize='
      + pageSize + '&sortBy='
      + sortBy + '&sortOrder='
      + sortOrder)
      .map(res => res.json());
  }

  withdrawFee(currencyId) {
    return this.http.get("/api/v1/admin/withdraw/fees?currencyId="+currencyId)
      .map(res => res.json());
  }

}
