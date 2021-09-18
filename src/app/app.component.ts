import { Component, OnInit, AfterViewInit, HostListener, Inject } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { UserService } from './_services/user.service';
import { Socket } from 'ngx-socket-io';
import { Location, PopStateEvent } from "@angular/common";
import { ApiService } from './_services/api.service';
import { CookieService } from 'ngx-cookie-service';
import { DOCUMENT } from '@angular/common';
declare const navigator: any;
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

	private lastPoppedUrl: string;
	private yScrollStack: number[] = [];
	cookieValue: any = [];
	orderValue: any = [];
	compareval: any;
	orders: any = [];

	// @HostListener('window:focus', ['$event'])
	// onFocus(event: FocusEvent): void {

	//    console.log("active************************") 

	// }
	// @HostListener('window:blur', ['$event'])
	//  onBlur(event: FocusEvent): void {

	//   console.log("active out************************") 

	//  }

	constructor(@Inject(DOCUMENT) private document, private router: Router, private socket: Socket, private location: Location, public apiService: ApiService, public userService: UserService, private cookieService: CookieService) {



		// 		window.addEventListener('message', e => {
		// 			console.log("Trigger2...................", e)
		// 			const input = <HTMLInputElement>document.querySelector('input[autocomplete="one-time-code"]');
		// // 			var inp = <HTMLInputElement>document.querySelector('input[type="text"]');
		// // console.log(inp.value);
		// 			if (!input) return;
		// 			const ac = new AbortController();
		// 			const form = input.closest('form');
		// 			if (form) {
		// 				console.log("Form data................");
		// 			  form.addEventListener('submit', e => {
		// 				setTimeout(() => {
		// 					ac.abort();
		// 				  }, 1 * 60 * 1000);
		// 			  });
		// 			}
		// 			navigator.credentials.get({			
		// 			  otp: { transport:['sms'] },
		// 			  signal: ac.signal
		// 			}).then(otp => {
		// 				console.log("OTP2...............................", otp)
		// 			 input.value = otp.code;

		// 			//   if (form) form.submit();
		// 			}).catch(err => {
		// 			  console.log("navigator error...............",err);
		// 			});
		// 		  });
		// this.document.addEventListener('readystatechange', e => {
		// 	if(e.target.readyState === "complete") {


		// 			console.log("Trigger2...................", e)
		// 			const input = <HTMLInputElement>document.querySelector('input[autocomplete="one-time-code"]');
		// // 			var inp = <HTMLInputElement>document.querySelector('input[type="text"]');
		// // console.log(inp.value);
		// 			if (!input) return;
		// 			const ac = new AbortController();
		// 			const form = input.closest('form');
		// 			if (form) {
		// 				console.log("Form data................");
		// 			  form.addEventListener('submit', e => {
		// 				setTimeout(() => {
		// 					ac.abort();
		// 				  }, 1 * 60 * 1000);
		// 			  });
		// 			}
		// 			navigator.credentials.get({			
		// 			  otp: { transport:['sms'] },
		// 			  signal: ac.signal
		// 			}).then(otp => {
		// 				console.log("OTP2...............................", otp)
		// 			 input.value = otp.code;

		// 			  if (form) form.submit();
		// 			}).catch(err => {
		// 			  console.log("navigator error...............",err);
		// 			});

		// 	}
		//   });



	}

	ngOnInit() {

		localStorage.getItem('restaurant_details')
		console.log('app component is called')
		//console.log("table name...............",this.apiService.tableName)
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				window.scrollTo(0, 0);
				console.log("navigation end");
				// document.querySelector("#cartarea").classList.remove("pointer-none");
				// document.querySelector("#cart-summary").classList.remove("section-fade");
			}
		});

		//   this.location.subscribe((ev:PopStateEvent) => {
		//     this.lastPoppedUrl = ev.url;
		// });
		// this.router.events.subscribe((ev:any) => {
		//     if (ev instanceof NavigationStart) {
		//         if (ev.url != this.lastPoppedUrl)
		//             this.yScrollStack.push(window.scrollY);
		//     } else if (ev instanceof NavigationEnd) {
		//         if (ev.url == this.lastPoppedUrl) {
		//             this.lastPoppedUrl = undefined;
		//             window.scrollTo(0, this.yScrollStack.pop());
		//         } else
		//             window.scrollTo(0, 0);
		//     }
		// });


		/** table check */


		let resturant_det = JSON.parse(localStorage.getItem('restaurant_details'));
		let userdetails = JSON.parse(localStorage.getItem('user_details'));
		let valet_details = JSON.parse(localStorage.getItem('valet_details'));
		// let valet_status =  localStorage.getItem("valet_staus");
		console.log("app restaurant details..............", JSON.parse(localStorage.getItem('restaurant_details')))
		let order_id = localStorage.getItem('pos_order_id');
		console.log("app valet_details app..............", valet_details);
		// if(resturant_det) {
		//   console.log('table engageduihytgyuvb');
		//   this.socket.emit("table_engaged", resturant_det.table_id);
		// }else if(order_id) {
		//   this.socket.emit("take_away", order_id);
		// }
		if (userdetails) {
			console.log("if part....................", userdetails)
			if (resturant_det.order_type === 'take_aways') {
				// if (localStorage.getItem('pos_order_id')) {
				// 	console.log("app take away...................")
				// 	this.socket.emit("take_away", order_id);
				// }
				console.log("take away");
				this.cookieValue = this.cookieService.get('socket_rooms'); // To Get Cookie
				//this.cookieValue = {"123456":"123456","TA20200630113350563":"TA20200630113350563","TA20200630113749741":"TA20200630113749741","lwXzlaHtXwmGtpqJAAMX":"lwXzlaHtXwmGtpqJAAMX"}

				console.log("cookie value...............", this.cookieValue);

				// for (let cval of Object.values(this.cookieValue)) {
				// 	console.log("cvalue................",cval);
				// 	this.compareval = cval;
				// 	let start_letter = this.compareval.includes("TA");
				// 	console.log("Start Letter Status",start_letter);
				// 	if(start_letter)
				// 	{
				// 		console.log("start letter true",  cval)
				// 		this.socket.emit("take_away", cval);
				// 	} 
				// 	else
				// 	{
				// 		console.log("start letter False", cval)
				// 	}
				//   }
				this.cookieService.delete('socket_rooms', '/', '.dinamic.io', true, 'Strict');
				order_id = localStorage.getItem('pos_order_id');
				if (localStorage.getItem('pos_order_id')) {
					this.socket.emit("take_away", order_id);
				}
				this.apiService.GET_ALL_MY_ORDERS().subscribe(result => {
					console.log("All my orders.....", result);
					if (result.orders) {
						this.userService.live_orders = [];
						this.orders = result.orders;
						let order_id = {};
						result.orders.forEach(element => {

							if (element.is_live) {
								if (localStorage.getItem('pos_order_id')) {
									if (element.order_id != localStorage.getItem('pos_order_id')) {
										this.socket.emit("take_away", element.order_id);
									}
								}
								else {
									this.socket.emit("take_away", element.order_id);
								}
								this.userService.orders.order_id = element.order_id;
								this.userService.live_orders.push(element);
							}
						});

					}

				})

				console.log("this.orders..............", this.userService.orders)

				// for(var prop in this.cookieValue) {
				// 	console.log(prop,this.cookieValue[prop]); 

				//   }

				// for(let i=0; i++; i<this.cookieValue.length)
				// {
				// 	console.log("cookie value in for Loop..............",this.cookieValue[i])
				// 	let start_letter = this.cookieValue[i].includes("TA");
				// 	if(start_letter)
				// 	{
				// 		this.socket.emit("take_away", this.cookieValue[i]);
				// 	}
				// }


			}
			else {
				this.socket.emit("table_engaged", resturant_det.table_id);
				console.log('table engaged----------------------------------------', resturant_det.table_id);
			}

			if (JSON.parse(localStorage.getItem('valet_details'))) {
				console.log("valet app ..........................", valet_details.vehicle_status);
				if (valet_details.vehicle_status) {
					console.log('join_valet.............................');
					let data = {
						"vehicle_details": {
							"branch_id": resturant_det.branch_id,
							"valet_id": valet_details.valet_id,
							"serial_number": valet_details.serial_number
						}
					}

					this.socket.emit("join_valet", data);
				}
			}


		}

		// else if(order_id) {
		//   console.log("app take away...................")
		//  //  this.socket.emit("take_away", order_id);
		// }

	}

	openModal(modal) {
		console.log("openmodal popup already existing user")
		modal.show();
	}
	closeModal(modalName) {
		modalName.hide();
		this.router.navigate(['/']);
	}

	closeModalNetwork(modalName) {
		modalName.hide();
		// this.router.navigate(['/']);
	}
	ngAfterViewInit() {
		// this.router.events.subscribe((evt) => {  
		//   window.scrollTo(0, 0);
		// });
		console.log("ngAfterViewInit")
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				window.scrollTo(0, 0);
				console.log("dfgfdh");
				if (document.body.classList.contains('customize-fade')) {
					document.querySelector("body").classList.remove("customize-fade");
					document.querySelector("#nav-fade").classList.remove("nav-fade");
				}


				// document.querySelector("#cartarea").classList.remove("pointer-none");
				// document.querySelector("#cart-summary").classList.remove("section-fade");
			}
		});
	}


	// ngAfterViewInit(){
	//   let resturant_det = JSON.parse(localStorage.getItem('restaurant_details'));
	//   let order_id = localStorage.getItem('pos_order_id'); 
	//   if(resturant_det) {
	//     this.socket.emit("table_engaged", resturant_det.table_id);
	//   }else if(order_id) {
	//     this.socket.emit("take_away", order_id);
	//   }
	// }


}