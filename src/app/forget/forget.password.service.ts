import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class ForgetPasswordService {

  constructor(private http: Http) {

  }

  forgetpass(email) {
    return this.http.get("/api/v1/forgetpassword?email="+email)
      .map(res => res.json());
  }


}
