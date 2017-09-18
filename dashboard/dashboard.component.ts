import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from './../services/main';
import {Config} from './../config/config';
import { ChatService } from './../services/socketService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MainService,ChatService],

})

export class DashboardComponent implements OnInit,OnDestroy {

	private latestTransaction:any;
	private latestBlocks:any;
	private flag:any;
	messages = [];
	  connection;
	  message;
	
    constructor(private router:Router, private mainService:MainService,private chatService:ChatService) {}
	ngOnInit() {
		this.flag = true;
		window.scroll(0, 0);
			this.getlatestBlocksapi();
			this.connection = this.chatService.getMessages().subscribe(message => {
			this.getlatestBlocksapi();
		})
		}
	
		//get Latest Block --------
		getlatestBlocksapi(){
			this.mainService.getlatestBlocks().subscribe(
				success =>{
					
					this.latestBlocks = success.object;
					this.getlatestTransactionapi();
					
				},
				error =>{
				}
			)
			
		}
		//get Latest Transaction --------
		getlatestTransactionapi(){    
			this.mainService.getlatestTransaction().subscribe(
				success =>{
					//this.flag=false;
					for(let i of success.object)
					{
						i.time = new Date(i.time * 1000)['toString']();
					}
					this.latestTransaction = success.object;
					this.flag = false;
					
				},
				
				error =>{}
			)
		}
	navigateToNewinner(data){    
		window.sessionStorage.setItem('blockcode',data.height);		
		this.router.navigate(['/dashboard/block-Detail']);
	}
	
	navigateToTransaction(data){  
		window.sessionStorage.setItem('hashcode',data.txid);
		this.router.navigate(['/transaction/transaction-Detail']);
	}

	ngOnDestroy() {
    this.connection.unsubscribe();
  }	
}
