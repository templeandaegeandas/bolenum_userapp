import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class DepositService {
  constructor(private http: HttpClient) { }

  
//   getStatesByCountryId(countryId) {
//     return this.http.get("/api/v1/user/states?countryId=" + countryId)
//       .map(res => res.json());
//   }

getCoin(code){
    return this.http.get("/api/v1/user/deposit?code=" + code)
    .map(res => res.json());
}

getCurrencyData(){
  return this.http.get('api/v1/admin/currency/list')
  .map(res => res.json())
}


}
