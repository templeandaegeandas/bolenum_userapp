import { Component, OnInit } from '@angular/core';
import {IMyDpOptions} from 'mydatepicker';

import { HistoryService } from './history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [HistoryService]
})
export class HistoryComponent implements OnInit {

  userId: any;
  txList: any;
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy/mmm/dd',
    width: '170px',
    editableDateField: false,
  }

    // Initialized to specific date (09.10.2018).
    public model: any = { date: { year: 2018, month: 10, day: 9 } };

  constructor(private historyService: HistoryService) { }

  ngOnInit() {
    this.historyService.getUserDetails().subscribe(success => {
      this.userId = success.data.userId;
      this.historyService.getTradedOrders(1,10,"createdOn","desc").subscribe(success => {
        this.txList = success.data.content;
      })
    }, error => {

    })
  }

}
