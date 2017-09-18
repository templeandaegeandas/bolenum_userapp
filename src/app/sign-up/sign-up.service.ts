import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { User } from './entity/user-signup';

@Injectable()
export class SignUpService {
  constructor(private http: Http) { }

  signUp(user: User) {
    return this.http.post('/api/v1/user/register', user)
      .map(res => res.json());
  }

}
