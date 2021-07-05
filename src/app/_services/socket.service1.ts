import { Injectable, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { SnackbarService } from './snackbar.service';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { CookieService } from 'ngx-cookie-service';
import { getTime } from 'ngx-bootstrap/chronos/utils/date-getters';
import * as moment from 'moment'; 
@Injectable({
	providedIn: 'root'
})
export class SocketService {
	@ViewChild('openModal', { static: true }) openModal: ElementRef;
	notificationList: any = [];
	hrefval: any;
	final_cost:any = 0;
	table_total:any = 0;
	ord_status: string = 'Awaiting Confirmation...';
	// ord_status: string;
	user_discount:any;
	discount:any;
	order_bill_cost:any;
	user_name: any;
	index: any;
	my_share_bill: any = {};
	order:any;
	restaurantDetails:any = JSON.parse(localStorage.getItem('restaurant_details'));
	customer_editable_sc:any = this.restaurantDetails.customer_editable_sc;
	altered_order_list: any = [{
		'bill_cost': 0,
		'bill_cost_gst': 0,
		'current_user': false,
		'gst': "0.00",
		'item_list': [],
		'user_id': null,
		'user_name': null,
	}];
	constructor(public socket: Socket, private router: Router, public userService: UserService, public snackBar: SnackbarService, public apiService: ApiService, public commonService: CommonService, private cookieService: CookieService) {
		let self = this;
		// this.userService.SET_ORDER_STATUS(data.order_status)

        /**
             * Test
             */
		this.socket.on('update_cookie', (data) => {

			console.log('update_cookie data ---------', data);
			if (JSON.parse(localStorage.getItem('user_details'))) {
				let user_details = JSON.parse(localStorage.getItem('user_details'));
				this.apiService.ACCESS_CODE_DETAILS({ "id": 'q', "code": localStorage.getItem('access_code') }).subscribe(result => {
					console.log('api call')
					if (result.status) {
						console.log('result -------------------------', result);					
						if (result.dinamic_details.table_type == "location") {
							if (result.table_detail.session_status === 'inactive') {
								document.getElementById("sessionAlertModal").click();
								let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
								this.socket.emit('leave_table', restaurant_det.table_id);
								localStorage.clear();
								sessionStorage.clear();
								this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');
							} else {
								if (result.table_detail.session_started_at === user_details.sessionStartedAt) {
									console.log("location origin....", location.origin);
									let resturant_det = JSON.parse(localStorage.getItem('restaurant_details'));
									console.log("table Engaged Socket..........*******************")
									// this.socket.emit("table_engaged", resturant_det.table_id);
								} else {
									console.log('response idle', result);
									document.getElementById("sessionAlertModal").click();
									let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
									this.socket.emit('close_take_away',localStorage.getItem('pos_order_id'));
									localStorage.clear();
									sessionStorage.clear();
									this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');
								}

							}

						}

					} else {
						console.log('response', result);
						console.log('response idle', result);
						document.getElementById("networkAlertModal").click();
						let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
						if(restaurant_det.order_type === 'in_house')
						{
						this.socket.emit('leave_table', restaurant_det.table_id);
						}
						else
						{
						this.socket.emit('close_take_away',localStorage.getItem('pos_order_id'));	
						}
						
						// localStorage.clear();
						// sessionStorage.clear();
						this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict'); 
					}
				});
			}


			// if(JSON.parse(localStorage.getItem('restaurant_details')))
			// {
			//   let resturant_det = JSON.parse(localStorage.getItem('restaurant_details'));
			//   console.log("table Engaged..........*******************")
			//   this.socket.emit("table_engaged", resturant_det.table_id);
			// }

			

			let date = new Date();
			// date.setTime(date.getTime() + (20 * 60 * 1000));

			// let expires: number = Number(new Date(Date.now() + 86400 * 1000));
			let expires = new Date(Date.now() + 365 * 86400 * 1000) //expiry date set for 1 years of inactive session
		
			cookieService.set('socket_id', data.socket_id, expires, '/', '.dinamic.io', true, 'Strict');
			cookieService.set('socket_rooms', JSON.stringify(data.socket_rooms), expires, '/', '.dinamic.io', true, 'Strict');		
			//cookieService.set('detail_rooms', data.socket_rooms, expires, '/', '.dinamic.io', true, 'Strict');		
			document.cookie = "socket_rooms_3" + "=" + JSON.stringify(data.socket_rooms) + ";expires=" + expires + ";path='/'";
			cookieService.set('testing', 'menaka' , expires, '/', '.dinamic.io', true, 'Strict'); // ok va

			// document.cookie = "socket_id_old"+"="+ data.socket_id+";expires="+expires+";path=/";
			//   document.cookie = "socket_id"+"="+ data.socket_id+";expires="+expires+";path=/;domain='www.dinamic.io'";
			//   document.cookie = "socket_rooms_old" +"="+ JSON.stringify(data.socket_rooms)+";expires="+expires+";path=/";
			//   document.cookie = "socket_rooms" +"="+ JSON.stringify(data.socket_rooms)+";expires="+expires+";path=/;domain='www.dinamic.io'";
			//   document.cookie = "socket_rooms1" +"=" + data.socket_rooms + ";expires=" + expires;
			//   document.cookie = "dummy2" +"=" + "Pravin" + ";expires=" + expires;
			//   document.cookie = "test1" +"=" + "dinamic pravin" + ";expires=" + expires+";domain='www.dinamic.io'";

			//same domain cookies
			// document.cookie = "socket_id"+"="+ data.socket_id+";expires="+expires;
			// document.cookie = "socket_rooms" +"="+ JSON.stringify(data.socket_rooms)+";expires="+expires;
			// document.cookie = "socket_test_1" +"=" + "cond1" + ";expires=" + expires;

			//different domain cookie
			// document.cookie = "socket_id"+"="+ data.socket_id+";expires="+expires+";path=/;domain=.dinamic.io";
			// document.cookie = "socket_rooms" +"="+ JSON.stringify(data.socket_rooms)+";expires="+expires+";path=/;domain=.dinamic.io";
			// document.cookie = "socket_test" +"=" + "cond2" + ";expires=" + expires+";path=/;domain=.dinamic.io";

			//different domain cookie
			//  document.cookie = "socket_id_3"+"="+ data.socket_id+";expires="+expires+";path='/';domain='www.dinamic.io';sameSite:'Strict";
			//  document.cookie = "socket_rooms_3" +"="+ JSON.stringify(data.socket_rooms)+";expires="+expires+";path='/';domain='www.dinamic.io';sameSite:'Strict";
			//  document.cookie = "socket_test_3" +"=" + "cond3" + ";expires=" + expires+";path='/';domain='www.dinamic.io';sameSite:'Strict";

			//different domain cookie
			// document.cookie = "socket_id_4"+"="+ data.socket_id+";expires="+expires+";path='/';domain='www.dinamic.io';sameSite:'None";
			// document.cookie = "socket_rooms_4" +"="+ JSON.stringify(data.socket_rooms)+";expires="+expires+";path='/';domain='www.dinamic.io';sameSite:'None";
			// document.cookie = "socket_test_4" +"=" + "cond4" + ";expires=" + expires+";path='/';domain='www.dinamic.io';sameSite:'None";

			//cookies using cookieservice
			// cookieService.set('socket_id_5', data.socket_id, expires)
			// cookieService.set('socket_rooms_5', JSON.stringify(data.socket_rooms), expires);
			// cookieService.set('socket_test_5',"cond5",expires)
			// set( name: string, value: string, expires?: number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: 'Lax' | 'Strict' | 'None' ): void;

			//cookies using cookieservice differnet domain
			//  cookieService.set('socket_id_6', data.socket_id, expires, '/', 'www.dinamic.io', false, 'Lax')
			//  cookieService.set('socket_test_6',"Menaka",expires, '/', 'www.dinamic.io', false, 'Lax')
			//  cookieService.set('socket_rooms_6', JSON.stringify(data.socket_rooms), expires, '/', 'www.dinamic.io', false, 'Lax' );



		});

        /**
         * Test
         */
		this.socket.on('remove_cookie', (data) => {
			console.log('remove_cookie data ---------', data);
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
			
			this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');

		});

		this.socket.on("update_discount", (data) => {
			console.log('update_order data discount ********************* ', data);
			let userDetails = JSON.parse(localStorage.getItem('user_details'));
			this.hrefval = this.router.url;
			console.log(this.hrefval)
			if (this.hrefval === '/bill/view') {
				this.apiService.CONFIRMED_ORDERS().subscribe(result => {
					console.log("confirm orders##########", result);
					if (result.status) {
						this.altered_order_list = [{
							'bill_cost': 0,
							'bill_cost_gst': 0,
							'current_user': false,
							'gst': "0.00",
							'item_list': [],
							'user_id': null,
							'user_name': null,
						}];
						this.order =  result.orders;
						this.userService.grandTotal = result.orders.grand_total;
						this.userService.service_charge_amount = result.orders.service_charge_amount ? result.orders.service_charge_amount : 0;
						this.userService.service_charge_percentage = result.orders.service_charge_percentage ? result.orders.service_charge_percentage : 0;
						this.userService.total_cost_after_dicount = result.orders.total_cost_after_dicount ? result.orders.total_cost_after_dicount : 0;
						if(result.orders.item_discounts && result.orders.item_discounts.total_items  && result.orders.item_discounts.total_items != 0)
						{
							this.userService.item_discount = result.orders.item_discounts.total_discount
						}
						else
						{
							this.userService.item_discount = 0;
						}
	
						if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
						{
							this.userService.bill_discount = result.orders.order_discount.discount_number;
							
						}
						else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
						{
							this.userService.bill_discount = (Number(result.orders.total_cost-this.userService.item_discount))*(Number(result.orders.order_discount.discount_number/100));
							this.userService.discount_type = result.orders.order_discount.discount_type;
							this.userService.discount_number = result.orders.order_discount.discount_number+"%";
						}
						else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
						{
							this.userService.bill_discount = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
							this.userService.discount_type = result.orders.order_discount.discount_type;
							this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number));
						}
						else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
						{
	
							this.userService.bill_discount = (Number(result.orders.total_cost-this.userService.item_discount));
							this.userService.discount_type = result.orders.order_discount.discount_type;
							this.userService.discount_number = "100%";
						}
						else{
							this.userService.bill_discount = 0;
							this.userService.discount_type = "none";
							this.userService.discount_number = 0;
						}
	
						 
					  console.log("this.userService.item_discount-----------------", this.userService.item_discount)
						if(this.customer_editable_sc)
							{
								console.log("this.customer_editable_sc.............", this.customer_editable_sc)
								if(result.orders.is_applied_service_charge === true)
								{
								localStorage.setItem("service_status","true");
								this.userService.serviceStatus = true;
								console.log("this.userService.serviceStatus .............", this.userService.serviceStatus)
								}
								else
								{
									this.userService.serviceStatus = false;
									console.log("this.userService.serviceStatus false.............", this.userService.serviceStatus)
								}		
								
							}
	
	
						
						let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
						console.log("service charge..............", restaurant_details.service_charge)
						if (restaurant_details.service_charge != '0') {
							let service_charge = Number(restaurant_details.service_charge) / 100
							console.log("service charge1..............", result.orders.final_cost)
							this.final_cost = result.orders.final_cost
							this.userService.service_charge = (service_charge * result.orders.final_cost);
							console.log("service Charge...........................", this.userService.service_charge)
						}
						else {
							this.userService.service_charge = 0;
						}
						
						
	
						this.userService.order_list_bill_page = result.orders.order_list;
					
						console.log("-----------", this.userService.order_list_bill_page)
	
						let item_details_array = this.userService.order_list_bill_page.map((order,i) => {
							console.log("order.user_id------------------------", result.orders.order_discount.order_number);
							// (price of the item / total price) * discount
	
							this.order_bill_cost = Number(order.bill_cost);
							this.discount = result.orders.order_discount;
	
							this.userService.my_service_charge = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.service_charge_amount);
							console.log("my_service_charge ************ ",this.userService.my_service_charge);
	
							console.log("order_bill_cost************",order.bill_cost,"total cost......", result.orders.total_cost)
	
							if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
							{
								this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.order_discount.discount_number);
								this.userService.discount_type = result.orders.order_discount.discount_type;
								this.userService.discount_number = result.orders.order_discount.discount_number;
							}
							else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
							{
								this.user_discount = (Number(order.bill_cost))*(Number(result.orders.order_discount.discount_number/100));
								this.userService.discount_type = result.orders.order_discount.discount_type;
								this.userService.discount_number = result.orders.order_discount.discount_number+"%";
							}
							else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
							{
								this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
								this.userService.discount_type = result.orders.order_discount.discount_type;
								this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
							}
							else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
							{
	
								this.user_discount = (Number(order.bill_cost));
								this.userService.discount_type = result.orders.order_discount.discount_type;
								this.userService.discount_number = "100%";
							}
							else{
								this.user_discount = 0;
								this.userService.discount_type = "none";
								this.userService.discount_number = 0;
							}
						
						   console.log("user_discount--------------------------",this.user_discount)
						   let sub_total = order.item_list.reduce((a, b) => a + (b.selling_price*b.quantity), 0)
					       console.log("subtotal............", sub_total)
					       this.userService.order_list_bill_page[i].sub_total = sub_total;
						   this.userService.order_list_bill_page[i].user_discount = this.user_discount;
						   this.userService.order_list_bill_page[i].my_service_charge =  this.userService.my_service_charge;
							if (order.current_user) {
								console.log('myshare');
								let myorderitems = order.item_list.flat(Infinity);
								let tax_rates = myorderitems.map((item) => {
									console.log("Items.......", item)
									let new_tax_rates = item.tax_rates.filter((tax) => {
										console.log('type of tax.value  --------', typeof (tax.percentage))
										console.log('tax.percentage  --------', tax.percentage)
										console.log('tax.checked  --------', tax.checked)
										if (tax.checked == true) {
											tax.item_price = item.sold_price * item.quantity;
											tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
											console.log("tax.discount4..................", tax.discount)
											tax.discount_item_price = tax.item_price - tax.discount;
										//	(price of the item / total price) * discount
											tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
	
											// tax.item_price = item.sold_price * item.quantity;
											// tax.item_gst_price = (item.sold_price * item.quantity) * (tax.percentage / 100);
											console.log(tax)
											return tax
										} else {
											return false
										}
									})
									console.log('new_tax_rates', new_tax_rates)
									return new_tax_rates;
								})
	
								let tax_rates_array = tax_rates.flat(Infinity);
								let result2 = [];
								tax_rates_array.reduce(function (res, value) {
									console.log('value ---------', value)
									if (!res[value.tax_type]) {
										// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
										res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
										result2.push(res[value.tax_type])
									}
									res[value.tax_type].item_gst_price += value.item_gst_price;
									return res;
								}, {});
								console.log('result2 my_total ----------', result2)
	
								// console.log("Userservice Tax",this.userService.tax_details)
								this.userService.my_tax_total = result2.reduce((a, b) => a + b.item_gst_price, 0);
								console.log("my taxtotal-----------------", this.userService.my_tax_total)
								this.userService.order_list_bill_page[i].my_tax_total = this.userService.my_tax_total;
							}
							return order.item_list;
						});
	
						
	
						console.log("item array......", item_details_array)
						let all_item_list = item_details_array.flat(Infinity);
						let tax_rates = all_item_list.map((item) => {
							console.log("Items.......", item)
							let new_tax_rates = item.tax_rates.filter((tax) => {
								console.log('type of tax.value  --------', typeof (tax.percentage))
								console.log('tax.percentage  --------', tax.percentage)
								console.log('tax.checked  --------', tax.checked)
								if (tax.checked == true) {
									tax.item_price = item.sold_price * item.quantity;
									tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
									console.log("tax.discount4..................", tax.discount)
									tax.discount_item_price = tax.item_price - tax.discount;
								//	(price of the item / total price) * discount
									tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
									console.log(tax)
									return tax
								} else {
									return false
								}
							})
							console.log('new_tax_rates', new_tax_rates)
							return new_tax_rates;
						})
	
						let tax_rates_array = tax_rates.flat(Infinity);
						let result2 = [];
						tax_rates_array.reduce(function (res, value) {
							console.log('value ---------', value)
							if (!res[value.tax_type]) {
								// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
								res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
								result2.push(res[value.tax_type])
							}
							res[value.tax_type].item_gst_price += value.item_gst_price;
							return res;
						}, {});
						console.log('result2 ----------', result2)
						this.userService.tax_details = result2;
						console.log("Userservice Tax", this.userService.tax_details)	
	
						console.log("tax_total det---------------------",result2);
							this.userService.tax_total = this.userService.tax_details.reduce((a, b) => a + b.item_gst_price, 0)
							//this.userService.tax_total = result.orders.order_tax_amount;
						console.log("tax_total---------------------", parseFloat(this.userService.tax_total).toFixed(2));
						
						this.userService.order_list_bill_page.forEach((element, i) => {
							// this.altered_order_list[0].item_list.push(element.item_list[0]);  
							console.log("element-------------", element);
							let tax_newtotal = this.taxcalc(element);
							console.log("new Tax Total .....................", tax_newtotal)
							element.tax = tax_newtotal;
							console.log("Final Confirmed Array -----------------------", this.userService.order_list_bill_page)
							element.item_list.forEach(ele => {
								this.altered_order_list[0].item_list.push(ele);
							});
							console.log("final cost**********************",result.orders.final_cost);
							this.altered_order_list[0].discont = result.orders.total_cost;
							this.altered_order_list[0].user_discount = element.user_discount;
							this.altered_order_list[0].bill_cost = this.altered_order_list[0].bill_cost + element.bill_cost;						
								this.altered_order_list[0].bill_tax = this.userService.tax_total;
								this.altered_order_list[0].total_cost = result.orders.total_cost;
								this.altered_order_list[0].bill_cost_gst =  result.orders.final_cost + this.userService.tax_total;
								
					
							
							this.altered_order_list[0].current_user = true;
							this.altered_order_list[0].gst = "0.00";
	
							if (element.user_id !== null) {
								this.altered_order_list[0].user_id = element.user_id;
							}
	
	
							if (element.user_name !== null) {
								this.altered_order_list[0].user_name = element.user_name;
							}
							else {
								this.altered_order_list[0].user_name = "For Table";
							}
	
						})
	
						console.log(",,,", this.altered_order_list);
						this.userService.confirmed_orderlist_for_bills = this.altered_order_list;
						console.log("************************", this.userService.confirmed_orderlist_for_bills);
	
	
	
						this.userService.billTotal = 0;
	
						for (let i = 0; i < this.userService.order_list_bill_page.length; i++) {
							this.userService.order_list_bill_page[i].gst = ((this.userService.restaurant_gst / 100) * this.userService.order_list_bill_page[i].bill_cost).toFixed(2);
							this.userService.billTotal += this.userService.order_list_bill_page[i].bill_cost;
							this.userService.billTotal_gst = this.userService.billTotal + this.userService.tax_total;
							
							console.log(this.userService.billTotal_gst, "bill_gst .................")
	
							let itemList = this.userService.order_list_bill_page[i].item_list;
							for (let j = 0; j < itemList.length; j++) {
								this.userService.billItems += itemList[j].quantity;
							}
						}
					}
					else {
						this.userService.order_list_bill_page = [];
						console.log('response----------------------', result);
					}
					// setTimeout(() => { this.loaderStatus = false; }, 500);
				});
	}
			
		});


		// locationless updates
		this.socket.on("update_takeaway", (data) => {
			// this.temp_var = 'pravin'
			this.ord_status = 'Awaiting Confirmation...';
			console.log('update_takeaway data: ', data);
			console.log("this.userService.live_orders.......", this.userService.live_orders)
			// this.ord_status = data.order_status; 
			this.apiService.GET_ALL_MY_ORDERS().subscribe(result => {
				console.log("All my orders.....", result);
					if (result.orders) {						
						this.userService.live_orders = [];	
						this.userService.completed_orders=[];
						result.orders.forEach(element => {
							if (element.order_id === data.order_id) {
								element.order_status = data.order_status;	
								this.userService.order_status = data.order_status;					
								if(data.order_status === 'completed')
								{
									document.getElementById("orderStatuscloseModal").click();
									element.is_live = false;
									this.socket.emit("close_take_away", data.order_id);						
								}
								else if(data.order_status === 'checkout')
								{
									document.getElementById("orderStatuscloseModal").click();
									element.is_live = false;
									this.socket.emit("close_take_away", data.order_id);			
								}
								else if(data.order_status === 'deleted')
								{
									document.getElementById("orderStatuscloseModal").click();
									element.is_live = false;
									this.socket.emit("close_take_away", data.order_id);		
								}
								else
								{
									element.is_live = true;
								}				
							}

							if (element.is_live) {
								this.userService.live_orders.push(element);						
							} else {				
								this.userService.completed_orders.push(element);
							}
						});
					   console.log("this.userService.live_orders", this.userService.live_orders)
					   console.log("this.userService.completed_orders", this.userService.completed_orders)

		
					}
		
				})


			// this.userService.live_orders.map((order, index) => {
			// 	console.log(order.order_id, "--------------------", data.order_id)
			// 	if (order.order_id === data.order_id) {
			// 		this.userService.live_orders[index].order_status = data.order_status;
			// 		if(data.order_status === 'completed' || data.order_status === 'deleted')
			// 		{
			// 			this.socket.emit("close_take_away", data.order_id);						
			// 		}					
			// 	}
			// })
			console.log("Live orders Data...", this.userService.live_orders);

			if (localStorage.getItem('user_details') && localStorage.getItem("pos_order_id") && localStorage.getItem("pos_order_id") == data.order_id) {
				if (data.order_status == "confirmed") {
					// this.ord_status = "Preparing Order..."; 
					localStorage.removeItem('order_status');
					localStorage.setItem("await_settlement", "true");
				}

				// ios notification
				if (!localStorage.getItem('device_token')) {
					let audio = new Audio();
					audio.src = "../../assets/alert.mp3";
					audio.load();
					audio.play();
					if(data.order_status === 'confirmed')
					{
						this.snackBar.BILLSETTLEMENTINPROGRESS("Your order has been confirmed.","OKAY")
					}
					else if(data.order_status === 'prepared')
					{
						this.snackBar.BILLSETTLEMENTINPROGRESS("Your order is prepared and ready for pickup.","OKAY")
					}
					else if(data.order_status === 'completed')
					{
						this.snackBar.BILLSETTLEMENTINPROGRESS("Your order was delivered to you in 15mins.","OKAY")
					}
                    
				   //self.notificationList.push({ name: "Order " + data.order_status, url: null });
				}
			}
		});

		this.socket.on("update_valet", (data) => {
			console.log('valet data socket.....', data);
		
			if (data.vehicle_status == 'on_hold') {
				
					let delay = String(data.delay*60)
					localStorage.setItem("valet_delay",delay);				
				
				this.commonService.valetStatus = 'on_hold';						
				localStorage.setItem('valet_status', 'on_hold');
				// this.commonService.timerConfig = { leftTime: data.delay * 60, format: 'mm:ss', notify: 0 };
				// localStorage.setItem('timerConfig', JSON.stringify(this.commonService.timerConfig));
				localStorage.setItem('valet_delivery',data.delivery_time )
			// timer
			this.userService.vehicle.delivery_time = data.delivery_time
			let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
		   let r_date: any = moment(new Date(), 'mm : ss');			
		   let duration = d_date.diff(r_date, 'seconds');	
			this.userService.progressPerc = 100;	
			//this.commonService.timerConfig = { stopTime: this.userService.vehicle.delivery_time, format: 'mm:ss', notify: 0 };
		    localStorage.setItem('timerConfig', JSON.stringify(this.commonService.timerConfig));
			
			document.getElementById("openValetStatusOpenModal").click();
			
			}

			else if (data.vehicle_status == "confirmed") {
				this.commonService.valetStatus = 'confirmed';
				document.getElementById("openValetStatusOpenModal").click();
				// this.apiService.UPDATE_VALET_STATUS({ valet_id : this.commonService.valet_details._id, valet_status : 'confirmed' }).subscribe( result => {
				//   console.log('result.....', result);
				// })
				
				localStorage.setItem('valet_status', 'confirmed');
				this.commonService.deliveryTime = data.delivery_time;
				localStorage.setItem('valet_delivery', this.commonService.deliveryTime);
			} else if (data.vehicle_status == "re_confirmed") {
				// this.apiService.UPDATE_VALET_STATUS({ valet_id : this.commonService.valet_details._id, valet_status : 'confirmed' }).subscribe( result => {
				//   console.log('result.....', result);
				// })
				this.commonService.valetStatus = 'confirmed';
				document.getElementById("openValetStatusOpenModal").click();				
				localStorage.setItem('valet_status', 'confirmed');
				this.commonService.deliveryTime = data.delivery_time;
				localStorage.setItem('valet_delivery', this.commonService.deliveryTime);
			} else if (data.vehicle_status == "vehicle_ready") {
				// this.apiService.UPDATE_VALET_STATUS({ valet_id : this.commonService.valet_details._id, valet_status : 'vehicle_ready' }).subscribe( result => {
				//   console.log('result.....', result);
				// })
				/** Timer */
				this.commonService.valetStatus = 'vehicle_ready';			
				this.userService.vehicle.is_expired = false; 				
				this.userService.vehicle.delivery_time   =  Number(data.delivery_time);
				
				let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
				let r_date: any = moment(new Date(), 'mm : ss');			
				let duration = d_date.diff(r_date, 'seconds');	
				localStorage.setItem("valet_delay",duration)
				//this.commonService.timerConfig = { stopTime: this.userService.vehicle.delivery_time, format: 'mm:ss', notify: 0 };
					
				console.log("delay................")		
						
				this.userService.progressPerc = 100;				
				document.getElementById("openValetStatusOpenModal").click();				
				localStorage.setItem('valet_status', 'vehicle_ready');
				this.commonService.deliveryTime = data.delivery_time;
				localStorage.setItem('valet_delivery', this.commonService.deliveryTime);
				
				
				// this.commonService.timerConfig = { leftTime: seconds, format: 'mm:ss', notify: 0 };
				// localStorage.setItem('timerConfig', JSON.stringify(this.commonService.timerConfig));

				
				
				//console.log("userservice valete status.........",  this.commonService.valetStatus)
			




			} else if (data.vehicle_status == "vehicle_re_ready") {
				this.commonService.valetStatus = 'vehicle_ready';
				document.getElementById("openValetStatusOpenModal").click();
				// this.apiService.UPDATE_VALET_STATUS({ valet_id : this.commonService.valet_details._id, valet_status : 'vehicle_ready' }).subscribe( result => {
				//   console.log('result.....', result);
				// })
				
				localStorage.setItem('valet_status', 'vehicle_ready');
				this.commonService.deliveryTime = data.delivery_time;
				localStorage.setItem('valet_delivery', this.commonService.deliveryTime);
				//this.userService.getTimer(data.delivery_time,data.vehicle_status)
				var startDate = new Date();
				// Do your operations
				var endDate = new Date(this.commonService.deliveryTime);
				var seconds = (endDate.getTime() - startDate.getTime()) / 1000;

				this.commonService.timerConfig = { leftTime: seconds, format: 'mm:ss', notify: 0 };
				localStorage.setItem('timerConfig', JSON.stringify(this.commonService.timerConfig));
			} else if (data.vehicle_status == "vehicle_parked") {
			    this.commonService.valetStatus = 'vehicle_parked';
				document.getElementById("openValetStatusOpenModal").click();				
				localStorage.setItem('valet_status', 'vehicle_parked');
			} else if (data.vehicle_status == 'delivered') {
				// this.apiService.UPDATE_VALET_STATUS({ valet_id : this.commonService.valet_details._id, valet_status : 'delivered' }).subscribe( result => {
				//   console.log('result.....', result);
				// })
				this.commonService.valetStatus = 'delivered';
				document.getElementById("openValetStatusOpenModal").click();
				localStorage.removeItem('re_request');
				localStorage.removeItem('valet_details');
				localStorage.setItem('valet_status', 'delivered');
				//window.location.href = 'https://dinamic.io/about/';
			}
			
		})
		this.socket.on("message", (data) => {
			console.log('valet message data.....', data);
		})



		this.socket.on("new_user_table", (data) => {
			let userdetails = JSON.parse(localStorage.getItem('user_details'));
			console.log("new_user_table.................", data);

			if (userdetails) {
				console.log("user detail socket....", userdetails)
				if (userdetails.dinamic_user_id != data.user_id) {
					let joinedUserName = (data.username.split(' ').length) >= 2 ? data.username.split(' ')[0] : data.username;
					this.snackBar.BILLSETTLEMENTINPROGRESS(joinedUserName + '  joined the table.', 'Close');
					// self.snackBar.OPEN(data.user_name+' joined table.', 'Close');
				}
			}


		})


		this.socket.on("update_table", (data) => {
			console.log('update table---------------------------------------------------');
			console.log('update_table data: -----------------------------', data);
			console.log('order status.................', data.order_status)

			console.log("socket Data Before.................................", data.socket_data)
			if (data.socket_data) {
				console.log("socket Data.................................", data.socket_data);

				if (data.order_status == "confirmed") {
					console.log("socket data.order_status.................................", data.order_status);
					if (localStorage.getItem('user_details')) {
						if (data.has_unassigned_item) {
							this.userService.has_unassigned_item = true;
							localStorage.setItem("hastableorder", "true");

						} else {
							this.userService.has_unassigned_item = false;
							localStorage.setItem("hastableorder", "true");
						}

						let orderData = {
							"order_details": {
								"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
								// "item_details": JSON.parse(localStorage.getItem('cart')),   
							}
						}

						console.log("orderData.order_details.order_type-------------------------", orderData.order_details.order_type)

						if (orderData.order_details.order_type == 'in_house') {
							console.log("in_house----------------------------------");
							localStorage.setItem("await_settlement", "true");
							localStorage.setItem('payment_status', 'paid');
							self.userService.SET_PLACED_ORDER_STATUS();
							this.userService.showExit = false;
							//   self.snackBar.OPEN('Your order has been confirmed.', 'Close');

							self.apiService.CONFIRMED_ORDERS().subscribe(result => {
								console.log("confirm orders##########", result);
				if (result.status) {
					this.altered_order_list = [{
						'bill_cost': 0,
						'bill_cost_gst': 0,
						'current_user': false,
						'gst': "0.00",
						'item_list': [],
						'user_id': null,
						'user_name': null,
					}];
					this.order =  result.orders;
					this.userService.grandTotal = result.orders.grand_total;
					this.userService.service_charge_amount = result.orders.service_charge_amount ? result.orders.service_charge_amount : 0;
					this.userService.service_charge_percentage = result.orders.service_charge_percentage ? result.orders.service_charge_percentage : 0;
					this.userService.total_cost_after_dicount = result.orders.total_cost_after_dicount ? result.orders.total_cost_after_dicount : 0;
					if(result.orders.item_discounts && result.orders.item_discounts.total_items  && result.orders.item_discounts.total_items != 0)
					{
						this.userService.item_discount = result.orders.item_discounts.total_discount
					}
					else
					{
						this.userService.item_discount = 0;
					}

					if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
					{
						this.userService.bill_discount = result.orders.order_discount.discount_number;
						
					}
					else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
					{
						this.userService.bill_discount = (Number(result.orders.total_cost-this.userService.item_discount))*(Number(result.orders.order_discount.discount_number/100));
						this.userService.discount_type = result.orders.order_discount.discount_type;
						this.userService.discount_number = result.orders.order_discount.discount_number+"%";
					}
					else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
					{
						this.userService.bill_discount = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
						this.userService.discount_type = result.orders.order_discount.discount_type;
						this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number));
					}
					else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
					{

						this.userService.bill_discount = (Number(result.orders.total_cost-this.userService.item_discount));
						this.userService.discount_type = result.orders.order_discount.discount_type;
						this.userService.discount_number = "100%";
					}
					else{
						this.userService.bill_discount = 0;
						this.userService.discount_type = "none";
						this.userService.discount_number = 0;
					}

					 
				  console.log("this.userService.item_discount-----------------", this.userService.item_discount)
					if(this.customer_editable_sc)
						{
							console.log("this.customer_editable_sc.............", this.customer_editable_sc)
							if(result.orders.is_applied_service_charge === true)
							{
							localStorage.setItem("service_status","true");
							this.userService.serviceStatus = true;
							console.log("this.userService.serviceStatus .............", this.userService.serviceStatus)
							}
							else
							{
								this.userService.serviceStatus = false;
								console.log("this.userService.serviceStatus false.............", this.userService.serviceStatus)
							}		
							
						}


					
					let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
					console.log("service charge..............", restaurant_details.service_charge)
					if (restaurant_details.service_charge != '0') {
						let service_charge = Number(restaurant_details.service_charge) / 100
						console.log("service charge1..............", result.orders.final_cost)
						this.final_cost = result.orders.final_cost
						this.userService.service_charge = (service_charge * result.orders.final_cost);
						console.log("service Charge...........................", this.userService.service_charge)
					}
					else {
						this.userService.service_charge = 0;
					}
					
					

					this.userService.order_list_bill_page = result.orders.order_list;
				
					console.log("-----------", this.userService.order_list_bill_page)

					let item_details_array = this.userService.order_list_bill_page.map((order,i) => {
						console.log("order.user_id------------------------", result.orders.order_discount.order_number);
						// (price of the item / total price) * discount

						this.order_bill_cost = Number(order.bill_cost);
						this.discount = result.orders.order_discount;

						this.userService.my_service_charge = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.service_charge_amount);
						console.log("my_service_charge ************ ",this.userService.my_service_charge);

						console.log("order_bill_cost************",order.bill_cost,"total cost......", result.orders.total_cost)

						if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
						{
							this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.order_discount.discount_number);
							this.userService.discount_type = result.orders.order_discount.discount_type;
						    this.userService.discount_number = result.orders.order_discount.discount_number;
						}
						else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
						{
							this.user_discount = (Number(order.bill_cost))*(Number(result.orders.order_discount.discount_number/100));
							this.userService.discount_type = result.orders.order_discount.discount_type;
						    this.userService.discount_number = result.orders.order_discount.discount_number+"%";
						}
						else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
						{
							this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
							this.userService.discount_type = result.orders.order_discount.discount_type;
						    this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
						}
						else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
						{

							this.user_discount = (Number(order.bill_cost));
							this.userService.discount_type = result.orders.order_discount.discount_type;
						    this.userService.discount_number = "100%";
						}
						else{
							this.user_discount = 0;
							this.userService.discount_type = "none";
						    this.userService.discount_number = 0;
						}
					
					   console.log("user_discount--------------------------",this.user_discount)
					   let sub_total = order.item_list.reduce((a, b) => a + (b.selling_price*b.quantity), 0)
					   console.log("subtotal............", sub_total)
					   this.userService.order_list_bill_page[i].sub_total = sub_total;
					   this.userService.order_list_bill_page[i].user_discount = this.user_discount;
					   this.userService.order_list_bill_page[i].my_service_charge =  this.userService.my_service_charge;
						if (order.current_user) {
							console.log('myshare');
							let myorderitems = order.item_list.flat(Infinity);
							let tax_rates = myorderitems.map((item) => {
								console.log("Items.......", item)
								let new_tax_rates = item.tax_rates.filter((tax) => {
									console.log('type of tax.value  --------', typeof (tax.percentage))
									console.log('tax.percentage  --------', tax.percentage)
									console.log('tax.checked  --------', tax.checked)
									if (tax.checked == true) {
										tax.item_price = item.sold_price * item.quantity;
										tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
										console.log("tax.discount4..................", tax.discount)
										tax.discount_item_price = tax.item_price - tax.discount;
									//	(price of the item / total price) * discount
									    tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);

										// tax.item_price = item.sold_price * item.quantity;
										// tax.item_gst_price = (item.sold_price * item.quantity) * (tax.percentage / 100);
										console.log(tax)
										return tax
									} else {
										return false
									}
								})
								console.log('new_tax_rates', new_tax_rates)
								return new_tax_rates;
							})

							let tax_rates_array = tax_rates.flat(Infinity);
							let result2 = [];
							tax_rates_array.reduce(function (res, value) {
								console.log('value ---------', value)
								if (!res[value.tax_type]) {
									// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
									res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
									result2.push(res[value.tax_type])
								}
								res[value.tax_type].item_gst_price += value.item_gst_price;
								return res;
							}, {});
							console.log('result2 my_total ----------', result2)

							// console.log("Userservice Tax",this.userService.tax_details)
							this.userService.my_tax_total = result2.reduce((a, b) => a + b.item_gst_price, 0);
							console.log("my taxtotal-----------------", this.userService.my_tax_total)
							this.userService.order_list_bill_page[i].my_tax_total = this.userService.my_tax_total;
						}
						return order.item_list;
					});

					

					console.log("item array......", item_details_array)
					let all_item_list = item_details_array.flat(Infinity);
					let tax_rates = all_item_list.map((item) => {
						console.log("Items.......", item)
						let new_tax_rates = item.tax_rates.filter((tax) => {
							console.log('type of tax.value  --------', typeof (tax.percentage))
							console.log('tax.percentage  --------', tax.percentage)
							console.log('tax.checked  --------', tax.checked)
							if (tax.checked == true) {
								tax.item_price = item.sold_price * item.quantity;
								tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
								console.log("tax.discount4..................", tax.discount)
								tax.discount_item_price = tax.item_price - tax.discount;
							//	(price of the item / total price) * discount
								tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
								console.log(tax)
								return tax
							} else {
								return false
							}
						})
						console.log('new_tax_rates', new_tax_rates)
						return new_tax_rates;
					})

					let tax_rates_array = tax_rates.flat(Infinity);
					let result2 = [];
					tax_rates_array.reduce(function (res, value) {
						console.log('value ---------', value)
						if (!res[value.tax_type]) {
							// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
							res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
							result2.push(res[value.tax_type])
						}
						res[value.tax_type].item_gst_price += value.item_gst_price;
						return res;
					}, {});
					console.log('result2 ----------', result2)
					this.userService.tax_details = result2;
					console.log("Userservice Tax", this.userService.tax_details)	

					console.log("tax_total det---------------------",result2);
						this.userService.tax_total = this.userService.tax_details.reduce((a, b) => a + b.item_gst_price, 0)
						//this.userService.tax_total = result.orders.order_tax_amount;
					console.log("tax_total---------------------", parseFloat(this.userService.tax_total).toFixed(2));
					
					this.userService.order_list_bill_page.forEach((element, i) => {
						// this.altered_order_list[0].item_list.push(element.item_list[0]);  
						console.log("element-------------", element);
						let tax_newtotal = this.taxcalc(element);
						console.log("new Tax Total .....................", tax_newtotal)
						element.tax = tax_newtotal;
						console.log("Final Confirmed Array -----------------------", this.userService.order_list_bill_page)
						element.item_list.forEach(ele => {
							this.altered_order_list[0].item_list.push(ele);
						});
                        console.log("final cost**********************",result.orders.final_cost);
						this.altered_order_list[0].discont = result.orders.total_cost;
						this.altered_order_list[0].user_discount = element.user_discount;
						this.altered_order_list[0].bill_cost = this.altered_order_list[0].bill_cost + element.bill_cost;						
							this.altered_order_list[0].bill_tax = this.userService.tax_total;
							this.altered_order_list[0].total_cost = result.orders.total_cost;
							this.altered_order_list[0].bill_cost_gst =  result.orders.final_cost + this.userService.tax_total;
							
				
						
						this.altered_order_list[0].current_user = true;
						this.altered_order_list[0].gst = "0.00";

						if (element.user_id !== null) {
							this.altered_order_list[0].user_id = element.user_id;
						}


						if (element.user_name !== null) {
							this.altered_order_list[0].user_name = element.user_name;
						}
						else {
							this.altered_order_list[0].user_name = "For Table";
						}

					})

					console.log(",,,", this.altered_order_list);
					this.userService.confirmed_orderlist_for_bills = this.altered_order_list;
					console.log("************************", this.userService.confirmed_orderlist_for_bills);



					this.userService.billTotal = 0;

					for (let i = 0; i < this.userService.order_list_bill_page.length; i++) {
						this.userService.order_list_bill_page[i].gst = ((this.userService.restaurant_gst / 100) * this.userService.order_list_bill_page[i].bill_cost).toFixed(2);
						this.userService.billTotal += this.userService.order_list_bill_page[i].bill_cost;
						this.userService.billTotal_gst = this.userService.billTotal + this.userService.tax_total;
						
						console.log(this.userService.billTotal_gst, "bill_gst .................")

						let itemList = this.userService.order_list_bill_page[i].item_list;
						for (let j = 0; j < itemList.length; j++) {
							this.userService.billItems += itemList[j].quantity;
						}
					}
								}
								else {
									console.log('response', result);
								}
								// setTimeout(() => { this.loaderStatus = false; }, 500);
							});

						} else {
							localStorage.removeItem('order_status');
							localStorage.setItem("await_settlement", "true");
						}
					}

				}
				else if (data.socket_data == "order_placed") {
					this.apiService.PLACED_ORDERS().subscribe(result => {
						console.log("placed orders2kjbhjbjhb....", result);
						if (result.status) {
							if (result.orders.order_list.length) {
								this.userService.placed_order_status = true;
								this.userService.order_number = result.orders.order_number;
								console.log('order nuber', result.orders.order_number)
								console.log('u service orde nuber ', this.userService.order_number)
								// console.log("orders found....");              

								/** Awaiting  strip */
								let user_Status = result.orders.order_list.filter((i) => i.current_user === true);
								this.index = result.orders.order_list.findIndex(i => i.current_user === true); // 3

								if (this.index === 0) { this.index = 1; }
								else { this.index = 0; }
								let orderListLength = result.orders.order_list.length;
								console.log("index by initial..........................", orderListLength)
								if (orderListLength < 2) {
									let placedUserName = (result.orders.order_list[0].user_name.split(' ').length) >= 2 ? result.orders.order_list[0].user_name.split(' ')[0] : result.orders.order_list[0].user_name;
									console.log("if", user_Status)
									if (user_Status.length) {
										this.userService.awaitingcontent = "Placed by You.";
									}
									else {
										this.userService.awaitingcontent = "Placed by " + placedUserName + ".";
									}
								}

								else {
									let otherUserName = (result.orders.order_list[this.index].user_name.split(' ').length) >= 2 ? result.orders.order_list[this.index].user_name.split(' ')[0] : result.orders.order_list[this.index].user_name
									if (orderListLength === 2) {

										if (user_Status.length) {
											this.userService.awaitingcontent = "Placed by You and " + otherUserName + "."
										}
										else {
											this.userService.awaitingcontent = "Placed by " + otherUserName + " and " + (orderListLength - 1) + " other.";
										}
									}
									else {
										if (user_Status.length) {
											this.userService.awaitingcontent = "Placed by You and " + (orderListLength - 1) + " others.";
										}
										else {
											this.userService.awaitingcontent = "Placed by " + otherUserName + " and " + (orderListLength - 1) + " others.";
										}
									}


									console.log("Awaiting Content..........", this.userService.awaitingcontent)

								}

								/** end */



							} else {
								this.userService.placed_order_status = false;
							}
						}
					});
				}
				else if (data.socket_data == "bill_partially_paid") {
					console.log("bill_partially_paid.................")
					if (localStorage.getItem('user_details')) {
						this.apiService.GET_BILL().subscribe(result => {
							console.log("order res 1...", result);
							if (result.status != 0) {
								let billType = result.bills.bill_type;
								let billList = result.bills.bills;
								this.userService.bill_List = result.bills.bills;
								this.userService.bill_type = result.bills.bill_type;
				
								console.log("bills start..........", result)
								this.userService.order_id = result.bills._id;
								this.userService.order_number = result.bills.order_id;
								console.log("oreder number.................", this.userService.order_number)
								// this.userService.bill_type = rsult
								let userBill = this.getUserBill(billList, billType);
				
								console.log("userBill...........", userBill)
								if (this.userService.bill_List.length) {
									// this.userService.bill_type = this.userService.bill_List.bill_type
									
									
									this.userService.totalBasicBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_cost, 0); 		
									for(let i=0; i<this.userService.bill_List.length; i++)			
										{						
										// (price of the item / total price) * discount
				
										//this.userService.bill_List.bill_cost = Number(this.userService.bill_List[i].bill_cost);
										//this.discount = result.orders.order_discount;
									
										
										console.log("my_service_charge ************ ",this.userService.my_service_charge)
										this.userService.bill_List[i].service_charge_amount =  this.userService.bill_List[i].service_charge_amount ? this.userService.bill_List[i].service_charge_amount : 0 ;
										
										if(result.bills.order_discount && result.bills.order_discount.discount_type === 'amount' && result.bills.order_discount.discount_number)
										{
											this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost)/Number(this.userService.totalBasicBillCost))*Number(result.bills.order_discount.discount_number);
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
										else if(result.bills.order_discount && result.bills.order_discount.discount_type === 'percentage' && result.bills.order_discount.discount_number)
										{
											this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost))*(Number(result.bills.order_discount.discount_number/100));
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
										else if(result.bills.order_discount && result.bills.order_discount.discount_type === 'new_value' && result.bills.order_discount.discount_number)
										{
											this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost)/Number(this.userService.totalBasicBillCost))*Number(this.userService.totalBasicBillCost-result.bills.order_discount.discount_number);
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
										else if(result.bills.order_discount && result.bills.order_discount.discount_type === 'flat')
										{
											this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost));
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
										else{
											this.userService.bill_List[i].user_discount = 0;
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
				
									   console.log("user_discount--------------------------",this.userService.bill_List[i].user_discount);
				
										}					
									
										
										console.log("service_charge***************************", Number(this.userService.service_charge))
					
				
									console.log("this.userService.tax_total", this.userService.tax_total)
				
									this.userService.totalBillCost_withtax = this.userService.totalBillCost + this.userService.tax_total;
				
									this.userService.totalBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_cost_incl_tax, 0);
									this.userService.totalFinalBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_final_cost, 0);
									this.userService.billListLength = this.userService.bill_List.length;
									this.userService.itemListLength = this.userService.bill_List.reduce((a, b) => a + b.item_list.length, 0);
									if(result.bills.bill_type === 'split_equal')
									{
										this.userService.itemListLength = this.userService.itemListLength/2
									}
				
				
									let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
										console.log("service charge..............", restaurant_details.service_charge)
										if(localStorage.getItem("service_status") === "false")
										{
											this.userService.service_charge = 0;
											this.userService.my_service_charge = 0;
										}
										else
										{
											if (restaurant_details.service_charge != '0') {
												let service_charge = Number(restaurant_details.service_charge) / 100
												
												this.userService.service_charge = (service_charge * this.userService.totalFinalBillCost);
												console.log("service Charge...........................", this.userService.service_charge);
												this.userService.my_service_charge = (Number(this.userService.bill_List.bill_cost)/Number(this.userService.totalBasicBillCost))*Number(this.userService.service_charge);
											}
											else {
												this.userService.service_charge = 0;
											}
										}
				
									console.log("totalFinalBillCost...........................", this.userService.totalFinalBillCost);
									console.log("Total_billcost................", this.userService.totalBillCost_withtax);
				
									console.log("userBill.bill_status......................", userBill.bill_status);

									if (userBill.bill_status == 'billed') {
										this.userService.billConfirmText = 'Total Amount Payable is';
										if (result.bills.bill_type === "my_share") {
											this.userService.bill_type_text = 'Bill Split - My Share';
										}
										else if (result.bills.bill_type === "split_equal") {
											this.userService.bill_type_text = 'Bill Split - Go Dutch';
										}
										else if (result.bills.bill_type === "total") {
											this.userService.bill_type_text = 'Bill Split - Table Total';
										}
										else if (result.bills.bill_type === "split_by_item") {
											this.userService.bill_type_text = 'Bill Split - Split By Item';
										}
										else {
											this.userService.bill_type_text = 'Bill Split - ' + result.bills.bill_type;
										}

										this.userService.showBillAmount = false;
										this.userService.payButtonStatus = false;

									}
								
									else if (userBill.bill_status == 'confirmed') {
										this.userService.billConfirmText = 'Total Amount Payable';
										this.userService.showBillAmount = true;
										this.userService.payButtonStatus = true;
										this.userService.bill_type_text = "Bill Summary";
									}
									else if (userBill.bill_status == 'split_by_item') {
										// this.userService.billConfirmText = 'Total Amount Payable';
										this.userService.showBillAmount = false;
										this.userService.payButtonStatus = false;
										this.userService.bill_type_text = "Bill Split - Split By Item"
									}
									else {
										this.userService.billConfirmText = 'Total amount paid';
										this.userService.showBillAmount = true;
										this.userService.payButtonStatus = true;
										this.userService.bill_type_text = "Bill Summary"

									}
								}

							}

							// setTimeout(() => { this.loaderStatus = false; }, 500);
						});

					}
				}

				else if (data.socket_data == "all_bills_paid") {
					if (localStorage.getItem('user_details')) {
						//this.router.navigate(['/bill/confirm']);
						this.snackBar.OPEN('Bill settled.', 'Close');
						console.log("all_bills_paid....................")
						if (localStorage.getItem('user_details')) {
							this.userService.showValetAgain = true;
						}

						this.apiService.GET_BILL().subscribe(result => {
							console.log("order res 1...", result);
							if (result.status != 0) {

								let billType = result.bills.bill_type;
								let billList = result.bills.bills;
								this.userService.bill_List = result.bills.bills;
								this.userService.bill_type = result.bills.bill_type;
				
								console.log("bills start..........", result)
								this.userService.order_id = result.bills._id;
								this.userService.order_number = result.bills.order_id;
								console.log("oreder number.................", this.userService.order_number)
								// this.userService.bill_type = rsult
								let userBill = this.getUserBill(billList, billType);
				
								console.log("userBill...........", userBill)
								if (this.userService.bill_List.length) {
									// this.userService.bill_type = this.userService.bill_List.bill_type
									
									
									this.userService.totalBasicBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_cost, 0); 		
									for(let i=0; i<this.userService.bill_List.length; i++)			
										{						
										// (price of the item / total price) * discount
				
										//this.userService.bill_List.bill_cost = Number(this.userService.bill_List[i].bill_cost);
										//this.discount = result.orders.order_discount;
									
										
										console.log("my_service_charge ************ ",this.userService.my_service_charge)
										this.userService.bill_List[i].service_charge_amount =  this.userService.bill_List[i].service_charge_amount ? this.userService.bill_List[i].service_charge_amount : 0 ;
										
										if(result.bills.order_discount && result.bills.order_discount.discount_type === 'amount' && result.bills.order_discount.discount_number)
										{
											this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost)/Number(this.userService.totalBasicBillCost))*Number(result.bills.order_discount.discount_number);
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
										else if(result.bills.order_discount && result.bills.order_discount.discount_type === 'percentage' && result.bills.order_discount.discount_number)
										{
											this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost))*(Number(result.bills.order_discount.discount_number/100));
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
										else if(result.bills.order_discount && result.bills.order_discount.discount_type === 'new_value' && result.bills.order_discount.discount_number)
										{
											this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost)/Number(this.userService.totalBasicBillCost))*Number(this.userService.totalBasicBillCost-result.bills.order_discount.discount_number);
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
										else if(result.bills.order_discount && result.bills.order_discount.discount_type === 'flat')
										{
											this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost));
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
										else{
											this.userService.bill_List[i].user_discount = 0;
											this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
										}
				
									   console.log("user_discount--------------------------",this.userService.bill_List[i].user_discount);
				
										}					
									
										
										console.log("service_charge***************************", Number(this.userService.service_charge))
					
				
									console.log("this.userService.tax_total", this.userService.tax_total)
				
									this.userService.totalBillCost_withtax = this.userService.totalBillCost + this.userService.tax_total;
				
									this.userService.totalBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_cost_incl_tax, 0);
									this.userService.totalFinalBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_final_cost, 0);
									this.userService.billListLength = this.userService.bill_List.length;
									this.userService.itemListLength = this.userService.bill_List.reduce((a, b) => a + b.item_list.length, 0);
									if(result.bills.bill_type === 'split_equal')
									{
										this.userService.itemListLength = this.userService.itemListLength/2
									}
				
				
									let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
										console.log("service charge..............", restaurant_details.service_charge)
										if(localStorage.getItem("service_status") === "false")
										{
											this.userService.service_charge = 0;
											this.userService.my_service_charge = 0;
										}
										else
										{
											if (restaurant_details.service_charge != '0') {
												let service_charge = Number(restaurant_details.service_charge) / 100
												
												this.userService.service_charge = (service_charge * this.userService.totalFinalBillCost);
												console.log("service Charge...........................", this.userService.service_charge);
												this.userService.my_service_charge = (Number(this.userService.bill_List.bill_cost)/Number(this.userService.totalBasicBillCost))*Number(this.userService.service_charge);
											}
											else {
												this.userService.service_charge = 0;
											}
										}
				
									console.log("totalFinalBillCost...........................", this.userService.totalFinalBillCost);
									console.log("Total_billcost................", this.userService.totalBillCost_withtax);
				
									console.log("userBill.bill_status......................", userBill.bill_status);
								
										this.userService.billConfirmText = 'Total amount paid';
										this.userService.showBillAmount = true;
										this.userService.payStatusText = 'PAID';
									
								}

							}


						});					
						this.userService.payStatusText = 'PAID';
						this.userService.all_bills_paid = true;
						setTimeout(() => { window.scrollTo({ top: 700, behavior: 'smooth' }); }, 500);
						//this.userService.billConfirmText = 'You have paid';

					}
				}
				else if(data.socket_data == 'service_charge_removed')
				{
					this.userService.serviceStatus = false;
					localStorage.setItem("service_status", "false")
					this.apiService.CONFIRMED_ORDERS().subscribe(result => {
						this.userService.grandTotal = result.orders.grand_total;
						this.userService.service_charge_amount = result.orders.service_charge_amount ? result.orders.service_charge_amount : 0;
			            this.userService.service_charge_percentage = result.orders.service_charge_percentage ? result.orders.service_charge_percentage : 0;
					});
				}
				else if (data.socket_data == 'bill_requested') {
					// self.router.navigate(['/bill/confirm']);
					if (localStorage.getItem('user_details')) {
						// this.userService.showOrderNow = true;
						// this.userService.showExit = false;
						// this.snackBar.BILLSETTLEMENTINPROGRESS('Bill settlement in progress.', 'OKAY');
						// this.router.navigate(['/']);
						console.log("data.requestor_details................", data.requestor_details)
						this.userService.showBillAmount = false;
						this.router.navigate(['/bill/confirm']);
						let dinamic_user_id = JSON.parse(localStorage.getItem('user_details')).dinamic_user_id;

						if (data.requestor_details.initiated_by_customer === true) {
							if (data.requestor_details.biller_id === dinamic_user_id) {
								this.snackBar.BILLSETTLEMENTINPROGRESS('Bill raised by You.', 'Close');
							}
							else {
								this.snackBar.BILLSETTLEMENTINPROGRESS('Bill raised by ' + data.requestor_details.biller_name, 'Close');
							}

						}
						else {
							this.snackBar.BILLSETTLEMENTINPROGRESS('Bill raised by Table..', 'Close');
						}

					}

				}
				else if (data.order_status == 'placed') {
					if (localStorage.getItem('user_details')) {
						let ord_type = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
						console.log('order type.....', ord_type);
						if (ord_type == 'in_house') {
							// localStorage.setItem("await_settlement", "true");
							// localStorage.setItem('payment_status', 'paid');
							this.userService.SET_PLACED_ORDER_STATUS();

							this.userService.showExit = false;
						}
					}
				}
				else if (data.order_status == "awaiting_confirmation") {
					console.log("awaiting_confirmation.....................");
				}

				else if (data.order_status == "awaiting_payment") {
					console.log("Awaiting Payment.....")
					this.router.navigate(['bill/confirm']);
				}

				else if (data.order_status == "deleted") {
					if (localStorage.getItem('user_details')) {
						this.userService.order_list_bill_page = [];
						this.userService.showExit = true;
						this.userService.placed_order_status = false;
						this.userService.showOrderNow = false;
						this.snackBar.OPEN('Your order is deleted.', 'Close');
						this.router.navigate(['/home']);
					}

				}

				else if (data.order_status == "removed") {
					if (localStorage.getItem('user_details')) {

						if (data.has_unassigned_item) {
							this.userService.has_unassigned_item = true;
						} else {
							this.userService.has_unassigned_item = false;
						}

						self.apiService.CONFIRMED_ORDERS().subscribe(result => {
							console.log("confirm orders##########", result);
				if (result.status) {
					this.altered_order_list = [{
						'bill_cost': 0,
						'bill_cost_gst': 0,
						'current_user': false,
						'gst': "0.00",
						'item_list': [],
						'user_id': null,
						'user_name': null,
					}];
					this.order =  result.orders;
					this.userService.grandTotal = result.orders.grand_total;
					this.userService.service_charge_amount = result.orders.service_charge_amount ? result.orders.service_charge_amount : 0;
					this.userService.service_charge_percentage = result.orders.service_charge_percentage ? result.orders.service_charge_percentage : 0;
					this.userService.total_cost_after_dicount = result.orders.total_cost_after_dicount ? result.orders.total_cost_after_dicount : 0;
					if(result.orders.item_discounts && result.orders.item_discounts.total_items  && result.orders.item_discounts.total_items != 0)
					{
						this.userService.item_discount = result.orders.item_discounts.total_discount
					}
					else
					{
						this.userService.item_discount = 0;
					}

					if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
					{
						this.userService.bill_discount = result.orders.order_discount.discount_number;
						
					}
					else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
					{
						this.userService.bill_discount = (Number(result.orders.total_cost-this.userService.item_discount))*(Number(result.orders.order_discount.discount_number/100));
						this.userService.discount_type = result.orders.order_discount.discount_type;
						this.userService.discount_number = result.orders.order_discount.discount_number+"%";
					}
					else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
					{
						this.userService.bill_discount = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
						this.userService.discount_type = result.orders.order_discount.discount_type;
						this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number));
					}
					else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
					{

						this.userService.bill_discount = (Number(result.orders.total_cost-this.userService.item_discount));
						this.userService.discount_type = result.orders.order_discount.discount_type;
						this.userService.discount_number = "100%";
					}
					else{
						this.userService.bill_discount = 0;
						this.userService.discount_type = "none";
						this.userService.discount_number = 0;
					}

					 
				  console.log("this.userService.item_discount-----------------", this.userService.item_discount)
					if(this.customer_editable_sc)
						{
							console.log("this.customer_editable_sc.............", this.customer_editable_sc)
							if(result.orders.is_applied_service_charge === true)
							{
							localStorage.setItem("service_status","true");
							this.userService.serviceStatus = true;
							console.log("this.userService.serviceStatus .............", this.userService.serviceStatus)
							}
							else
							{
								this.userService.serviceStatus = false;
								console.log("this.userService.serviceStatus false.............", this.userService.serviceStatus)
							}		
							
						}


					
					let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
					console.log("service charge..............", restaurant_details.service_charge)
					if (restaurant_details.service_charge != '0') {
						let service_charge = Number(restaurant_details.service_charge) / 100
						console.log("service charge1..............", result.orders.final_cost)
						this.final_cost = result.orders.final_cost
						this.userService.service_charge = (service_charge * result.orders.final_cost);
						console.log("service Charge...........................", this.userService.service_charge)
					}
					else {
						this.userService.service_charge = 0;
					}
					
					

					this.userService.order_list_bill_page = result.orders.order_list;
				
					console.log("-----------", this.userService.order_list_bill_page)

					let item_details_array = this.userService.order_list_bill_page.map((order,i) => {
						console.log("order.user_id------------------------", result.orders.order_discount.order_number);
						// (price of the item / total price) * discount

						this.order_bill_cost = Number(order.bill_cost);
						this.discount = result.orders.order_discount;

						this.userService.my_service_charge = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.service_charge_amount);
						console.log("my_service_charge ************ ",this.userService.my_service_charge);

						console.log("order_bill_cost************",order.bill_cost,"total cost......", result.orders.total_cost)

						if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
						{
							this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.order_discount.discount_number);
							this.userService.discount_type = result.orders.order_discount.discount_type;
						    this.userService.discount_number = result.orders.order_discount.discount_number;
						}
						else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
						{
							this.user_discount = (Number(order.bill_cost))*(Number(result.orders.order_discount.discount_number/100));
							this.userService.discount_type = result.orders.order_discount.discount_type;
						    this.userService.discount_number = result.orders.order_discount.discount_number+"%";
						}
						else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
						{
							this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
							this.userService.discount_type = result.orders.order_discount.discount_type;
						    this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
						}
						else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
						{

							this.user_discount = (Number(order.bill_cost));
							this.userService.discount_type = result.orders.order_discount.discount_type;
						    this.userService.discount_number = "100%";
						}
						else{
							this.user_discount = 0;
							this.userService.discount_type = "none";
						    this.userService.discount_number = 0;
						}
					
					   console.log("user_discount--------------------------",this.user_discount);
					   let sub_total = order.item_list.reduce((a, b) => a + (b.selling_price*b.quantity), 0)
					   console.log("subtotal............", sub_total)
					   this.userService.order_list_bill_page[i].sub_total = sub_total;
					   this.userService.order_list_bill_page[i].user_discount = this.user_discount;
					   this.userService.order_list_bill_page[i].my_service_charge =  this.userService.my_service_charge;
						if (order.current_user) {
							console.log('myshare');
							let myorderitems = order.item_list.flat(Infinity);
							let tax_rates = myorderitems.map((item) => {
								console.log("Items.......", item)
								let new_tax_rates = item.tax_rates.filter((tax) => {
									console.log('type of tax.value  --------', typeof (tax.percentage))
									console.log('tax.percentage  --------', tax.percentage)
									console.log('tax.checked  --------', tax.checked)
									if (tax.checked == true) {
										tax.item_price = item.sold_price * item.quantity;
										tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
										console.log("tax.discount4..................", tax.discount)
										tax.discount_item_price = tax.item_price - tax.discount;
									//	(price of the item / total price) * discount
									    tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);

										// tax.item_price = item.sold_price * item.quantity;
										// tax.item_gst_price = (item.sold_price * item.quantity) * (tax.percentage / 100);
										console.log(tax)
										return tax
									} else {
										return false
									}
								})
								console.log('new_tax_rates', new_tax_rates)
								return new_tax_rates;
							})

							let tax_rates_array = tax_rates.flat(Infinity);
							let result2 = [];
							tax_rates_array.reduce(function (res, value) {
								console.log('value ---------', value)
								if (!res[value.tax_type]) {
									// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
									res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
									result2.push(res[value.tax_type])
								}
								res[value.tax_type].item_gst_price += value.item_gst_price;
								return res;
							}, {});
							console.log('result2 my_total ----------', result2)

							// console.log("Userservice Tax",this.userService.tax_details)
							this.userService.my_tax_total = result2.reduce((a, b) => a + b.item_gst_price, 0);
							console.log("my taxtotal-----------------", this.userService.my_tax_total)
							this.userService.order_list_bill_page[i].my_tax_total = this.userService.my_tax_total;
						}
						return order.item_list;
					});

					

					console.log("item array......", item_details_array)
					let all_item_list = item_details_array.flat(Infinity);
					let tax_rates = all_item_list.map((item) => {
						console.log("Items.......", item)
						let new_tax_rates = item.tax_rates.filter((tax) => {
							console.log('type of tax.value  --------', typeof (tax.percentage))
							console.log('tax.percentage  --------', tax.percentage)
							console.log('tax.checked  --------', tax.checked)
							if (tax.checked == true) {
								tax.item_price = item.sold_price * item.quantity;
								tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
								console.log("tax.discount4..................", tax.discount)
								tax.discount_item_price = tax.item_price - tax.discount;
							//	(price of the item / total price) * discount
								tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
								console.log(tax)
								return tax
							} else {
								return false
							}
						})
						console.log('new_tax_rates', new_tax_rates)
						return new_tax_rates;
					})

					let tax_rates_array = tax_rates.flat(Infinity);
					let result2 = [];
					tax_rates_array.reduce(function (res, value) {
						console.log('value ---------', value)
						if (!res[value.tax_type]) {
							// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
							res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
							result2.push(res[value.tax_type])
						}
						res[value.tax_type].item_gst_price += value.item_gst_price;
						return res;
					}, {});
					console.log('result2 ----------', result2)
					this.userService.tax_details = result2;
					console.log("Userservice Tax", this.userService.tax_details)	

					console.log("tax_total det---------------------",result2);
						this.userService.tax_total = this.userService.tax_details.reduce((a, b) => a + b.item_gst_price, 0)
						//this.userService.tax_total = result.orders.order_tax_amount;
					console.log("tax_total---------------------", parseFloat(this.userService.tax_total).toFixed(2));
					
					this.userService.order_list_bill_page.forEach((element, i) => {
						// this.altered_order_list[0].item_list.push(element.item_list[0]);  
						console.log("element-------------", element);
						let tax_newtotal = this.taxcalc(element);
						console.log("new Tax Total .....................", tax_newtotal)
						element.tax = tax_newtotal;
						console.log("Final Confirmed Array -----------------------", this.userService.order_list_bill_page)
						element.item_list.forEach(ele => {
							this.altered_order_list[0].item_list.push(ele);
						});
                        console.log("final cost**********************",result.orders.final_cost);
						this.altered_order_list[0].discont = result.orders.total_cost;
						this.altered_order_list[0].user_discount = element.user_discount;
						this.altered_order_list[0].bill_cost = this.altered_order_list[0].bill_cost + element.bill_cost;						
							this.altered_order_list[0].bill_tax = this.userService.tax_total;
							this.altered_order_list[0].total_cost = result.orders.total_cost;
							this.altered_order_list[0].bill_cost_gst =  result.orders.final_cost + this.userService.tax_total;
							
				
						
						this.altered_order_list[0].current_user = true;
						this.altered_order_list[0].gst = "0.00";

						if (element.user_id !== null) {
							this.altered_order_list[0].user_id = element.user_id;
						}


						if (element.user_name !== null) {
							this.altered_order_list[0].user_name = element.user_name;
						}
						else {
							this.altered_order_list[0].user_name = "For Table";
						}

					})

					console.log(",,,", this.altered_order_list);
					this.userService.confirmed_orderlist_for_bills = this.altered_order_list;
					console.log("************************", this.userService.confirmed_orderlist_for_bills);



					this.userService.billTotal = 0;

					for (let i = 0; i < this.userService.order_list_bill_page.length; i++) {
						this.userService.order_list_bill_page[i].gst = ((this.userService.restaurant_gst / 100) * this.userService.order_list_bill_page[i].bill_cost).toFixed(2);
						this.userService.billTotal += this.userService.order_list_bill_page[i].bill_cost;
						this.userService.billTotal_gst = this.userService.billTotal + this.userService.tax_total;
						
						console.log(this.userService.billTotal_gst, "bill_gst .................")

						let itemList = this.userService.order_list_bill_page[i].item_list;
						for (let j = 0; j < itemList.length; j++) {
							this.userService.billItems += itemList[j].quantity;
						}
					}
				}
							else {
								console.log('response', result);
							}
							// setTimeout(() => { this.loaderStatus = false; }, 500);
						});
					}

				}
				else if (data.order_status == "session_closed") {
					if (localStorage.getItem('user_details')) {

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
						this.userService.showOrderAgain = false;
						this.userService.user_name = " "
						this.router.navigate(['/']);
						this.snackBar.CLOSE();
					}
				}
				else if (data.socket_data == 'bill_removed') {
					if (localStorage.getItem('user_details')) {
						this.router.navigate(['/bill/view']);
						this.userService.showOrderNow = false;
						this.snackBar.CLOSE();
						this.snackBar.BILLSETTLEMENTINPROGRESSCLOSE();
						this.snackBar.OPEN('Bill removed.', 'Close');
						this.router.navigate(['/bill/view']);
						// this.router.navigate(['/']);
						this.userService.showBillAmount = false;
					}
				}
				else if (data.order_status == 'service_confirmed') {
					if (localStorage.getItem('user_details')) {
						this.snackBar.OPEN('Service call confirmed.', 'Close');
					}

				}
				else if (data.order_status == "checkout") {
					if (localStorage.getItem('user_details')) {
						let a = JSON.parse(localStorage.getItem('user_details'));
						let sendData = {
							dinamic_user_id:a.dinamic_user_id,
							access_code :localStorage.getItem("access_code")
						}
						this.apiService.GET_VALET_DETAILS(sendData).subscribe(result => {
							console.log('valet result....', result);
							if (result.status) 
							{
								this.userService.showOrderAgain = false;
							}							
							else
							{
								this.userService.showOrderAgain = true;
							}
						});
						

					}
				}
				else if (data.socket_data == 'all_bills_confirmed') {
					// this.router.navigate(['/bill/confirm']);
					this.apiService.GET_BILL().subscribe(result => {
						console.log("order res 1...", result);
						if (result.status != 0) {
							// this.loaderStatus = false;
							let billType = result.bills.bill_type;
							let billList = result.bills.bills;
							this.userService.bill_List = result.bills.bills;
							this.userService.bill_type = result.bills.bill_type;
			
							console.log("bills start..........", result)
							this.userService.order_id = result.bills._id;
							this.userService.order_number = result.bills.order_id;
							console.log("oreder number.................", this.userService.order_number)
							// this.userService.bill_type = rsult
							let userBill = this.getUserBill(billList, billType);
			
							console.log("userBill...........", userBill)
							if (this.userService.bill_List.length) {
								// this.userService.bill_type = this.userService.bill_List.bill_type
								
								
								this.userService.totalBasicBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_cost, 0); 		
								for(let i=0; i<this.userService.bill_List.length; i++)			
									{						
									// (price of the item / total price) * discount
			
									//this.userService.bill_List.bill_cost = Number(this.userService.bill_List[i].bill_cost);
									//this.discount = result.orders.order_discount;
								
									
									console.log("my_service_charge ************ ",this.userService.my_service_charge)
									this.userService.bill_List[i].service_charge_amount =  this.userService.bill_List[i].service_charge_amount ? this.userService.bill_List[i].service_charge_amount : 0 ;
									
									if(result.bills.order_discount && result.bills.order_discount.discount_type === 'amount' && result.bills.order_discount.discount_number)
									{
										this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost)/Number(this.userService.totalBasicBillCost))*Number(result.bills.order_discount.discount_number);
										this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
									}
									else if(result.bills.order_discount && result.bills.order_discount.discount_type === 'percentage' && result.bills.order_discount.discount_number)
									{
										this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost))*(Number(result.bills.order_discount.discount_number/100));
										this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
									}
									else if(result.bills.order_discount && result.bills.order_discount.discount_type === 'new_value' && result.bills.order_discount.discount_number)
									{
										this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost)/Number(this.userService.totalBasicBillCost))*Number(this.userService.totalBasicBillCost-result.bills.order_discount.discount_number);
										this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
									}
									else if(result.bills.order_discount && result.bills.order_discount.discount_type === 'flat')
									{
										this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost));
										this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
									}
									else{
										this.userService.bill_List[i].user_discount = 0;
										this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost+this.userService.bill_List[i].bill_tax_amount+this.userService.bill_List[i].service_charge_amount)-this.userService.bill_List[i].user_discount
									}
			
								   console.log("user_discount--------------------------",this.userService.bill_List[i].user_discount);
			
									}					
								
									
									console.log("service_charge***************************", Number(this.userService.service_charge))
				
			
								console.log("this.userService.tax_total", this.userService.tax_total)
			
								this.userService.totalBillCost_withtax = this.userService.totalBillCost + this.userService.tax_total;
			
								this.userService.totalBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_cost_incl_tax, 0);
								this.userService.totalFinalBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_final_cost, 0);
								this.userService.billListLength = this.userService.bill_List.length;
								this.userService.itemListLength = this.userService.bill_List.reduce((a, b) => a + b.item_list.length, 0);
								if(result.bills.bill_type === 'split_equal')
								{
									this.userService.itemListLength = this.userService.itemListLength/2
								}
			
			
								let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
									console.log("service charge..............", restaurant_details.service_charge)
									if(localStorage.getItem("service_status") === "false")
									{
										this.userService.service_charge = 0;
										this.userService.my_service_charge = 0;
									}
									else
									{
										if (restaurant_details.service_charge != '0') {
											let service_charge = Number(restaurant_details.service_charge) / 100
											
											this.userService.service_charge = (service_charge * this.userService.totalFinalBillCost);
											console.log("service Charge...........................", this.userService.service_charge);
											this.userService.my_service_charge = (Number(this.userService.bill_List.bill_cost)/Number(this.userService.totalBasicBillCost))*Number(this.userService.service_charge);
										}
										else {
											this.userService.service_charge = 0;
										}
									}
			
								console.log("totalFinalBillCost...........................", this.userService.totalFinalBillCost);
								console.log("Total_billcost................", this.userService.totalBillCost_withtax);

								console.log(userBill.bill_status);
								if (userBill.bill_status == 'confirmed') {
									this.userService.billConfirmText = 'Total Amount Payable is';
									this.userService.showBillAmount = true;
									this.userService.payButtonStatus = true;
									this.userService.payStatusText = 'PAY';
									this.userService.bill_type_text = "Bill Summary";
								}
								else {
									this.userService.billConfirmText = 'Total amount paid';
									this.userService.showBillAmount = true;
									this.userService.payButtonStatus = true;
									this.userService.bill_type_text = "Bill Summary"

								}
							}

						}
					});
				}
			}
			else {

				if (data.order_status === "confirmed") {
					this.userService.placed_order_status = false;


					if (localStorage.getItem('user_details')) {

						if (data.has_unassigned_item) {
							this.userService.has_unassigned_item = true;
						} else {
							this.userService.has_unassigned_item = false;
						}

						let orderData = {
							"order_details": {
								"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
								// "item_details": JSON.parse(localStorage.getItem('cart')),   
							}
						}
						if (orderData.order_details.order_type == 'in_house') {

							self.userService.SET_PLACED_ORDER_STATUS();
							this.userService.showExit = false;
							let dinamic_user_id = JSON.parse(localStorage.getItem('user_details')).dinamic_user_id;
							console.log('user_id.....', dinamic_user_id);
							if (data.persons_in_order) {
								console.log('data person.....', data.persons_in_order);
								let user_Status = data.persons_in_order.filter(
									i => i.orderer_id === dinamic_user_id);

								console.log("user_Status..............", user_Status)
								this.index = data.persons_in_order.findIndex(i => i.orderer_id === dinamic_user_id);
								if (this.index === 0) { this.index = 1; }
								else { this.index = 0; }
								let personListLength = data.persons_in_order.length;

								console.log("index by initial..........................", personListLength)
								if (personListLength < 2) {
									let placedUserName = (data.persons_in_order[0].orderer_name.split(' ').length) >= 2 ? data.persons_in_order[0].orderer_name.split(' ')[0] : data.persons_in_order[0].orderer_name;
									console.log("if", user_Status)
									if (user_Status.length) {
										this.userService.confirmContent = "Your order has been confirmed.";

									}
									else {
										this.userService.confirmContent = placedUserName + "'s order was confirmed.";
									}
								}

								else {
									let otherUserName = (data.persons_in_order[this.index].orderer_name.split(' ').length) >= 2 ? data.persons_in_order[this.index].orderer_name.split(' ')[0] : data.persons_in_order[this.index].orderer_name
									if (personListLength === 2) {

										if (user_Status.length) {
											this.userService.confirmContent = "Yours and " + otherUserName + "'s order was confirmed.";


										}
										else {
											this.userService.confirmContent = otherUserName + " and " + (personListLength - 1) + "  other’s order was confirmed.";
										}
									}
									else {
										if (user_Status.length) {
											this.userService.confirmContent = "You and " + (personListLength - 1) + " others order was confirmed.";


										}
										else {
											this.userService.confirmContent = otherUserName + " and " + (personListLength - 1) + " others order was confirmed.";
										}
									}
								}
								console.log("this.userService.confirmContent", this.userService.confirmContent)

								this.snackBar.BILLSETTLEMENTINPROGRESS(this.userService.confirmContent, 'OKAY');


								// if(user_Status.length)
								// {
								//   this.router.navigate(['/order-status']);

								// }
								this.userService.showAwaiting = false;
								localStorage.setItem("await_settlement", "true");
								localStorage.setItem('payment_status', 'paid');
								this.userService.confirmationStatus = true;
							}

							self.apiService.CONFIRMED_ORDERS().subscribe(result => {
								console.log("confirm orders##########", result);
								if (result.status) {
									this.altered_order_list = [{
										'bill_cost': 0,
										'bill_cost_gst': 0,
										'current_user': false,
										'gst': "0.00",
										'item_list': [],
										'user_id': null,
										'user_name': null,
									}];
									this.order =  result.orders;
									this.userService.grandTotal = result.orders.grand_total;
									this.userService.service_charge_amount = result.orders.service_charge_amount ? result.orders.service_charge_amount : 0;
									this.userService.service_charge_percentage = result.orders.service_charge_percentage ? result.orders.service_charge_percentage : 0;
									this.userService.total_cost_after_dicount = result.orders.total_cost_after_dicount ? result.orders.total_cost_after_dicount : 0;
									if(result.orders.item_discounts && result.orders.item_discounts.total_items  && result.orders.item_discounts.total_items != 0)
									{
										this.userService.item_discount = result.orders.item_discounts.total_discount
									}
									else
									{
										this.userService.item_discount = 0;
									}
				
									if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
									{
										this.userService.bill_discount = result.orders.order_discount.discount_number;
										
									}
									else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
									{
										this.userService.bill_discount = (Number(result.orders.total_cost-this.userService.item_discount))*(Number(result.orders.order_discount.discount_number/100));
										this.userService.discount_type = result.orders.order_discount.discount_type;
										this.userService.discount_number = result.orders.order_discount.discount_number+"%";
									}
									else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
									{
										this.userService.bill_discount = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
										this.userService.discount_type = result.orders.order_discount.discount_type;
										this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number));
									}
									else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
									{
				
										this.userService.bill_discount = (Number(result.orders.total_cost));
										this.userService.discount_type = result.orders.order_discount.discount_type;
										this.userService.discount_number = "100%";
									}
									else{
										this.userService.bill_discount = 0;
										this.userService.discount_type = "none";
										this.userService.discount_number = 0;
									}
				
									 
								  console.log("this.userService.item_discount-----------------", this.userService.item_discount)
									if(this.customer_editable_sc)
										{
											console.log("this.customer_editable_sc.............", this.customer_editable_sc)
											if(result.orders.is_applied_service_charge === true)
											{
											localStorage.setItem("service_status","true");
											this.userService.serviceStatus = true;
											console.log("this.userService.serviceStatus .............", this.userService.serviceStatus)
											}
											else
											{
												this.userService.serviceStatus = false;
												console.log("this.userService.serviceStatus false.............", this.userService.serviceStatus)
											}		
											
										}
				
				
									
									let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
									console.log("service charge..............", restaurant_details.service_charge)
									if (restaurant_details.service_charge != '0') {
										let service_charge = Number(restaurant_details.service_charge) / 100
										console.log("service charge1..............", result.orders.final_cost)
										this.final_cost = result.orders.final_cost
										this.userService.service_charge = (service_charge * result.orders.final_cost);
										console.log("service Charge...........................", this.userService.service_charge)
									}
									else {
										this.userService.service_charge = 0;
									}
									
									
				
									this.userService.order_list_bill_page = result.orders.order_list;
								
									console.log("-----------", this.userService.order_list_bill_page)
				
									let item_details_array = this.userService.order_list_bill_page.map((order,i) => {
										console.log("order.user_id------------------------", result.orders.order_discount.order_number);
										// (price of the item / total price) * discount
				
										this.order_bill_cost = Number(order.bill_cost);
										this.discount = result.orders.order_discount;
				
										this.userService.my_service_charge = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.service_charge_amount);
										console.log("my_service_charge ************ ",this.userService.my_service_charge);
				
										console.log("order_bill_cost************",order.bill_cost,"total cost......", result.orders.total_cost)
				
										if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
										{
											this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.order_discount.discount_number);
											this.userService.discount_type = result.orders.order_discount.discount_type;
											this.userService.discount_number = result.orders.order_discount.discount_number;
										}
										else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
										{
											this.user_discount = (Number(order.bill_cost))*(Number(result.orders.order_discount.discount_number/100));
											this.userService.discount_type = result.orders.order_discount.discount_type;
											this.userService.discount_number = result.orders.order_discount.discount_number+"%";
										}
										else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
										{
											this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
											this.userService.discount_type = result.orders.order_discount.discount_type;
											this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
										}
										else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
										{
				
											this.user_discount = (Number(order.bill_cost));
											this.userService.discount_type = result.orders.order_discount.discount_type;
											this.userService.discount_number = "100%";
										}
										else{
											this.user_discount = 0;
											this.userService.discount_type = "none";
											this.userService.discount_number = 0;
										}
									
									   console.log("user_discount--------------------------",this.user_discount);
									   let sub_total = order.item_list.reduce((a, b) => a + (b.selling_price*b.quantity), 0)
									   console.log("subtotal............", sub_total)
									   this.userService.order_list_bill_page[i].sub_total = sub_total;
									   this.userService.order_list_bill_page[i].user_discount = this.user_discount;
									   this.userService.order_list_bill_page[i].my_service_charge =  this.userService.my_service_charge;
										if (order.current_user) {
											console.log('myshare');
											let myorderitems = order.item_list.flat(Infinity);
											let tax_rates = myorderitems.map((item) => {
												console.log("Items.......", item)
												let new_tax_rates = item.tax_rates.filter((tax) => {
													console.log('type of tax.value  --------', typeof (tax.percentage))
													console.log('tax.percentage  --------', tax.percentage)
													console.log('tax.checked  --------', tax.checked)
													if (tax.checked == true) {
														tax.item_price = item.sold_price * item.quantity;
														tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
														console.log("tax.discount4..................", tax.discount)
														tax.discount_item_price = tax.item_price - tax.discount;
													//	(price of the item / total price) * discount
														tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
				
														// tax.item_price = item.sold_price * item.quantity;
														// tax.item_gst_price = (item.sold_price * item.quantity) * (tax.percentage / 100);
														console.log(tax)
														return tax
													} else {
														return false
													}
												})
												console.log('new_tax_rates', new_tax_rates)
												return new_tax_rates;
											})
				
											let tax_rates_array = tax_rates.flat(Infinity);
											let result2 = [];
											tax_rates_array.reduce(function (res, value) {
												console.log('value ---------', value)
												if (!res[value.tax_type]) {
													// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
													res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
													result2.push(res[value.tax_type])
												}
												res[value.tax_type].item_gst_price += value.item_gst_price;
												return res;
											}, {});
											console.log('result2 my_total ----------', result2)
				
											// console.log("Userservice Tax",this.userService.tax_details)
											this.userService.my_tax_total = result2.reduce((a, b) => a + b.item_gst_price, 0);
											console.log("my taxtotal-----------------", this.userService.my_tax_total)
											this.userService.order_list_bill_page[i].my_tax_total = this.userService.my_tax_total;
										}
										return order.item_list;
									});
				
									
				
									console.log("item array......", item_details_array)
									let all_item_list = item_details_array.flat(Infinity);
									let tax_rates = all_item_list.map((item) => {
										console.log("Items.......", item)
										let new_tax_rates = item.tax_rates.filter((tax) => {
											console.log('type of tax.value  --------', typeof (tax.percentage))
											console.log('tax.percentage  --------', tax.percentage)
											console.log('tax.checked  --------', tax.checked)
											if (tax.checked == true) {
												tax.item_price = item.sold_price * item.quantity;
												tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
												console.log("tax.discount4..................", tax.discount)
												tax.discount_item_price = tax.item_price - tax.discount;
											//	(price of the item / total price) * discount
												tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
												console.log(tax)
												return tax
											} else {
												return false
											}
										})
										console.log('new_tax_rates', new_tax_rates)
										return new_tax_rates;
									})
				
									let tax_rates_array = tax_rates.flat(Infinity);
									let result2 = [];
									tax_rates_array.reduce(function (res, value) {
										console.log('value ---------', value)
										if (!res[value.tax_type]) {
											// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
											res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
											result2.push(res[value.tax_type])
										}
										res[value.tax_type].item_gst_price += value.item_gst_price;
										return res;
									}, {});
									console.log('result2 ----------', result2)
									this.userService.tax_details = result2;
									console.log("Userservice Tax", this.userService.tax_details)	
				
									console.log("tax_total det---------------------",result2);
										this.userService.tax_total = this.userService.tax_details.reduce((a, b) => a + b.item_gst_price, 0)
										//this.userService.tax_total = result.orders.order_tax_amount;
									console.log("tax_total---------------------", parseFloat(this.userService.tax_total).toFixed(2));
									
									this.userService.order_list_bill_page.forEach((element, i) => {
										// this.altered_order_list[0].item_list.push(element.item_list[0]);  
										console.log("element-------------", element);
										let tax_newtotal = this.taxcalc(element);
										console.log("new Tax Total .....................", tax_newtotal)
										element.tax = tax_newtotal;
										console.log("Final Confirmed Array -----------------------", this.userService.order_list_bill_page)
										element.item_list.forEach(ele => {
											this.altered_order_list[0].item_list.push(ele);
										});
										console.log("final cost**********************",result.orders.final_cost);
										this.altered_order_list[0].discont = result.orders.total_cost;
										this.altered_order_list[0].user_discount = element.user_discount;
										this.altered_order_list[0].bill_cost = this.altered_order_list[0].bill_cost + element.bill_cost;						
											this.altered_order_list[0].bill_tax = this.userService.tax_total;
											this.altered_order_list[0].total_cost = result.orders.total_cost;
											this.altered_order_list[0].bill_cost_gst =  result.orders.final_cost + this.userService.tax_total;
											
								
										
										this.altered_order_list[0].current_user = true;
										this.altered_order_list[0].gst = "0.00";
				
										if (element.user_id !== null) {
											this.altered_order_list[0].user_id = element.user_id;
										}
				
				
										if (element.user_name !== null) {
											this.altered_order_list[0].user_name = element.user_name;
										}
										else {
											this.altered_order_list[0].user_name = "For Table";
										}
				
									})
				
									console.log(",,,", this.altered_order_list);
									this.userService.confirmed_orderlist_for_bills = this.altered_order_list;
									console.log("************************", this.userService.confirmed_orderlist_for_bills);
				
				
				
									this.userService.billTotal = 0;
				
									for (let i = 0; i < this.userService.order_list_bill_page.length; i++) {
										this.userService.order_list_bill_page[i].gst = ((this.userService.restaurant_gst / 100) * this.userService.order_list_bill_page[i].bill_cost).toFixed(2);
										this.userService.billTotal += this.userService.order_list_bill_page[i].bill_cost;
										this.userService.billTotal_gst = this.userService.billTotal + this.userService.tax_total;
										
										console.log(this.userService.billTotal_gst, "bill_gst .................")
				
										let itemList = this.userService.order_list_bill_page[i].item_list;
										for (let j = 0; j < itemList.length; j++) {
											this.userService.billItems += itemList[j].quantity;
										}
									}
								}
								else {
									this.userService.order_list_bill_page = [];
									console.log('response----------------------', result);
								}
								// setTimeout(() => { this.loaderStatus = false; }, 500);
							});

						} else {
							localStorage.removeItem('order_status');
							localStorage.setItem("await_settlement", "true");
						}
					}


				}
				else if (data.order_status == "delivered") {
					if (localStorage.getItem('user_details')) {
						this.snackBar.OPEN('Bill settled.', 'Close');
						this.userService.billConfirmText = 'You have paid';
					}
				}


				else if (data.message == 'bill added successfully' || data.message == 'order billed') {
					// self.router.navigate(['/bill/confirm']);
					if (localStorage.getItem('user_details')) {
						// this.router.navigate(['/bill/confirm']);
					}

				}
				else if (data.order_status == 'placed') {
					if (localStorage.getItem('user_details')) {
						let ord_type = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
						console.log('order type.....', ord_type);
						if (ord_type == 'in_house') {
							// localStorage.setItem("await_settlement", "true");
							// localStorage.setItem('payment_status', 'paid');
							this.userService.SET_PLACED_ORDER_STATUS();
							this.userService.showExit = false;
						}
					}
				}
				else if (data.order_status == "deleted") {
					if (localStorage.getItem('user_details')) {
						this.userService.order_list_bill_page = [];
						this.userService.showExit = true;
						this.userService.placed_order_status = false;
						this.userService.showOrderNow = false;
						this.snackBar.OPEN('Your order is deleted.', 'Close');
						this.router.navigate(['/home']);
					}

				}
				else if (data.order_status == "removed" || data.order_status === "all_items_removed") {
					if (localStorage.getItem('user_details')) {

						if (data.has_unassigned_item) {
							this.userService.has_unassigned_item = true;
						} else {
							this.userService.has_unassigned_item = false;
						}

						self.apiService.CONFIRMED_ORDERS().subscribe(result => {
							console.log("confirm orders##########", result);
							if (result.status) {
								this.altered_order_list = [{
									'bill_cost': 0,
									'bill_cost_gst': 0,
									'current_user': false,
									'gst': "0.00",
									'item_list': [],
									'user_id': null,
									'user_name': null,
								}];
								this.order =  result.orders;
								this.userService.grandTotal = result.orders.grand_total;
								this.userService.service_charge_amount = result.orders.service_charge_amount ? result.orders.service_charge_amount : 0;
								this.userService.service_charge_percentage = result.orders.service_charge_percentage ? result.orders.service_charge_percentage : 0;
								this.userService.total_cost_after_dicount = result.orders.total_cost_after_dicount ? result.orders.total_cost_after_dicount : 0;
								if(result.orders.item_discounts && result.orders.item_discounts.total_items  && result.orders.item_discounts.total_items != 0)
								{
									this.userService.item_discount = result.orders.item_discounts.total_discount
								}
								else
								{
									this.userService.item_discount = 0;
								}
			
								if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
								{
									this.userService.bill_discount = result.orders.order_discount.discount_number;
									
								}
								else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
								{
									this.userService.bill_discount = (Number(result.orders.total_cost-this.userService.item_discount))*(Number(result.orders.order_discount.discount_number/100));
									this.userService.discount_type = result.orders.order_discount.discount_type;
									this.userService.discount_number = result.orders.order_discount.discount_number+"%";
								}
								else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
								{
									this.userService.bill_discount = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
									this.userService.discount_type = result.orders.order_discount.discount_type;
									this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number));
								}
								else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
								{
			
									this.userService.bill_discount = (Number(result.orders.total_cost));
									this.userService.discount_type = result.orders.order_discount.discount_type;
									this.userService.discount_number = "100%";
								}
								else{
									this.userService.bill_discount = 0;
									this.userService.discount_type = "none";
									this.userService.discount_number = 0;
								}
			
								 
							  console.log("this.userService.item_discount-----------------", this.userService.item_discount)
								if(this.customer_editable_sc)
									{
										console.log("this.customer_editable_sc.............", this.customer_editable_sc)
										if(result.orders.is_applied_service_charge === true)
										{
										localStorage.setItem("service_status","true");
										this.userService.serviceStatus = true;
										console.log("this.userService.serviceStatus .............", this.userService.serviceStatus)
										}
										else
										{
											this.userService.serviceStatus = false;
											console.log("this.userService.serviceStatus false.............", this.userService.serviceStatus)
										}		
										
									}
			
			
								
								let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
								console.log("service charge..............", restaurant_details.service_charge)
								if (restaurant_details.service_charge != '0') {
									let service_charge = Number(restaurant_details.service_charge) / 100
									console.log("service charge1..............", result.orders.final_cost)
									this.final_cost = result.orders.final_cost
									this.userService.service_charge = (service_charge * result.orders.final_cost);
									console.log("service Charge...........................", this.userService.service_charge)
								}
								else {
									this.userService.service_charge = 0;
								}
								
								
			
								this.userService.order_list_bill_page = result.orders.order_list;
							
								console.log("-----------", this.userService.order_list_bill_page)
			
								let item_details_array = this.userService.order_list_bill_page.map((order,i) => {
									console.log("order.user_id------------------------", result.orders.order_discount.order_number);
									// (price of the item / total price) * discount
			
									this.order_bill_cost = Number(order.bill_cost);
									this.discount = result.orders.order_discount;
			
									this.userService.my_service_charge = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.service_charge_amount);
									console.log("my_service_charge ************ ",this.userService.my_service_charge);
			
									console.log("order_bill_cost************",order.bill_cost,"total cost......", result.orders.total_cost)
			
									if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
									{
										this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.order_discount.discount_number);
										this.userService.discount_type = result.orders.order_discount.discount_type;
										this.userService.discount_number = result.orders.order_discount.discount_number;
									}
									else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
									{
										this.user_discount = (Number(order.bill_cost))*(Number(result.orders.order_discount.discount_number/100));
										this.userService.discount_type = result.orders.order_discount.discount_type;
										this.userService.discount_number = result.orders.order_discount.discount_number+"%";
									}
									else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
									{
										this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
										this.userService.discount_type = result.orders.order_discount.discount_type;
										this.userService.discount_number = Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
									}
									else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
									{
			
										this.user_discount = (Number(order.bill_cost));
										this.userService.discount_type = result.orders.order_discount.discount_type;
										this.userService.discount_number = "100%";
									}
									else{
										this.user_discount = 0;
										this.userService.discount_type = "none";
										this.userService.discount_number = 0;
									}
								
								   console.log("user_discount--------------------------",this.user_discount);
								   let sub_total = order.item_list.reduce((a, b) => a + (b.selling_price*b.quantity), 0)
								   console.log("subtotal............", sub_total)
								   this.userService.order_list_bill_page[i].sub_total = sub_total;
								   this.userService.order_list_bill_page[i].user_discount = this.user_discount;
								   this.userService.order_list_bill_page[i].my_service_charge =  this.userService.my_service_charge;
									if (order.current_user) {
										console.log('myshare');
										let myorderitems = order.item_list.flat(Infinity);
										let tax_rates = myorderitems.map((item) => {
											console.log("Items.......", item)
											let new_tax_rates = item.tax_rates.filter((tax) => {
												console.log('type of tax.value  --------', typeof (tax.percentage))
												console.log('tax.percentage  --------', tax.percentage)
												console.log('tax.checked  --------', tax.checked)
												if (tax.checked == true) {
													tax.item_price = item.sold_price * item.quantity;
													tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
													console.log("tax.discount4..................", tax.discount)
													tax.discount_item_price = tax.item_price - tax.discount;
												//	(price of the item / total price) * discount
													tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
			
													// tax.item_price = item.sold_price * item.quantity;
													// tax.item_gst_price = (item.sold_price * item.quantity) * (tax.percentage / 100);
													console.log(tax)
													return tax
												} else {
													return false
												}
											})
											console.log('new_tax_rates', new_tax_rates)
											return new_tax_rates;
										})
			
										let tax_rates_array = tax_rates.flat(Infinity);
										let result2 = [];
										tax_rates_array.reduce(function (res, value) {
											console.log('value ---------', value)
											if (!res[value.tax_type]) {
												// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
												res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
												result2.push(res[value.tax_type])
											}
											res[value.tax_type].item_gst_price += value.item_gst_price;
											return res;
										}, {});
										console.log('result2 my_total ----------', result2)
			
										// console.log("Userservice Tax",this.userService.tax_details)
										this.userService.my_tax_total = result2.reduce((a, b) => a + b.item_gst_price, 0);
										console.log("my taxtotal-----------------", this.userService.my_tax_total)
										this.userService.order_list_bill_page[i].my_tax_total = this.userService.my_tax_total;
									}
									return order.item_list;
								});
			
								
			
								console.log("item array......", item_details_array)
								let all_item_list = item_details_array.flat(Infinity);
								let tax_rates = all_item_list.map((item) => {
									console.log("Items.......", item)
									let new_tax_rates = item.tax_rates.filter((tax) => {
										console.log('type of tax.value  --------', typeof (tax.percentage))
										console.log('tax.percentage  --------', tax.percentage)
										console.log('tax.checked  --------', tax.checked)
										if (tax.checked == true) {
											tax.item_price = item.sold_price * item.quantity;
											tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
											console.log("tax.discount4..................", tax.discount)
											tax.discount_item_price = tax.item_price - tax.discount;
										//	(price of the item / total price) * discount
											tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
											console.log(tax)
											return tax
										} else {
											return false
										}
									})
									console.log('new_tax_rates', new_tax_rates)
									return new_tax_rates;
								})
			
								let tax_rates_array = tax_rates.flat(Infinity);
								let result2 = [];
								tax_rates_array.reduce(function (res, value) {
									console.log('value ---------', value)
									if (!res[value.tax_type]) {
										// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
										res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
										result2.push(res[value.tax_type])
									}
									res[value.tax_type].item_gst_price += value.item_gst_price;
									return res;
								}, {});
								console.log('result2 ----------', result2)
								this.userService.tax_details = result2;
								console.log("Userservice Tax", this.userService.tax_details)	
			
								console.log("tax_total det---------------------",result2);
									this.userService.tax_total = this.userService.tax_details.reduce((a, b) => a + b.item_gst_price, 0)
									//this.userService.tax_total = result.orders.order_tax_amount;
								console.log("tax_total---------------------", parseFloat(this.userService.tax_total).toFixed(2));
								
								this.userService.order_list_bill_page.forEach((element, i) => {
									// this.altered_order_list[0].item_list.push(element.item_list[0]);  
									console.log("element-------------", element);
									let tax_newtotal = this.taxcalc(element);
									console.log("new Tax Total .....................", tax_newtotal)
									element.tax = tax_newtotal;
									console.log("Final Confirmed Array -----------------------", this.userService.order_list_bill_page)
									element.item_list.forEach(ele => {
										this.altered_order_list[0].item_list.push(ele);
									});
									console.log("final cost**********************",result.orders.final_cost);
									this.altered_order_list[0].discont = result.orders.total_cost;
									this.altered_order_list[0].user_discount = element.user_discount;
									this.altered_order_list[0].bill_cost = this.altered_order_list[0].bill_cost + element.bill_cost;						
										this.altered_order_list[0].bill_tax = this.userService.tax_total;
										this.altered_order_list[0].total_cost = result.orders.total_cost;
										this.altered_order_list[0].bill_cost_gst =  result.orders.final_cost + this.userService.tax_total;
										
							
									
									this.altered_order_list[0].current_user = true;
									this.altered_order_list[0].gst = "0.00";
			
									if (element.user_id !== null) {
										this.altered_order_list[0].user_id = element.user_id;
									}
			
			
									if (element.user_name !== null) {
										this.altered_order_list[0].user_name = element.user_name;
									}
									else {
										this.altered_order_list[0].user_name = "For Table";
									}
			
								})
			
								console.log(",,,", this.altered_order_list);
								this.userService.confirmed_orderlist_for_bills = this.altered_order_list;
								console.log("************************", this.userService.confirmed_orderlist_for_bills);
			
			
			
								this.userService.billTotal = 0;
			
								for (let i = 0; i < this.userService.order_list_bill_page.length; i++) {
									this.userService.order_list_bill_page[i].gst = ((this.userService.restaurant_gst / 100) * this.userService.order_list_bill_page[i].bill_cost).toFixed(2);
									this.userService.billTotal += this.userService.order_list_bill_page[i].bill_cost;
									this.userService.billTotal_gst = this.userService.billTotal + this.userService.tax_total;
									
									console.log(this.userService.billTotal_gst, "bill_gst .................")
			
									let itemList = this.userService.order_list_bill_page[i].item_list;
									for (let j = 0; j < itemList.length; j++) {
										this.userService.billItems += itemList[j].quantity;
									}
								}
							}
							else {
								console.log('response', result);
							}

							if (data.order_status === "all_items_removed") {
								this.snackBar.BILLSETTLEMENTINPROGRESS('Your last order was cancelled', 'Close');
								this.hrefval = this.router.url;
								console.log(this.hrefval)
								if (this.hrefval === '/order-status' || this.hrefval === '/bill/view') {
									this.router.navigate(['/home'])
								}

							}

							// setTimeout(() => { this.loaderStatus = false; }, 500);
						});
					}

				}
				else if (data.order_status == "session_closed") {
					if (localStorage.getItem('user_details')) {

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
						this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict')

						this.userService.showOrderAgain = false;
						this.userService.user_name = " ";
						this.router.navigate(['/']);
						this.snackBar.CLOSE();
					}
				}
				else if (data.order_status == 'bill_removed') {
					if (localStorage.getItem('user_details')) {
						this.userService.showOrderNow = false;
						// this.router.navigate(['/bill/view']);
						this.snackBar.CLOSE();
						this.snackBar.OPEN('Bill removed.', 'Close');
						this.router.navigate(['/']);
						this.userService.showBillAmount = false;
					}
				}
				else if (data.order_status == 'service_confirmed') {
					if (localStorage.getItem('user_details')) {
						let dinamic_user_id = JSON.parse(localStorage.getItem('user_details')).dinamic_user_id;
						console.log('user_id.....', dinamic_user_id);
						console.log('data person.....', data.persons_in_service);

						let user_Status = data.persons_in_service.filter(i => i.orderer_id === dinamic_user_id);

						console.log("user_Status..............", user_Status)

						if (user_Status.length) {
							this.snackBar.OPEN('Service call confirmed.', 'Close');
						}


					}

				}
				else if (data.order_status == "checkout") {
					if (localStorage.getItem('user_details')) {
						this.userService.showOrderAgain = true;
					}
				}

			}
		});

		this.socket.on("update_order", (data) => {
			console.log('update_order data: ', data);
		});

	
		
	}

	NotificationList() {
		return this.notificationList;
	}
	showNotify(data, index) {
		this.notificationList.splice(index, 1);
		if (data.url) this.router.navigate([data.url]);
	}
	closeNotify(data, index) {
		this.notificationList.splice(index, 1);
	}


	taxcalc(ele) {

		let myorderitems = ele.item_list.flat(Infinity);
		let tax_rates = myorderitems.map((item) => {
			console.log("Items111111111.......", item)
			let new_tax_rates = item.tax_rates.filter((tax) => {
				console.log('type of tax.value1  --------', typeof (tax.percentage))
				console.log('tax.percentage1  --------', tax.percentage)
				console.log('tax.checked1  --------', tax.checked)
				if (tax.checked == true) {
					// tax.item_price = item.sold_price * item.quantity;
					// tax.item_gst_price = (item.sold_price * item.quantity) * (tax.percentage / 100);
					tax.item_price = item.sold_price * item.quantity;
										tax.discount = ((item.sold_price * item.quantity)/this.order_bill_cost)*this.user_discount;
										console.log("tax.discount4..................", tax.discount)
										tax.discount_item_price = tax.item_price - tax.discount;
									//	(price of the item / total price) * discount
									    tax.item_gst_price = (tax.discount_item_price) * (tax.percentage / 100);
					console.log(tax)
					return tax
				} else {
					return false
				}
			})
			console.log('new_tax_rates**************ele', new_tax_rates)
			return new_tax_rates;
		})



		let tax_rates_array = tax_rates.flat(Infinity);
		let result2 = [];
		tax_rates_array.reduce(function (res, value) {
			console.log('value ---------', value)
			if (!res[value.tax_type]) {
				// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
				res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
				result2.push(res[value.tax_type])
			}
			res[value.tax_type].item_gst_price += value.item_gst_price;
			return res;
		}, {});
		console.log('result2 ----------', result2)
		this.userService.tax_details = result2;
		console.log("Userservice Tax", this.userService.tax_details)
		let tax_total = this.userService.tax_details.reduce((a, b) => a + b.item_gst_price, 0)

		return tax_total;
		console.log("tax_total1-----------------------------------", tax_total);

	}

	getUserBill(billList, billType) {
		console.log("2", billList, "-------------------", billType)
		if (billType == 'my_share') {
			for (let i = 0; i < billList.length; i++) {
				if (billList[i].my_order) {
					return billList[i];
				}
			}
		}
		else if (billType == 'total') {

			return billList[0];

		}
		else if (billType == 'split_equal') {
			for (let i = 0; i < billList.length; i++) {
				return billList[i];
			}
		}
		else if (billType == 'split_by_item') {
			for (let i = 0; i < billList.length; i++) {
				return billList[i];
			}
		}

		console.log("frehjejheg", billList)
	}


	onLogout() {
		let userDetails = JSON.parse(localStorage.getItem('user_details'));
		let userData = {
			dinamic_table_id: JSON.parse(localStorage.getItem('dinamic_details')).table_id,
			dinamic_session_id: userDetails.session_id,
			user_email: userDetails.email
		};

		// if(this.cartItems)
		this.apiService.CONFIRMED_ORDERS().subscribe(result => {
			console.log('orders....', result)
			if (result.status) {

				this.apiService.GET_BILL().subscribe(rsult => {
					console.log('oms bills.....', rsult);
					let userDetails = JSON.parse(localStorage.getItem('user_details'));
					this.user_name = userDetails.name;
					if (rsult.status) {
						// Block Order Now and show bill settlement in progress snackbar
						let bills = rsult.bills.bills;
						let check_currentuser_ordered = bills.filter(ss => ss.orderer_name != this.user_name);
						console.log('bills....', check_currentuser_ordered);

						if (check_currentuser_ordered.length) {
							this.apiService.DINAMIC_LOGOUT(userData).subscribe(result => {

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
								this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict')


								this.snackBar.CLOSE();
								this.router.navigate(['/']);
							});
						} else {
							let order_list = result.orders.order_list;
							if (order_list.length) {
								this.router.navigate(['/bill/view']);
							} else {
								this.apiService.PLACED_ORDERS().subscribe(res => {
									if (res.status) {
										let ord_list = res.orders.order_list;
										if (ord_list.length) {
											this.router.navigate(['/order-status']);
										} else {
											this.apiService.DINAMIC_LOGOUT(userData).subscribe(result => {

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
												this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict')

												this.router.navigate(['/']);
											});
										}
									}
								})

							}
						}
					} else {

						let order_list = result.orders.order_list;
						if (order_list.length) {
							this.router.navigate(['/bill/view']);
						} else {
							this.apiService.PLACED_ORDERS().subscribe(res => {
								if (res.status) {
									let ord_list = res.orders.order_list;
									if (ord_list.length) {
										this.router.navigate(['/order-status']);
									} else {
										this.apiService.DINAMIC_LOGOUT(userData).subscribe(result => {

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
											this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict')

											this.router.navigate(['/']);
										});
									}
								}
							})

						}

					}
				})

			} else {
				this.apiService.DINAMIC_LOGOUT(userData).subscribe(result => {

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
					this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict')

					this.router.navigate(['/']);
				});
			}
		})
		// let cart = JSON.parse(localStorage.getItem('cart'));
		//   if(cart){
		//     if(cart.length){
		//      this.router.navigate['/bill/view'];
		//     }else{
		//       this.apiService.DINAMIC_LOGOUT(userData).subscribe(result => {
		//         localStorage.clear();
		//         sessionStorage.clear();
		//         this.router.navigate(['/']);
		//       });
		//     }      
		//   }else{
		//     this.apiService.DINAMIC_LOGOUT(userData).subscribe(result => {
		//       localStorage.clear();
		//       sessionStorage.clear();
		//       this.router.navigate(['/']);
		//     });
		//   }

	}
	closeModal(modalName) {
		modalName.hide();
		this.router.navigate(['/']);
	}
	statusChange()
	{
		
		if(this.userService.vehicle.is_expired)
		{
			this.commonService.valetStatus = 'awaiting';
		} 
		clearInterval();
	}

}