import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { RequestOptions ,Headers } from '@angular/http';
import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class DisputeService {

  constructor(private http: HttpClient) { }

  raiseDispute(formData) {
  	 let headers = new Headers();
    	headers.delete("Content-Type");

     let options = new RequestOptions({
        headers: headers
    });

    return this.http.post("/api/v1/raise/dispute", formData , options)
      .map(res => res.json());

  }
}
