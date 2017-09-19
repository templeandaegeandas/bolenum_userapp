import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { ResetPassword } from './entity/reset';

@Injectable()
export class ResetPasswordService {

  constructor(private http: Http) {

  }

  resetPass(token:String,resetPassword: ResetPassword) {
    return this.http.put('/api/v1/forgetpassword/verify?token='+token,resetPassword)
      .map(res => res.json());
  }

}
