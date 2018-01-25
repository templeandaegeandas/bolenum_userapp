import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { ToastrService } from 'toastr-ng2';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Router } from '@angular/router';


@Injectable()
export class HttpClient extends Http {

// public test:any =0;

//   constructor(backend: XHRBackend, defaultOptions: RequestOptions,private router:Router , private toastrService: ToastrService, ) {
//     super(backend, defaultOptions);
//   }

//   request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

//     return super.request(url, options).catch((error: Response) => {
//         if ((error.status === 401 || error.status === 403 || error.status === 0)) {
//       this.test = this.test + 1;
// 		 localStorage.clear();
// 		 this.router.navigate(['/login']);
     
//      if(this.test==1){
//        window.setTimeout(() => {
//         this.toastrService.info('Session expired! Please login again', 'Info');
//     },1000)
      
//      }
//      else{
//      }
//    }
   
//             return Observable.throw(error);
//         });
//   }
}