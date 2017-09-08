import { Component } from '@angular/core';
import { UsersqueriesService } from './usersqueries.service';
import { Router } from '@angular/router';

@Component({
  selector: 'usersqueries',
  styleUrls: [('./usersqueries.scss')],
  templateUrl: './usersqueries.html',
  providers: [UsersqueriesService]
})
export class Usersqueries {

   data;
    filterQuery = "";
    rowsOnPage = 10;
    sortBy = "email";
    sortOrder = "asc";

    constructor(private service: UsersqueriesService, private router: Router) {
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
