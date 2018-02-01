import { Injectable, Injector } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastrService } from 'toastr-ng2';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpClient extends Http {

  constructor(backend: XHRBackend, defaultOptions: RequestOptions, private router: Router, private toastrService: ToastrService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
 
    if (typeof url === 'string') {
      if (!options) {
        options = { headers: new Headers() };
      }
      this.setHeaders(options);
    } else {
      this.setHeaders(url);
    }

    return super.request(url, options).catch(this.catchErrors());
  }

  private catchErrors() {

    return (res: Response) => {
        if (res.status === 401 || res.status === 403) {
          localStorage.clear();
            //handle authorization errors
            //in this example I am navigating to login.
            this.toastrService.info("Error_Session_Expired: redirecting to login!",'Info');
            window.location.href='#/login'
        }
        return Observable.throw(res);
    };
  }

  private setHeaders(objectToSetHeadersTo: Request | RequestOptionsArgs) {
     objectToSetHeadersTo.headers.set("Authorization", localStorage.getItem("token"));
  }
}