import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class DashBoardService {
    pageNumber: number;
  constructor(private http: HttpClient) { }

  getUserTradingCount()
  {
      return this.http.get('api/v1/user/trading/count')
      .map(res => res.json())
  }

}
