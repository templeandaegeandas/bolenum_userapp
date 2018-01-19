import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class FeesService {

  constructor(private http: HttpClient) { }

 
getMarketCurrencyValue(){
  return this.http.get('/api/v1/admin/trade/fees')
  .map(res => res.json());
}

getWithdrawValue(){
  return this.http.get('/api/v1/admin/withdraw/fees/list')
  .map( res => res.json());
}

 
}