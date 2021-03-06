import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { RequestOptions ,Headers } from '@angular/http';
import { HttpClient } from '../app.client.interceptor';

@Injectable()
export class ProfileService {
  constructor(private http: HttpClient) {

  }

  addMobileNumber(mobileNumber, countryCode) {
    return this.http.put("/api/v1/user/add/mobile/number?mobileNumber=" + mobileNumber + "&countryCode="+countryCode, "")
      .map(res => res.json());
  }

  verifyOtp(otp) {
    return this.http.put("/api/v1/user/verify/otp?otp=" + otp, "")
      .map(res => res.json());
  }

  resendOtp() {
    return this.http.post("/api/v1/user/resend/otp", "")
      .map(res => res.json());
  }

  upload(formData) {
     let headers = new Headers();
      headers.delete("Content-Type");

     let options = new RequestOptions({
        headers: headers
    });

    return this.http.post("/api/v1/kyc/upload" , formData , options)
      .map(res => res.json());
  }

  getUserDetails() {
    return this.http.get("/api/v1/user/get/loggedin")
      .map(res => res.json());
  }

  locate(data) {
    return this.http.get("https://api.techm.co.in/api/v1/ifsc/" + data)
      .map(res => res.json());
  }
  saveUserDetails(userProfile) {
    return this.http.put("/api/v1/user/update", userProfile)
      .map(res => res.json());
  }

  customerBankData(customerDetaisForm) {
    return this.http.post("/api/v1/user/bankdetails", customerDetaisForm)
      .map(res => res.json());
  }

  getUserBankDetails() {
    return this.http.get("/api/v1/user/bankdetails")
      .map(res => res.json());

  }
  uploadProfileImage(formData) {
     let headers = new Headers();
      headers.delete("Content-Type");

     let options = new RequestOptions({
        headers: headers
    });
    return this.http.post("/api/v1/user/upload/image", formData, options)
      .map(res => res.json());
  }

  getAllCountries() {
    return this.http.get("/api/v1/user/countries/list")
      .map(res => res.json());
  }

  getStatesByCountryId(countryId) {
    return this.http.get("/api/v1/user/states?countryId=" + countryId)
      .map(res => res.json());
  }

  generate2faQrCode() {
    return this.http.post("/api/v1/user/twofactor/auth/google/authenticator","")
      .map(res => res.json());
  }

  verify2faGoogleAuthKey(secret) {
    return this.http.put("/api/v1/user/twofactor/auth/google/authenticator/verify?secret=" + secret,"")
      .map(res => res.json());
  }

  set2faToMobile() {
    return this.http.put("/api/v1/user/twofactor/auth/mobile","")
      .map(res => res.json());
  }

  remove2Fa() {
    return this.http.delete("/api/v1/user/twofactor/auth/remove")
      .map(res => res.json());
  }

  getKycDetailUsers(){
    return this.http.get("/api/v1/user/kyc/list")
    .map(res => res.json());
  }


}
