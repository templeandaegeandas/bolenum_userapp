import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { ToastrService } from 'toastr-ng2';
import { RouterModule, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpClient  extends Http {

  constructor(backend: XHRBackend, defaultOptions: RequestOptions,private router:Router , private toastrService: ToastrService, ) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

    return super.request(url, options).catch((error: Response) => {
        if ((error.status === 401 || error.status === 403 || error.status === 0)) {
      // this.test = this.test + 1;
     localStorage.clear();
     this.router.navigate(['/login']);
     
     // if(this.test==1){
     //   window.setTimeout(() => {
        this.toastrService.info('Session expired! Please login again', 'Info');
    // },1000)
      
     // }
     // else{
     // }
   }
   
            return Observable.throw(error);
        });
  }

  // createAuthorizationHeader(headers: Headers) {
  //   if (localStorage.getItem("token")) {
  //     headers.append("Authorization", localStorage.getItem("token"));
  //   }
  // }

  // get(url) {
  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   return this.http.get(url, {
  //     headers: headers
  //   });
  // }

  // post(url, data) {
  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   return this.http.post(url, data, {
  //     headers: headers
  //   });
  // }

  postWithoutContentType(url, data) {
    let headers = new Headers();
    headers.delete("Content-Type");
    // this.createAuthorizationHeader(headers);
    // return this.http.post(url, data, {
    //   headers: headers
    // });
  }

  putWithoutContentType(url, data) {
    let headers = new Headers();
    headers.delete("Content-Type");
    // this.createAuthorizationHeader(headers);
    // return this.http.put(url, data, {
    //   headers: headers
    // });
  }

  // put(url, data) {
  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   return this.http.put(url, data, {
  //     headers: headers
  //   });
  // }

  // delete(url) {
  //   let headers = new Headers();
  //   this.createAuthorizationHeader(headers);
  //   return this.http.delete(url, {
  //     headers: headers
  //   });
  // }

}
