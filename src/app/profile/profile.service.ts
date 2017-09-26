import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient) {

  }

  upload(formData) {

    return this.http.postWithoutContentType("/api/v1/kyc/upload", formData)
      .map(res => res.json());
  }

  getUserDetails() {
    return this.http.get("/api/v1/user/get/loggedin")
      .map(res => res.json());
  }

  locate(){
    return this.http.get("http://api.techm.co.in/api/v1/ifsc/SBIN0007119")
     .map(res => res.json());
  }
  saveUserDetails(userProfile) {
    return this.http.put("/api/v1/user/update", userProfile)
      .map(res => res.json());
  }

}
