import { Component } from '@angular/core';
import { HistoricalOrderbookService } from './historicalOrderbook.service';
import { Router } from '@angular/router';


@Component({
  selector: 'historicalOrderbook',
  styleUrls: [('./historicalOrderbook.scss')],
  templateUrl: './historicalOrderbook.html',
  providers: [HistoricalOrderbookService]
})
export class HistoricalOrderbook {

   data;
    filterQuery = '';
    rowsOnPage = 10;
    sortBy = 'email';
    sortOrder = 'asc';

    constructor(private service: HistoricalOrderbookService, private router: Router) {
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
  navigaeToOrderDetails()
  {
    this.router.navigate(['/pages/orderdetails'])
  }
}
