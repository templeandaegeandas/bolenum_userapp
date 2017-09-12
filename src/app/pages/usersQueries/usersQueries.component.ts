import { Component } from '@angular/core';
import { UsersQueriesService } from './usersQueries.service';
import { Router } from '@angular/router';

@Component({
  selector: 'usersQueries',
  styleUrls: [('./usersQueries.scss')],
  templateUrl: './usersQueries.html',
  providers: [UsersQueriesService]
})
export class UsersQueries {

   data;
    filterQuery = '';
    rowsOnPage = 10;
    sortBy = 'email';
    sortOrder = 'asc';

    constructor(private service: UsersQueriesService, private router: Router) {
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
  navigaeToReply()
  {
    this.router.navigate(['/pages/reply'])
  }
}
