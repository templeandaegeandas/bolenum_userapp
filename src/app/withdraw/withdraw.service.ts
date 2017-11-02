import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class WithdrawService {
  constructor(private http: HttpClient) {
}
     withdrawFromWallet(currencyType,code,withdrawBalanceForm) {
           return this.http.post("/api/v1/user/withdraw?currencyType="+currencyType+"&code="+code, withdrawBalanceForm)
           .map(res => res.json());
     }

     getCurrencyList(){

       return this.http.get("api/v1/admin/currency/list")
       .map(res => res.json())
     }

     getCoin(currencyType, code){
         return this.http.get("/api/v1/user/deposit?currencyType="+currencyType+"&code=" + code)
         .map(res => res.json());
     }

}
