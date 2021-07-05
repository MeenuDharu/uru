import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../_services/api.service';
import { UserService } from '../../_services/user.service'
import { SocketService } from '../../_services/socket.service';
import { SnackbarService } from './../../_services/snackbar.service';
import { environment } from '../../../environments/environment';
import { SwPush } from '@angular/service-worker';
import { Result } from '@zxing/library';

import { UserBrowserService } from 'src/app/_services/user-browser.service';
@Component({
	selector: 'app-myorder',
	templateUrl: './myorder.component.html',
	styleUrls: ['./myorder.component.css']
})
export class MyorderComponent implements OnInit {

	cart: any = []; loaderStatus: boolean;
	confirmed_order_list: any = [];
	myorder_history: any;
	order_id: string;
	resultString: any;
	placed_order_list: any = [];
	total_order_list: any = {
		bill_cost: 0,
		bill_cost_gst: 0,
		current_user: '',
		item_list: [],
		user_id: '',
		user_name: ''
	};
	deviceData:any;
	user_discount:any;
	live_orders: any = [];
	completed_orders: any = [];
	order_status: any;
	restaurant_details:any = JSON.parse(localStorage.getItem("restaurant_details"));
	billItems; billTotal; locationBased: boolean;
	dinamic_details: any = JSON.parse(localStorage.getItem('dinamic_details'));
	restaurant_gst: any = JSON.parse(localStorage.getItem('restaurant_details')).gst;
	total_cost :any;
	isChrome:boolean = false;
	constructor(private router: Router, private apiService: ApiService, public socketService: SocketService,
		private snackBar: SnackbarService, private swPush: SwPush, public userService: UserService, private browserService:UserBrowserService) { }

	ngOnInit() {
		// this.deviceData = this.deviceService.getDeviceInfo();
		// if(this.deviceData.browser === 'Chrome')
		// {
		// 	this.isChrome = true;
		// }
		// else
		// {
		// 	this.isChrome = false;
		// }
		this.loaderStatus = true;

		this.userService.live_orders = [];
		console.log("live orders.............", this.userService.live_orders)
		this.apiService.GET_ALL_MY_ORDERS().subscribe(result => {
		console.log("All my orders.....", result);
			if (result.orders) {
				this.loaderStatus = false;
				this.userService.live_orders = [];
				result.orders.forEach(element => {
					if (element.is_live) {
						this.userService.live_orders.push(element);						
					} else {				
						this.userService.completed_orders.push(element);
					}
				});

			}

		})

		// this.apiService.GET_MY_ORDERS().subscribe( result => {
		//   this.completed_orders = [];
		//   if(result.orders){
		//     result.orders.forEach(element => {

		//       element.total_cost_gst = Math.round(element.total_cost + element.total_cost * ());         

		//       if(element.order_status == 'completed'){
		//         this.completed_orders.push(element);
		//       }

		//     });

		//     console.log("Completed Orders", this.completed_orders);
		//   }
		// })

		//  this.apiService.GET_MY_LIVE_ORDERS().subscribe( result => {      //  console.log("My orders.....", result.orders);

		//   this.userService.live_orders = [];
		//    if(result.orders){
		//      console.log("total orders...", result.orders);
		//      this.myorder_history = result.orders;

		//     //  this.myorder_history.total_cost_gst = Math.round(this.myorder_history.total_cost + this.myorder_history.total_cost * (this.userService.restaurant_gst/100));   

		//     //  this.userService.live_orders.push( this.myorder_history);

		//     //  console.log("Live Orders", this.userService.live_orders);
		//     this.myorder_history.forEach(element => {
		//       element.tot_cost_gst_placed = 0;
		//       element.tot_cost_gst = 0;

		//       if(element.total_cost == 0){
		//         element.order_list[0].item_details.forEach(ele => {

		//           element.tot_cost_gst = element.tot_cost_gst + (ele.sold_price ? (ele.sold_price * ele.quantity) : (ele.selling_price * ele.quantity));  


		//         });

		//         element.tot_cost_gst_placed = Math.round(element.tot_cost_gst + element.tot_cost_gst * (this.userService.restaurant_gst/100));  
		//         console.log("qwerty........", element.tot_cost_gst_placed);
		//       }          

		//       element.total_cost_gst = Math.round(element.total_cost + element.total_cost * (this.userService.restaurant_gst/100));   

		//       this.userService.live_orders.push( element );


		//     });
		//    }
		//  })   
	}




	// taxcalc(ele) {
	// 	// console.log("ele........................", ele)
	// 	console.log("ele1........................", ele)
		
		
		
	// 	if(ele.order_discount && ele.order_discount.discount_type === 'amount' && ele.order_discount.discount_number)
	// 	{
	// 		this.user_discount = Number(ele.order_discount.discount_number);
	// 		ele.discount =  this.user_discount;							
	// 		console.log("user Discount***************",this.user_discount)
	// 	}
	// 	else if(ele.order_discount && ele.order_discount.discount_type === 'percentage' && ele.order_discount.discount_number)
	// 	{
	// 		this.user_discount = (Number(ele.total_cost))*(Number(ele.orders[0].order_discount.discount_number/100));
	// 		ele.discount =  this.user_discount;
			
	// 	}
	// 	else if(ele.order_discount && ele.order_discount.discount_type === 'new_value' && ele.order_discount.discount_number)
	// 	{
	// 		this.user_discount = Number(ele.total_cost- ele.order_discount.discount_number);
	// 		ele.discount =  this.user_discount;
		
	// 	}
	// 	else if(ele.order_discount &&  ele.order_discount.discount_type === 'flat')
	// 	{
	// 		this.user_discount = (Number(ele.total_cost));
	// 		ele.discount =  this.user_discount;								
	// 	}
	// 	else{
	// 		this.user_discount = 0;
	// 		ele.discount = this.user_discount;	
		
	// 	}
		
	// 	console.log("user_discount--------------------------",this.user_discount)
		
		
		
	// 			let myorderitems = ele.item_list.flat(Infinity);
		
	// 			let tax_rates = myorderitems.map((item) => {
	// 				console.log("Items111111111.......", item)
	// 				let new_tax_rates = item.tax_rates.filter((tax) => {
	// 					console.log('type of tax.value1  --------', typeof (tax.percentage))
	// 					console.log('tax.percentage1  --------', tax.percentage)
	// 					console.log('tax.checked1  --------', tax.checked)
	// 					if (tax.checked == true) {
	// 						// tax.item_price = item.sold_price * item.quantity;
	// 						// tax.item_gst_price = (item.sold_price * item.quantity) * (tax.percentage / 100);
	// 						tax.item_price = item.sold_price * item.quantity;
	// 						if(ele.discount != 0)
	// 						{
	// 							tax.discount = ((item.sold_price * item.quantity)/ele.total_cost)*ele.discount;
	// 							console.log("tax.discount4..................",ele.total_cost,'----------------------------',item.quantity, "------", item.sold_price, "------", ele.discount, '------------', tax.discount)
	// 						}
	// 						else
	// 						{
	// 							tax.discount = 0;	
	// 						}
											
	// 										tax.discount_item_price = tax.item_price - tax.discount;
	// 										//	(price of the item / total price) * discount
	// 										tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
	// 						console.log(tax)
	// 						return tax
	// 					} else {
	// 						return false
	// 					}
	// 				})
	// 				console.log('new_tax_rates**************ele', new_tax_rates)
	// 				return new_tax_rates;
	// 			})
		
		
		
	// 			let tax_rates_array = tax_rates.flat(Infinity);
	// 			let result2 = [];
	// 			tax_rates_array.reduce(function (res, value) {
	// 				console.log('value ---------', value)
	// 				if (!res[value.tax_type]) {
	// 					// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
	// 					res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
	// 					result2.push(res[value.tax_type])
	// 				}
	// 				res[value.tax_type].item_gst_price += value.item_gst_price;
	// 				return res;
	// 			}, {});
	// 			console.log('result2 ----------', result2)
	// 			this.userService.tax_details = result2;
	// 			console.log("Userservice Tax", this.userService.tax_details)
	// 			let tax_total = this.userService.tax_details.reduce((a, b) => a + b.item_gst_price, 0)
		
	// 			return tax_total;
	// 			console.log("tax_total1-----------------------------------", tax_total);
		
	// 		}

			
	viewLiveOrder(orderId) {
		this.router.navigate(['/live-order/' + orderId]);
	}
	viewCompletedOrder(orderId) {
		this.router.navigate(['/completed-order/' + orderId]);
	}
	orderStatus(x, modalName) {
		this.userService.order_status = x.order_status;
		this.userService.order_number = x.order_number
		//this.resultString = x.order_number;
		modalName.show();
	}

	reOrder(orderList) {

		console.log("order List.....", orderList);

		localStorage.setItem('cart', JSON.stringify(orderList.item_details));

		this.router.navigate(['/cart/list']);


	}

}
