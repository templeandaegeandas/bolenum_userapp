import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class DepositService {
  pageNumber: number;
  constructor(private http: HttpClient) { }

  getCoin(currencyType, code) {
    return this.http.get("/api/v1/user/deposit?currencyType=" + currencyType + "&code=" + code)
      .map(res => res.json());
  }

  getCurrencyData() {
    return this.http.get('api/v1/admin/currency/list')
      .map(res => res.json())
  }

  getListOfDepositTransaction(currentPage: number, pageSize: number, sortBy: String, sortOrder: String, coinCode: String) {
    this.pageNumber = currentPage - 1;
    return this.http.get('/api/v1/user/deposit/list?pageNumber='
      + this.pageNumber + '&pageSize='
      + pageSize + '&sortBy='
      + sortBy + '&sortOrder='
      + sortOrder + '&currencyName='
      + coinCode)
      .map(res => res.json());
  }

}
