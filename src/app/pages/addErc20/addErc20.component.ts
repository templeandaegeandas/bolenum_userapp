import { Component } from '@angular/core';
import { AddErc20Service } from './addErc20.service';
import { Router } from '@angular/router';


@Component({
  selector: 'addErc20',
  styleUrls: [('./addErc20.scss')],
  templateUrl: './addErc20.html',
  providers: [AddErc20Service]
})
export class AddErc20 {

   data;
    filterQuery = '';
    rowsOnPage = 10;
    sortBy = 'email';
    sortOrder = 'asc';

    constructor(private service: AddErc20Service, private router: Router) {
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
  navigaeToAdderDetails()
  {
    this.router.navigate(['/pages/adderdetails'])
  }
}
