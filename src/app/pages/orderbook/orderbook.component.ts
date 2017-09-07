import { Component } from '@angular/core';
import { OrderbookService } from './orderbook.service';


@Component({
  selector: 'orderbook',
  styleUrls: [('./orderbook.scss')],
  templateUrl: './orderbook.html',
  providers: [OrderbookService]
})
export class Orderbook {

   data;
    filterQuery = "";
    rowsOnPage = 10;
    sortBy = "email";
    sortOrder = "asc";

    constructor(private service: OrderbookService) {
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
  
}
