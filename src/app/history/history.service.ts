import { Injectable } from '@angular/core';
import { HttpClient } from '../app.client.interceptor';
import 'rxjs/add/operator/map';


@Injectable()
export class HistoryService {
  pageNumber: number;
  constructor(private http: HttpClient) { }

  getTradedOrders(currentPage: number, pageSize: number, sortBy: String, sortOrder: String, orderType: String, date: any) {
    this.pageNumber = currentPage - 1;
    return this.http.get('/api/v1/user/get/loggedin/trade/list?pageNumber='
      + this.pageNumber + '&pageSize='
      + pageSize + '&sortBy='
      + sortBy + '&sortOrder='
      + sortOrder + '&orderType='
      + orderType + '&date=' + date)
      .map(res => res.json());
  }

  getUserDetails() {
    return this.http.get("/api/v1/user/get/loggedin")
      .map(res => res.json());
  }

}
