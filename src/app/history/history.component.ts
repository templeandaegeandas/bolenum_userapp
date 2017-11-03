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
  orderType: String = "both";
  buyOrder: boolean = true;
  sellOrder: boolean = true;
  date: any = "";
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy/mmm/dd',
    width: '170px',
    editableDateField: false,
  }

    // Initialized to specific date (09.10.2018).
    public model: any;

  constructor(private historyService: HistoryService) { }

  ngOnInit() {
    this.historyService.getUserDetails().subscribe(success => {
      this.userId = success.data.userId;
      this.getTradeHistory();
    }, error => {
      console.log(error);
    })
  }

  filterList() {
    if(!this.buyOrder && this.sellOrder) {
      this.orderType = "sell";
    }
    else if(this.buyOrder && !this.sellOrder) {
      this.orderType = "buy";
    }
    else {
      this.orderType = "both";
    }
    this.getTradeHistory();
  }

  onDateChanged(event) {
    console.log(event)
    console.log(event.epoc);
    console.log(event.jsdate);
    console.log(new Date(event.jsdate).getTime());
    this.date = new Date(event.jsdate).getTime();
    if(this.date == 0) {
      this.date="";
    }
    this.getTradeHistory();
        // event properties are: event.date, event.jsdate, event.formatted and event.epoc
    }

  getTradeHistory() {
    this.historyService.getTradedOrders(1,10,"createdOn","desc", this.orderType, this.date).subscribe(success => {
      this.txList = success.data.content;
    })
  }
}
