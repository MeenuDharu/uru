import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../_services/api.service';
import { UserService } from 'src/app/_services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
@Component({
	selector: 'app-pickup',
	templateUrl: './pickup.component.html',
	styleUrls: ['./pickup.component.css']
})
export class PickupComponent implements OnInit {

	bill_details: any = {}; loaderStatus: boolean; shareAmt: number;
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	user_details: any = JSON.parse(localStorage.getItem('user_details'));
	constructor(private router: Router, private apiService: ApiService, private socket: Socket, public userService: UserService, private cookieService: CookieService) { }

	ngOnInit() {
		this.loaderStatus = true;
		this.apiService.GET_BILL().subscribe(result => {
			if (result.status) {
				let billType = result.bills.bill_type;
				let billList = result.bills.bills;
				if (billType == 'my_share') {
					let userBill = this.getUserBill(billList);
					console.log(userBill)
					if (userBill != undefined) {
						this.bill_details = { bill_type: billType, bill_amount: userBill.bill_cost, bill_amount_gst: Math.round(userBill.bill_cost + userBill.bill_cost * (this.userService.restaurant_gst / 100)) };
						// localStorage.setItem('session_status','completed');
					}
					else
						this.bill_details = { bill_type: billType, bill_amount: 0, bill_amount_gst: 0 };
				}
				else {
					this.bill_details = { bill_type: billType, bill_amount: billList[0].bill_cost, bill_amount_gst: Math.round(billList[0].bill_cost + billList[0].bill_cost * (this.userService.restaurant_gst / 100)) };
				}
			}
			else {
				console.log('response', result);
			}
			setTimeout(() => { this.loaderStatus = false; }, 500);
		});
	}

	getUserBill(billList) {
		for (let i = 0; i < billList.length; i++) {
			if (billList[i].my_order) {
				return billList[i];
			}
		}
	}

	onValet() {
		if (localStorage.getItem('application_type') == 'ios') this.router.navigate(['/valet-ios']);
		else this.router.navigate(['/valet-android']);
	}

	onHome() {
		var user_det = localStorage.getItem('user_details');
		var res_det = localStorage.getItem('restaurant_details');
		var dinamic_det = localStorage.getItem('dinamic_details');
		//this.socket.disconnect();
		let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
		if(restaurant_det.order_type === 'in_house')
		{
		this.socket.emit('leave_table', restaurant_det.table_id);
		}
		else
		{
		this.socket.emit('close_take_away',localStorage.getItem('pos_order_id'));	
		}
		localStorage.clear();
		sessionStorage.clear();
		this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');


		localStorage.setItem('user_details', user_det);
		localStorage.setItem('restaurant_details', res_det);
		this.userService.restaurant_gst = JSON.parse(localStorage.getItem('restaurant_details')).gst;
		this.userService.restuarant_taxes = JSON.parse(localStorage.getItem('restaurant_details')).restaurant_tax;
		localStorage.setItem('order_again', 'new');
		localStorage.setItem('dinamic_details', dinamic_det);

		this.router.navigate(['/']);
	};

	onExit() {
		// var user_det = localStorage.getItem('user_details');
		//this.socket.disconnect();
		let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
		if(restaurant_det.order_type === 'in_house')
		{
		this.socket.emit('leave_table', restaurant_det.table_id);
		}
		else
		{
		this.socket.emit('close_take_away',localStorage.getItem('pos_order_id'));	
		}
		localStorage.clear();
		sessionStorage.clear();
		this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');

		// localStorage.setItem('user_details',user_det);
		this.router.navigate(['/']);
	};

}
