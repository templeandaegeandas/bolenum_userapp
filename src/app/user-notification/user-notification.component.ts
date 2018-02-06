import { Component, OnInit } from '@angular/core';
import { UserNotifyService } from "./user-notification.service";
import { log } from 'util';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.css'],
  providers:[UserNotifyService],
})
export class UserNotificationComponent implements OnInit {
  userNotify:any;

  constructor(private _UserNotifyService: UserNotifyService) { }

  ngOnInit() {

    this.getUserNotify();
  }
  getUserNotify(){
    this._UserNotifyService.getUserNotification(1, 5, "createdOn", "desc").subscribe( success=>{

      this.userNotify = success.data.content;
      console.log("dataaaaaaaaaaaa",success.data);

    },error =>{

    })
  }
}
