import { Component, OnInit, HostListener } from '@angular/core';
import { PlatformLocation } from '@angular/common'
import { IMyDpOptions } from 'mydatepicker';
import { HistoryService } from './history.service';
declare var $:any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [HistoryService]
})
export class HistoryComponent implements OnInit {
  public txLength:any;
  public hasBlur: boolean = false;
  public isLoading: boolean = false;
  public pageSize: any = 10;

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
  constructor(private historyService: HistoryService, location: PlatformLocation) {
    $(window).on('beforeunload', function() {
      window.alert("really one?");
      console.log("hello");
      return false;
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.historyService.getUserDetails().subscribe(success => {
      this.userId = success.data.userId;
      this.getTradeHistory();
    }, error => {
      console.log(error);
    })
  }

  filterList() {
    if (!this.buyOrder && this.sellOrder) {
      this.orderType = "sell";
    }
    else if (this.buyOrder && !this.sellOrder) {
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
    if (this.date == 0) {
      this.date = "";
    }
    this.getTradeHistory();
    // event properties are: event.date, event.jsdate, event.formatted and event.epoc
  }

  getTradeHistory() {
    this.isLoading = true;
    this.hasBlur = true;
    this.historyService.getTradedOrders(1, 10, "createdOn", "desc", this.orderType, this.date).subscribe(success => {
      this.isLoading = false;
      this.hasBlur = false;
      this.txList = success.data.content;
      this.txLength = this.txList.length; 
    })
  }

  getMoreDta(){
    let currentPage = 1;
    this.pageSize =this.pageSize + 10;
     this.isLoading = true;
    this.hasBlur = true;
    this.historyService.getTradedOrders(1, this.pageSize, "createdOn", "desc", this.orderType, this.date).subscribe(success => {
      this.isLoading = false;
      this.hasBlur = false;
      this.txList = success.data.content;
      this.txLength = this.txList.length; 
    })

  }
}
