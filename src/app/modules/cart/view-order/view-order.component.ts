import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_services/api.service';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
@Component({
	selector: 'app-view-order',
	templateUrl: './view-order.component.html',
	styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

	loaderStatus: boolean;
	item_list: any = []; orderTotal: number;
	order_list: any = [];
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	constructor(private apiService: ApiService, private userService: UserService, private router: Router, private browserService: UserBrowserService) { }

	ngOnInit() {
		this.orderTotal = 0;
		this.loaderStatus = true;
		console.log('payment status....', this.userService.viewStatus);
		if (this.userService.viewStatus === 'confirmed') {
			console.log('confirmed orders...');
			this.apiService.CONFIRMED_ORDERS().subscribe(result => {
				console.log("confirmed orders...", result);
				this.loaderStatus = false;
				if (result.status) {
					let order_list = result.orders.order_list;
					this.order_list = result.orders;
					this.userService.total_items_count = this.order_list.total_item_count;
					this.userService.user_placed_orders = this.order_list;
					for (let i = 0; i < order_list.length; i++) {
						// if(order_list[i].current_user) {
						// push all item list
						for (let j = 0; j < order_list[i].item_list.length; j++) {
							this.item_list.push(order_list[i].item_list[j]);
							this.orderTotal = this.orderTotal + order_list[i].bill_cost;
						}
						// this.item_list = order_list[i].item_list;
						// this.orderTotal = order_list[i].bill_cost;
						console.log('items....', this.item_list);
						// }
					}
				}
				else {
					console.log('response', result);
				}
				// setTimeout(() => { this.loaderStatus = false; }, 500);
			});

		} else {


			this.apiService.PLACED_ORDERS().subscribe(result => {
				// console.log("placed orders...", result);
				this.loaderStatus = false;
				console.log('placed orders...');


				if (result.status) {
					let order_list = result.orders.order_list;
					this.order_list = result.orders;
					this.userService.total_items_count = this.order_list.total_item_count;
					this.userService.user_placed_orders = this.order_list;
					for (let i = 0; i < order_list.length; i++) {
						// if(order_list[i].current_user) {
						// push all item list
						for (let j = 0; j < order_list[i].item_list.length; j++) {
							this.item_list.push(order_list[i].item_list[j]);
							this.orderTotal = this.orderTotal + order_list[i].bill_cost;
						}
						// this.item_list = order_list[i].item_list;
						// this.orderTotal = order_list[i].bill_cost;

						console.log('items....', this.item_list);
						// }
					}
				}
				else {
					console.log('response', result);
				}
				// setTimeout(() => { this.loaderStatus = false; }, 500);
			});
		}

	}

	goBack() {
		if (this.userService.PAYMENT_STATUS() === 'paid') {
			this.router.navigate(['/home']);
		} else {
			this.router.navigate(['/order-status']);
		}
	}

}