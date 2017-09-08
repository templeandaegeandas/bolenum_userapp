import { Component } from '@angular/core';
import { UsersService } from './users.service';
import { Router } from '@angular/router';

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

    constructor(private service: UsersService, private router: Router) {
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
