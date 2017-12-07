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
      this.deposit = this.stomp.subscribe('/websocket/broker/listner/deposit', this.response);
      this.withdraw = this.stomp.subscribe('/websocket/broker/listner/withdraw', this.response);
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
    })
  }

  disconnect() {
    this.stomp.disconnect().then(() => {
      console.log('Connection closed')
    })
  }

  response = (data) => {
    console.log(data.ORDER_CONFIRMATION)
    if (data.ORDER_CONFIRMATION == 'ORDER_CONFIRMATION') {
      console.log("in if Condidtion")
      this.router.navigate(['/sell/' + data.matchedOrderId]);
    }
    else {
      this.appEventEmiterService.changeMessage(data);
    }
  }
}
