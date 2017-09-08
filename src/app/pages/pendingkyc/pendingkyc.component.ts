import { Component } from '@angular/core';
import { PendingkycService } from './pendingkyc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pendingkyc',
  styleUrls: [('./pendingkyc.scss')],
  templateUrl: './pendingkyc.html',
  providers: [PendingkycService]
})
export class Pendingkyc {

   data;
    filterQuery = "";
    rowsOnPage = 10;
    sortBy = "email";
    sortOrder = "asc";

    constructor(private service:PendingkycService, private router: Router) {
    this.service.getDataTable().then((data) => {
      this.data = data;
    });
  }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }
  navigaeToUserDeatils()
  {
    this.router.navigate(['/pages/userdetails'])
  }
}
