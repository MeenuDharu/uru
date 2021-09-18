import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from '../../../_services/user.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { Location, PlatformLocation } from '@angular/common'
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
	selector: 'app-order-status',
	templateUrl: './order-status.component.html',
	styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	order_type: any = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
	userDetails: any = JSON.parse(localStorage.getItem('user_details'));
	order_number: any;
	showAwaiting: boolean = false;
	deviceData: any;
	isChrome: boolean = false;
	@HostListener('window:popstate', ['$event'])
	onPopState(event) {
		console.log('Back button pressed');
		this._location.go('/menu/categories')
	}
	constructor(public userService: UserService, private router: Router, private apiService: ApiService, location: PlatformLocation, private deviceService: DeviceDetectorService, private _location: Location) {
		// location.onPopState(() => {
		// 	this.router.navigate(['/menu/categories']);
		// });

	}

	ngOnInit() {

		this.deviceData = this.deviceService.getDeviceInfo();
		if (this.deviceData.browser === 'Chrome') {
			this.isChrome = true;
		}
		else {
			this.isChrome = false;
		}
		console.log("this.actualData........", this.deviceData);

		let orderData = {
			"order_details": {
				"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
				// "item_details": JSON.parse(localStorage.getItem('cart')),   
			}
		}

		console.log("payment status.............", localStorage.getItem('payment_status'))

		if (orderData.order_details.order_type == 'in_house') {

			if (this.userDetails) {
				if (localStorage.getItem('payment_status') == 'paid') {
					this.userService.showAwaiting = false;
					this.userService.confirmationStatus = true;
				}
				else {
					this.userService.confirmationStatus = false;
				}
				if (localStorage.getItem("viewStatus") === 'awaiting') {
					this.userService.showAwaiting = true;
					localStorage.removeItem("viewStatus");

				}
				else {
					this.userService.showAwaiting = false;
				}
				this.apiService.PLACED_ORDERS().subscribe(result => {
					// console.log("placed orders....", result);
					if (result.status) {
						if (result.orders.order_list.length) {
							this.order_number = result.orders.order_number;
							// console.log("orders found....");                    
							this.userService.placed_order_status = true;
						}
					}
				});
			} else {
				this.userService.placed_order_status = false;
			}
		} else {
			// history.pushState(null, null, location.href);
			// window.onpopstate = function () {
			//     history.go(1);
			// };      
			setTimeout(() => {
				this.router.navigate(['/home']);
			}, 3000);  //3s
		}

	}

	viewOrderItems(x) {
		if (x === 'awaiting') {
			this.userService.viewStatus = 'placed'
			//localStorage.setItem('viewStatus', 'placed')
		}
		else {
			this.userService.viewStatus = 'confirmed'
			//localStorage.setItem('viewStatus', 'confirmed')	
		}
		this.router.navigate(['/view-order'])
	}

}