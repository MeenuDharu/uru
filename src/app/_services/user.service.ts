import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ApiService } from '../_services/api.service';
import { resolve } from 'dns';
import { reject } from 'q';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from 'src/app/_services/common.service';
import * as moment from 'moment'; 
@Injectable({
	providedIn: 'root'
})
export class UserService {

	ord_status: any = 'Pending';
	loginErrMsg: any;
	cust: boolean = false;
	live_orders: any = [];
	orders:any=[];
	completed_orders: any = [];
	tax_details: any;
	tax_total: any = 0;
	addon_total:any = 0;
	my_tax_total: any = 0;
	awaitingcontent: string;
	confirmContent: any;
	order_number: any;
	order_id: any;
	tableName: string;
	bill_details: any;
	totalBillCost_withtax: any = 0;
	billListLength: any = 0;
	itemListLength: any = 0;
	showAwaiting: boolean = false;
	totalBillCost: any = 0;
	totalFinalBillCost:any = 0;
	bill_List: any;
	bills: any;
	confirmationStatus: boolean = false;
	placed_order_status: boolean = false;
	payment_status: string;
	showValetAgain: boolean = false;
	tax_per:any = 0;
	tax_per_cost:any = 0;
	final_cost:any = 0;
	grandTotal:any = 0;
	discount:any = 0;
	error_msg:any;	
	loginSocialDisable:boolean = true;
	continueBtn:boolean = false;
	loginDetails:any={};
	user_discount:any = 0;
	item_discount:any = 0;
	total_items:any = 0;
	totalBasicBillCost:any = 0;	
	my_service_charge:any = 0;
	payStatusText:any;
	order_status:any;
	service_charge_amount:any;
	service_charge_percentage:any;
	serviceStatus:any;
	user_name:string;
	all_bills_paid:boolean;
	usableLink:boolean = true;
	vehicle:any= [{}];
	progressPerc:any;
	pass_error:any;
	loaderStatus:boolean;
	viewStatus:string;
	confirmed_orderlist_for_bills: any = [{
		'bill_cost': 0,
		'bill_cost_gst': 0,
		'current_user': false,
		'gst': "0.00",
		'item_list': [],
		'user_id': null,
		'user_name': null,
	}];
	order_list_bill_page: any = [];
	subtotal: any = 0;
	billTotal: any = 0;
	
	service_charge:any = 0;
	billTotal_gst: any = 0;
	myshare_billTotal: any = 0;
	myshare_billTotal_gst: any = 0;
	billItems: any;
	billConfirmText: any = 'Your share payable is';
	bill_type_text: any;
	payButtonStatus: Boolean = false;
	showOrderAgain: boolean = false;
	showExit: boolean = true;
	discount_number:any = 0; 
	discount_type:any;
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	restaurant_gst: any = 0;
	restuarant_taxes: any = "";
	showOrderNow: boolean = false;
	showBillAmount: boolean = false;
	has_unassigned_item: boolean = false;
	user_placed_orders: any = [];
	total_items_count: any;
	disableBtn:boolean = false;
	bill_discount:any;
	total_cost_after_dicount:any;
	bill_type:string;
	constructor(public commonService: CommonService,private socket: Socket, private apiService: ApiService, private router: Router, public snackBar: SnackbarService, private cookieService: CookieService) {
		// this.restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
	}

	SIGNUP_OTP_VALIDATE(x) {
		return new Promise((resolve, reject) => {
			// DINAMIC SIGNUP
			this.apiService.DINAMIC_OTP_VALIDATE(x).then(signupResp => {
				console.log("signuo Resp.......", signupResp )
				if (signupResp.status) {
					// RESTAURANT LOGIN
					this.user_name = signupResp.name;
					this.restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
					let formData = {
						user_id: signupResp.id,
						social_unique_id: signupResp.id,
						name: signupResp.name,
						email: signupResp.email,
						mobile: signupResp.mobile,
						email_confirmed: signupResp.email_confirmed,
						third_party_provider: signupResp.provider,
						device_token: JSON.parse(localStorage.getItem('device_token')),
						application_type: 'web',
						device_type: localStorage.getItem('device_type')
					};
					let restData = {};
					if (localStorage.getItem("access_type") == "location") {
						console.log('table_engaged userservice.................')

						restData = {
							company_id: this.restaurant_details.company_id,
							branch_id: this.restaurant_details.branch_id,							
							floor_id: this.restaurant_details.floor_id,
							table_id: this.restaurant_details.table_id,
							customer_details: formData
						};
					}
					else {
						let orderId = this.orderIdGenerator();
						console.log('take_away userservice.................')
					//	this.socket.emit('take_away', orderId);
						restData = {
							company_id: this.restaurant_details.company_id,
							branch_id: this.restaurant_details.branch_id,
							order_id: orderId,
							customer_details: formData
						};
						localStorage.setItem("pos_order_id", orderId);
					}
					this.apiService.RESTAURANT_LOGIN(restData).then(restResp => {
						if (restResp.status) {
							this.socket.emit('table_engaged', this.restaurant_details.table_id);
							// DINAMIC SESSION
							let sessionData = {
								dinamic_details: JSON.parse(localStorage.getItem('dinamic_details')),
								customer_details: formData,
								company_id:this.restaurant_details.company_id
							};
							this.apiService.DINAMIC_ADD_SESSION(sessionData).then(sessionResp => {
								if (sessionResp.status) {
									let userForm = {
										session_id: sessionResp.dinamic_session_id,
										dinamic_user_id: restResp.userId,
										sessionStartedAt: restResp.sessionStartedAt,
										dinamic_user_name: restResp.userName,
										user_id: formData.user_id,
										email: formData.email,
										name: formData.name,
										mobile: formData.mobile,
										email_confirmed: formData.email_confirmed,
										token: restResp.token,
										reward_points: sessionResp.reward_points
									};
									localStorage.setItem('user_details', JSON.stringify(userForm));
									resolve({ status: true });
								}
								else {
									console.log('response', sessionResp);
									resolve({ status: false, message: sessionResp.message });
								}
							});
							// ********** //
						}
						else {
							console.log('response', restResp);
							resolve({ status: false, message: restResp.message });
						}
					});
					// ********** //
				}
				else {
					console.log('response', signupResp);
					resolve({ status: false, message: signupResp.message });
				}
			});
			// ********** //
		});
	}

	LOGIN(x) {
		console.log("x...................",x)
		return new Promise((resolve, reject) => {
			this.restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
			// DINAMIC LOGIN
			//this.apiService.DINAMIC_LOGIN(x).then(loginResp => {
				if (x.status) {
					// RESTAURANT LOGIN
					console.log("Login response ..", x);
					let formData = {
						user_id: x.id,
						social_unique_id: x.id,
						name: x.name,
						email: x.email,
						mobile: x.mobile,
						email_confirmed: x.email_confirmed,
						third_party_provider:x.provider,
						device_token: JSON.parse(localStorage.getItem('device_token')),
						application_type: 'web',
						device_type: localStorage.getItem('device_type')
					};
					let restData = {};
					if (localStorage.getItem("access_type") == "location") {
						console.log("table_engaged2 userservice......................")
						this.socket.emit('table_engaged', this.restaurant_details.table_id);
						restData = {
							company_id: this.restaurant_details.company_id,
							branch_id: this.restaurant_details.branch_id,
							floor_id: this.restaurant_details.floor_id,
							table_id: this.restaurant_details.table_id,
							customer_details: formData
						};
					}
					else {
						let orderId = this.orderIdGenerator();
						console.log("take_away2 userservice......................")
						//this.socket.emit('take_away', orderId);
						
						restData = {
							company_id: this.restaurant_details.company_id,
							branch_id: this.restaurant_details.branch_id,
							order_id: orderId,
							customer_details: formData
						};
						localStorage.setItem("pos_order_id", orderId);
						this.takeAway_emit()
					}
					this.apiService.RESTAURANT_LOGIN(restData).then(restResp => {
						if (restResp.status) {
							// DINAMIC SESSION
							let sessionData = {
								dinamic_details: JSON.parse(localStorage.getItem('dinamic_details')),
								customer_details: formData,
								company_id:this.restaurant_details.company_id
							};
							this.apiService.DINAMIC_ADD_SESSION(sessionData).then(sessionResp => {
								if (sessionResp.status) {
									let userForm = {
										session_id: sessionResp.dinamic_session_id,
										user_id: formData.user_id,
										dinamic_user_id: restResp.userId,
										sessionStartedAt: restResp.sessionStartedAt,
										dinamic_user_name: restResp.userName,
										email: formData.email,
										name: formData.name,
										mobile: formData.mobile,
										email_confirmed: formData.email_confirmed,
										token: restResp.token,
										reward_points: sessionResp.reward_points
									};
									localStorage.setItem('user_details', JSON.stringify(userForm));
									resolve({ status: true });
								}
								else {
									console.log('response', sessionResp);


									resolve({ status: false, message: sessionResp.message });
								}
							});
							// ********** //
						}
						else {
							console.log('response', restResp);
							resolve({ status: false, message: restResp.message });
						}
					}).catch((err) => {
						console.log("login error........................", err)
						if (err.status === 401) {
							console.log('error ------------', err);
		
							// let openModal: HTMLElement = this.openModal.nativeElement as HTMLElement;
							// openModal.click();
							document.getElementById("newOTPModal").click();
							document.getElementById("alertDetailsModal").click();
							this.loginErrMsg = err.error.error;
							this.tableName = err.error.table_name
							console.log(this.tableName)
							// alert('User already logged in another table');
		
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
						}
					});
					// ********** //
				}
				else {
					console.log('response', x);
					resolve({ status: false, message: 'Invalid user' });
				}
			//});
			// ********** //
		});
	}

takeAway_emit()
{
	this.cookieService.delete('socket_rooms', '/', '.dinamic.io', true, 'Strict');
	// 	this.order_id = localStorage.getItem('pos_order_id');
	// if(localStorage.getItem('pos_order_id'))
	// {
	// 	this.socket.emit("take_away", this.order_id);
	// }
	// this.apiService.GET_ALL_MY_ORDERS().subscribe(result => {
	// 	console.log("All my orders.....", result);
	// 		if (result.orders) {						
	// 			this.live_orders = [];
	// 			this.orders = result.orders;
	// 			let order_id = {};
	// 			result.orders.forEach(element => {

	// 				if (element.is_live) {
	// 					if(localStorage.getItem('pos_order_id'))
	// 					{	
	// 						if(element.order_id != localStorage.getItem('pos_order_id'))
	// 						{
	// 							this.socket.emit("take_away", element.order_id);
	// 						}										
	// 					}
	// 					else
	// 					{
	// 						this.socket.emit("take_away", element.order_id);
	// 					}
	// 				this.orders.order_id = element.order_id;
	// 					this.live_orders.push(element);						
	// 				} 
	// 			});

	// 		}

	// 	})

	// 	console.log("this.orders..............", this.orders)
}

	USER_EMAIL_CHECK(x) {
		return new Promise((resolve, reject) => {

			this.apiService.DINAMIC_LOGIN_EMAIL(x).then(loginResp => {

				if (loginResp.status) {
					// RESTAURANT LOGIN
					console.log("Login response ..", loginResp);
					resolve(loginResp);
				}
				else {
					console.log('response', loginResp);
					resolve({ status: false, message: loginResp.message });
				}

			})

		})

	}



	SOCIAL_APP_LOGIN(userData) {
		return new Promise((resolve, reject) => {
			// RESTAURANT LOGIN
			this.restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
			// console.log('this.restaurant_details...', JSON.parse(localStorage.getItem('restaurant_details')))

			let formData = {
				user_id: userData.id,
				social_unique_id: userData.id,
				name: userData.name,
				email: userData.email,
				mobile: userData.mobile,
				email_confirmed: false,
				third_party_provider: userData.provider,
				device_token: JSON.parse(localStorage.getItem('device_token')),
				application_type: 'web',
				device_type: localStorage.getItem('device_type'),
				company_id: this.restaurant_details.company_id,
				branch_id: this.restaurant_details.branch_id,	
			};

			let restData = {};

			if (localStorage.getItem("access_type") == "location") {
				console.log('table engaged user service----------------------------------------', this.restaurant_details.table_id);
				this.socket.emit('table_engaged', this.restaurant_details.table_id);
				restData = {
					company_id: this.restaurant_details.company_id,
					branch_id: this.restaurant_details.branch_id,					
					floor_id: this.restaurant_details.floor_id,
					table_id: this.restaurant_details.table_id,
					customer_details: formData
				};
				console.log('location resp data............', restData)
			}
			else {
				let orderId = this.orderIdGenerator();
				console.log("take_away3 userservice......................")
				//this.socket.emit('take_away', orderId);
				
				restData = {
					company_id: this.restaurant_details.company_id,
					branch_id: this.restaurant_details.branch_id,					
					order_id: orderId,
					customer_details: formData
				};
				localStorage.setItem("pos_order_id", orderId);
				this.takeAway_emit();
			}

			this.apiService.RESTAURANT_LOGIN(restData).then(restResp => {
				console.log('restuarent login....................', restResp)
				console.log('dinamic_user_id....................', restResp.userId)
				if (restResp.status) {


					// DINAMIC SESSION
					let sessionData = {
						dinamic_details: JSON.parse(localStorage.getItem('dinamic_details')),
						customer_details: formData,
						company_id:this.restaurant_details.company_id
					};

					console.log("seeion data..........", sessionData)
					this.apiService.DINAMIC_ADD_SESSION(sessionData).then(sessionResp => {
						console.log("sessionResp...........", sessionResp)
						if (sessionResp.status) {
							let userForm = {
								user_id: formData.user_id,
								dinamic_user_id: restResp.userId,
								dinamic_user_name: restResp.userName,
								sessionStartedAt: restResp.sessionStartedAt,
								session_id: sessionResp.dinamic_session_id,
								email: formData.email,
								name: formData.name,
								mobile: formData.mobile,
								email_confirmed: formData.email_confirmed,
								photo_url: userData.photoUrl,
								token: restResp.token,
								reward_points: sessionResp.reward_points
							};
							localStorage.setItem('user_details', JSON.stringify(userForm));

							resolve({ status: true });

						}
						else {
							console.log('response user..............', sessionResp);
							resolve({ status: false, message: sessionResp.message });
						}
					});
					// ********** //
				}
				else {
					console.log('response user2...........', restResp);
					resolve({ status: false, message: restResp.message });
				}
			}).catch((err) => {
				console.log("login error........................", err)
				if (err.status === 401) {
					console.log('error ------------', err);

					// let openModal: HTMLElement = this.openModal.nativeElement as HTMLElement;
					// openModal.click();
					document.getElementById("newOTPModal").click();
					document.getElementById("alertDetailsModal").click();
					this.loginErrMsg = err.error.error;
					this.tableName = err.error.table_name
					console.log(this.tableName)
					// alert('User already logged in another table');

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
				}
			});
			// ********** //
		});
	}

	CART_LENGTH() {
		return new Promise((resolve, reject) => {
			let cart = JSON.parse(localStorage.getItem('cart'));
			if (!cart) { cart = []; }
			resolve(cart.length);
		});
	}

	CART_DETAILS() {
		let cartItems = 0;
		let cartTotal = 0;
		let cart = JSON.parse(localStorage.getItem('cart'));
		if (!cart) { cart = []; }
		let tax
		for (let i = 0; i < cart.length; i++) {
		
			cartItems += cart[i].quantity;
			cartTotal += (cart[i].sold_price * cart[i].quantity);
	
	
		
		}
		
		
		let newtax= this.taxcalc(cart);
		console.log("newtax....................",newtax)
		tax = newtax.reduce((a, b) => a + b.item_gst_price, 0);
		console.log("userService Tax.......................", tax)
		

		return { cart_items: cartItems, cart_total: cartTotal, tax: tax }
	}


	taxcalc(item) {
		console.log("item.................")
		let item_details_array = item.map((order) => order);
		console.log("item_details_array.....................",item_details_array)
	
			let all_item_list = item_details_array.flat(Infinity);

		
			let tax_rates = all_item_list.map((item) => {
					let new_tax_rates
				if(item.tax_rates)
				{
					new_tax_rates = item.tax_rates.filter((tax) => {
						console.log('type of tax.value  --------', typeof (tax.percentage))
						console.log('tax.percentage  --------', tax.percentage)
						console.log('tax.checked  --------', tax.checked)
						if (tax.checked == true) {
							tax.item_price = item.sold_price * item.quantity;
							tax.item_gst_price = (item.sold_price * item.quantity) * (tax.percentage / 100);
							console.log(tax)
							return tax
						} else {
							console.log('false')
							return false
						}
					})
					console.log('new_tax_rates', new_tax_rates)
					return new_tax_rates;
				}
			
			})
			let data =  tax_rates.filter(function( element ) {
				return element !== undefined;
			 });
			 console.log("tax_rates_array1..............................",data);
		
			let tax_rates_array = data.flat(Infinity);
			console.log("tax_rates_array..............................",tax_rates_array);
			
			let result2 = [];
			tax_rates_array.reduce(function (res, value) {
				console.log('value ---------', value)
			
					if (!res[value.tax_type]) {
						// res[value.name] = { name: value.name, item_gst_price: 0,  tax_percentage: value.value };
						res[value.tax_type] = { tax_type: value.tax_type, item_gst_price: 0, tax_percentage: value.percentage };
						result2.push(res[value.tax_type])
					}
					res[value.tax_type].item_gst_price += value.item_gst_price;
					console.log('res ----------', res)
					return res;

			
			
			}, {});
			console.log('result2 ----------', result2)
			return result2
	


	}

	ORDER_STATUS() {
		return localStorage.getItem('order_status');
	}

	PAYMENT_STATUS() {
		if (localStorage.getItem('restaurant_details')) {
			let orderData = {
				"order_details": {
					"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
					// "item_details": JSON.parse(localStorage.getItem('cart')),   
				}
			}
			//console.log("userservice order data..................................",JSON.parse(localStorage.getItem('restaurant_details')));

			if (orderData.order_details.order_type == 'in_house') {
				localStorage.getItem('payment_status');
				this.payment_status = localStorage.getItem('payment_status');
				let orderstatus = "confirmed";
				return localStorage.getItem('payment_status');

			} else {
				return localStorage.getItem('payment_status');
			}
		}


	}

	orderIdGenerator() {
		let now = new Date();
		let timestamp = now.getFullYear().toString();
		timestamp += (now.getMonth() < 9 ? '0' : '') + now.getMonth().toString();
		timestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString();
		timestamp += (now.getHours() < 10 ? '0' : '') + now.getHours().toString();
		timestamp += (now.getMinutes() < 10 ? '0' : '') + now.getMinutes().toString();
		timestamp += (now.getSeconds() < 10 ? '0' : '') + now.getSeconds().toString();
		timestamp += (now.getMilliseconds() < 10 ? '0' : '') + now.getMilliseconds().toString();
		return `TA${timestamp}`;
	}

	SET_ORDER_STATUS(x) {
		console.log('value of --------------', x)
		this.ord_status = x;
	}

	ORDER_AGAIN() {
		return new Promise((resolve, reject) => {
			let orderId = this.orderIdGenerator();
			console.log("order id...", orderId);
			this.socket.emit('take_away', orderId);
			console.log("order again......................")
			localStorage.setItem("pos_order_id", orderId);
		});
	}

	SET_PLACED_ORDER_STATUS() {
		this.placed_order_status = false;
	}


	SAVE_SOCIAL_USER(userData) {
		return new Promise((resolve, reject) => {
			this.apiService.CREATE_SOCIAL_LOGIN_USER(userData).then(result => {
				console.log('SAVE_SOCIAL_USER....', result);
				if (result.status) {
					console.log(result);
					resolve(result);
				}
			})
		})
	}


	UPDATE_USER(userData) {
		return new Promise((resolve, reject) => {
			this.apiService.UPDATE_EXISTING_USER(userData).then(result => {
				console.log('SAVE_SOCIAL_USER....', result);
				if (result.status) {
					console.log(result);
					resolve(result);
				}
				else
				{
					console.log("error...")
				}
			
			})
		})
	}





}