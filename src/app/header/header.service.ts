import { Injectable } from '@angular/core';
import { HttpClient } from '../app.client.interceptor';
import 'rxjs/add/operator/map';

@Injectable()
export class HeaderService {
  constructor(private http: HttpClient) { }

  logOut() {
    return this.http.delete('/api/v1/logout')
      .map(res => res.json());
  }
}
