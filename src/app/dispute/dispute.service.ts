import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class DisputeService {

  constructor(private http: HttpClient) { }

  raiseDispute(formData) {
    // return this.http.postWithoutContentType("/api/v1/raise/dispute", formData)
    //   .map(res => res.json());
  }
}
