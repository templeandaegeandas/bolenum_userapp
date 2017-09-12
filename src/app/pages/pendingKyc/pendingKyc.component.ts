import { Component } from '@angular/core';
import { PendingKycService } from './pendingKyc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pendingKyc',
  styleUrls: [('./pendingKyc.scss')],
  templateUrl: './pendingKyc.html',
  providers: [PendingKycService]
})
export class PendingKyc {

   data;
    filterQuery = '';
    rowsOnPage = 10;
    sortBy = 'email';
    sortOrder = 'asc';

    constructor(private service: PendingKycService, private router: Router) {
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
  navigaeToKycDeatils() {
    this.router.navigate(['/pages/kycDetails']);
  }
}
