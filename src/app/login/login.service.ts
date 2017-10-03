import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Ng2DeviceService } from 'ng2-device-detector';

import { Login } from './entity/login';

@Injectable()
export class LoginService {
  constructor(private http: Http) { }

  logIn(login: Login) {
    return this.http.post('/api/v1/login', login, )
      .map(res => res.json());
  }

  getUserIpAddress() {
    return this.http.get('https://ipinfo.io/json')
      .map(res => res.json());
  }

  verifyMail(token: String) {
    return this.http.get('/api/v1/user/verify?token=' + token)
      .map(res => res.json())
  }

  verify2FaOtp(otp, login) {
    return this.http.put('/api/v1/user/twofactor/auth/mobile/verify?otp=' + otp, login)
      .map(res => res.json())
  }

  resend2FaOtp(login) {
    return this.http.put("/api/v1/user/twofactor/auth/send/otp", login)
      .map(res => res.json());
  }

}
