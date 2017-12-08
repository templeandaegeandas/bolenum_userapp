import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '../app.client.interceptor';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Ng2DeviceService } from 'ng2-device-detector';


@Injectable()
export class FooterService {

  constructor(private http: HttpClient) { }

  subscribeUser(email: any) {
    return this.http.post('/api/v1/user/subscribe?email=' + email, "")
      .map(res => res.json());
  }

}
