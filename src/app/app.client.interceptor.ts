import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { ToastrService } from 'toastr-ng2';
import { RouterModule, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class HttpClient  extends Http {

  constructor(backend: XHRBackend, defaultOptions: RequestOptions,private router:Router , private toastrService: ToastrService, ) 
  {
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

    return super.request(url, options).catch((error: Response) => {
        if ((error.status === 401 || error.status === 403 || error.status === 0)) {
          localStorage.clear();
          this.router.navigate(['/login']);
          this.toastrService.info('Session expired! Please login again', 'Info');
        }
          return Observable.throw(error);
        });
  }

      private setHeaders(objectToSetHeadersTo: Request | RequestOptionsArgs) {
        objectToSetHeadersTo.headers.set("Authorization", localStorage.getItem("token"));
   }


}
