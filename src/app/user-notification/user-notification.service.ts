import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import 'rxjs/add/operator/map';

import { UserNotificationComponent } from '../user-notification/user-notification.component';

@Injectable()
export class UserNotifyService {
    pageNumber: any;
  constructor(private http: Http) { }





  getUserNotification(
    currentPage: number,
    pageSize: number,
    sortBy: String,
    sortOrder: String
  ) {
    this.pageNumber = currentPage - 1;
    return this.http
      .get(
        "/api/v1/user/notification?pageNumber=" +
          this.pageNumber +
          "&pageSize=" +
          pageSize +
          "&sortBy=" +
          sortBy +
          "&sortOrder=" +
          sortOrder
      )
      .map(res => res.json());
  }

}
