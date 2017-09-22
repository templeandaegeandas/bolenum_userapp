import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class ProfileService {
  constructor(private http: Http, private httpClient: HttpClient) {

  }

  upload(formData) {
    let headers = new Headers();
    headers.append("Authorization", localStorage.getItem("token"));
    headers.delete('Content-Type');
    let options = new RequestOptions({ headers: headers });

    return this.http.post("/api/v1/kyc/upload", formData, {
      headers: headers
    }).map(res => res.json());
  }

  getUserDetails() {
    return this.httpClient.get("/api/v1/user/get/loggedin")
      .map(res => res.json());
  }

}
