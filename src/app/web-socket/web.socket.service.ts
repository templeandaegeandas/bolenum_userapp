import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs/Rx';
import { StompService } from 'ng2-stomp-service';
import { AppEventEmiterService } from '../app.event.emmiter.service';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class WebsocketService {

  private subscription: any;
  private openSubscription: any;
  private deposit: any;
  private withdraw: any;

  constructor(private stomp: StompService,
    private appEventEmiterService: AppEventEmiterService,
    private router: Router) {
    stomp.configure({
      host: environment.socketUrl,
      debug: true,
      queue: { 'init': false }
    });
  }

  connectForLoggedInUser(userId) {
    this.stomp.startConnect().then(() => {
      this.stomp.done('init');
      console.log('connected');

      //subscribe
      this.subscription = this.stomp.subscribe('/websocket/broker/listner/user/' + userId, this.response);
      this.openSubscription = this.stomp.subscribe('/websocket/broker/listner/order', this.response);
      this.subscription = this.stomp.subscribe('/websocket/broker/listner/market', this.response);
    })
  }

  sendMessage(receiver, messageType) {
    this.stomp.send('/websocket/app/sender/user', {
      receiver: receiver,
      messageType: messageType
    });
  }

  connectForNonLoggedInUser() {
    this.stomp.startConnect().then(() => {
      this.stomp.done('init');
      console.log('connected');

      //subscribe
      this.subscription = this.stomp.subscribe('/websocket/broker/listner/order', this.response);
      this.subscription = this.stomp.subscribe('/websocket/broker/listner/market', this.response);
    })
  }

  disconnect() {
    this.stomp.disconnect().then(() => {
      console.log('Connection closed')
    })
  }

  response = (data) => {
    console.log(data)
    if (data.CONFIRM_NOTIFICATION == 'CONFIRM_NOTIFICATION') {
      this.appEventEmiterService.changeMessage(data.CONFIRM_NOTIFICATION);
      this.router.navigate(['/sell/' + data.matchedOrderId]);
    }
    else if(data.MATCHED_NOTIFICATION == 'MATCHED_NOTIFICATION') {
      this.router.navigate(['/trading/' + data.matchedOrderId]);
    }
    else if(data.MARKET_UPDATE == 'MARKET_UPDATE') {
      this.appEventEmiterService.changeMessage(data);
    }
    else {
      this.appEventEmiterService.changeMessage(data);
    }
    this.appEventEmiterService.changeMessage('default message');
  }
}
