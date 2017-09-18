import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { Login } from './entity/login';

@Injectable()
export class LoginService {
  ip: String;
  constructor(private http: Http) {
    this.getUserIpAddress().subscribe(success => {
      this.ip = success.ip;
    });
  }

  logIn(login: Login) {
    return this.http.post('/api/v1/login?ipAddress='+this.ip+'&browserName=Chrome', login,)
      .map(res => res.json());
  }

  getUserIpAddress() {
    return this.http.get('https://ipinfo.io/json')
      .map(res => res.json());
  }

}
