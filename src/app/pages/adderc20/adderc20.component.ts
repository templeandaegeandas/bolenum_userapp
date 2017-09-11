import { Component } from '@angular/core';
import { Adderc20Service } from './adderc20.service';
import { Router } from '@angular/router';


@Component({
  selector: 'adderc20',
  styleUrls: [('./adderc20.scss')],
  templateUrl: './adderc20.html',
  providers: [Adderc20Service]
})
export class Adderc20  {

   data;
    filterQuery = "";
    rowsOnPage = 10;
    sortBy = "email";
    sortOrder = "asc";

    constructor(private service: Adderc20Service, private router: Router) {
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
