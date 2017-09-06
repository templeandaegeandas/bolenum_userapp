import { Component } from '@angular/core';
import { UsersService } from './users.service';


@Component({
  selector: 'users',
  styleUrls: [('./users.scss')],
  templateUrl: './users.html',
  providers: [UsersService]
})
export class Users {

   data;
    filterQuery = "";
    rowsOnPage = 10;
    sortBy = "email";
    sortOrder = "asc";

    constructor(private service: UsersService) {
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
