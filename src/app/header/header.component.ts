import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HeaderService } from "./header.service";
import { environment } from "../../environments/environment";
import { AppEventEmiterService } from "../app.event.emmiter.service";
import { WebsocketService } from "../web-socket/web.socket.service";

@Component({
	selector: "header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.css"],
	providers: [HeaderService, WebsocketService]
})
export class HeaderComponent implements OnInit {
	public isOpen = false;
	public subMenu = false;
	public address:any;
	token: String;
	fullName: String;
	lastName: String;
	isLoading: any;
	hasBlur: any;
	public listOfUserNotification: any;
	public listOfUserNotificationLength: any;
	public beforeLogin: boolean = true;
	public afterLogin: boolean = false;
	jsonMessage: any;
	countOfUnseeNotification: any;
	arrayOfNotification: any;
	isSelected: any;

	profilePic: String = "assets/images/pic.png";
	constructor(
		private headerService: HeaderService,
		private websocketService: WebsocketService,
		private router: Router,
		private appEventEmiterService: AppEventEmiterService
	) {
		this.isLogIn();
		this.isSelected = false;
		if (this.beforeLogin) {
			websocketService.connectForNonLoggedInUser();
		}
		this.appEventEmiterService.currentMessage.subscribe(message => {
			this.jsonMessage = message;

			if (
				message == "DOCUMENT_VERIFICATION" ||
				message == "USER_NOTIFICATION" ||
				message == "DEPOSIT_NOTIFICATION" ||
				message == "PAID_NOTIFICATION" ||
				message == "DISPUTE_NOTIFICATION"
			) {
				this.getCountOfUnseeNotification();
				this.getAllUserNotifications();
				this.isSelected = false;
			}
		});
	}

	ngOnInit() {
		this.websocketService.connectForLoggedInUser(
			localStorage.getItem("userId")
		);

		this.getAllUserNotifications();
		this.getCountOfUnseeNotification();
		this.isSelected = false;
		this.appEventEmiterService.currentMessage.subscribe(message => {
			if (message == "upload") {
				setTimeout(() => {
					this.profilePic =
						environment.profilePicUrl +
						localStorage.getItem("profilePic") +
						"?decache=" +
						Math.random();
				}, 1000);
			} else if (message == "lastname") {
				setTimeout(() => {
					this.lastName = localStorage.getItem("lName");
					console.log(this.lastName);
					if (this.lastName != "undefined" && this.lastName != null) {
						this.fullName =
							localStorage.getItem("fName") +
							" " +
							localStorage.getItem("lName");
					} else {
						this.fullName = localStorage.getItem("fName");
					}
				}, 1000);
			}
		});
		if (localStorage.getItem("profilePic") != null) {
			this.profilePic =
				environment.profilePicUrl +
				localStorage.getItem("profilePic") +
				"?decache=" +
				Math.random();
		}
		this.token = localStorage.getItem("token");
		this.lastName = localStorage.getItem("lName");
		if (this.lastName) {
			this.fullName =
				localStorage.getItem("fName") +
				" " +
				localStorage.getItem("lName");
		} else {
			this.fullName = localStorage.getItem("fName");
		}
	}

	signOut() {
		this.headerService.logOut().subscribe(
			success => {
				this.router.navigate(["login"]);
				localStorage.clear();
				this.websocketService.disconnect();
			},
			error => {
				this.router.navigate(["login"]);
				localStorage.clear();
			}
		);
	}

	showDropdown() {
		if (!this.subMenu) {
			this.getAllUserNotifications();
		}
		this.subMenu = !this.subMenu;
	}

	getAllUserNotifications() {
		this.isLoading = true;
		this.hasBlur = true;
		this.headerService
			.GetUserNotification(1, 5, "createdOn", "desc")
			.subscribe(
				success => {
					this.isLoading = false;
					this.hasBlur = false;
					this.listOfUserNotification = success.data.content;
					console.log("List of Noyifications", this.listOfUserNotification);
					this.listOfUserNotificationLength = this.listOfUserNotification.length;
					this.changeStatusOfUserNotification();
				},
				error => {
					console.log(error);
				}
			);
	}


	/* Identify Notification Type on click of list of notifications */
        getNotificationType(notifyType,notifyId){
        			if(notifyType != "null" && notifyType=="PAID_NOTIFICATION"){
        				window.open('sell/' + notifyId ,"fullspace", "width=1024,height=700");
					}else if(notifyType != "null" && notifyType=="MATCHED_NOTIFICATION"){
						window.open('trading/' + notifyId , "fullspace", "width=1024,height=700");
        			}
			 }
	/*End Of Function Identify Notification Type */

	isLogIn() {
		if (localStorage.getItem("token") == null) {
			return;
		} else {
			this.beforeLogin = false;
			this.afterLogin = true;
		}
	}

	getCountOfUnseeNotification() {
		this.headerService.getTotalOfUnseeNotification().subscribe(success => {
			this.isLoading = false;
			this.hasBlur = false;
			this.countOfUnseeNotification = success.data;
		});
	}

	changeStatusOfUserNotification() {
		let arrayOfNotification = [];
		for (var i = 0; i < this.listOfUserNotification.length; i++) {
			arrayOfNotification[i] = this.listOfUserNotification[i].id;
		}
		this.headerService
			.changeReadStatusOfUserNotification(arrayOfNotification)
			.subscribe(success => {
				this.isLoading = false;
				this.hasBlur = false;
				this.getCountOfUnseeNotification();
				this.isSelected = true;
			});
	}
}
