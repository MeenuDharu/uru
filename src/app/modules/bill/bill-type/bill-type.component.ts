import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../_services/api.service';
import { UserService } from 'src/app/_services/user.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { WindowRef } from '../../../_services/winref.service';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
import { PlatformLocation, CurrencyPipe } from '@angular/common'
declare var Razorpay: any;

declare var Instamojo: any;

@Component({
	selector: 'app-bill-type',
	templateUrl: './bill-type.component.html',
	styleUrls: ['./bill-type.component.css']
})
export class BillTypeComponent implements OnInit {
	razorpayOptions: any = {
		"key": "rzp_test_CQibMXqHAMXLLN",
		"name": "DiNAMIC",
		"description": "Restaurant Application",
		"modal": { "ondismiss": () => { } }
	  };
	  restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	  service_charge:any = 0;
	my_service_charge:any;
	otpForm: any = {};
	cart: any = []; loaderStatus: boolean = true;
	user_discount:any;
	discount:any;
	order_bill_cost:any;
	altered_order_list: any = [{
		'bill_cost': 0,
		'bill_cost_gst': 0,
		'current_user': false,
		'gst': "0.00",
		'item_list': [],
		'user_id': null,
		'user_name': null,
	}];

	order_list: any = []; billItems; billTotal; locationBased: boolean;
	order_number: any;
	billTotal_gst: any;
	dinamic_details: any = JSON.parse(localStorage.getItem('dinamic_details'));
	restaurant_gst: any = JSON.parse(localStorage.getItem('restaurant_details')).gst;



	split_count = 2;
	table_total: any;
	table_total_gst: number;
	my_bill: any;
	my_share_bill: any = {};
	bill_type: string; split_share: any;
	split_share_gst: any;
	user_details = JSON.parse(localStorage.getItem('user_details'));
	pay_mode: any = 'cash';
	hastableorder_type: String;

	constructor(private router: Router, private apiService: ApiService, public userService: UserService, public snackBar: SnackbarService,private winRef: WindowRef,private browserService:UserBrowserService, private cp: CurrencyPipe) { }

	ngOnInit() {


		this.hastableorder_type = localStorage.getItem('hastableorder');


		//Bill-view
		this.userService.restaurant_gst = JSON.parse(localStorage.getItem('restaurant_details')).gst;
		this.userService.restuarant_taxes = JSON.parse(localStorage.getItem('restaurant_details')).restaurant_tax;

		console.log('GST......', this.userService.restaurant_gst);
		this.cart = JSON.parse(localStorage.getItem('cart'));
		if (!this.cart) { this.cart = []; }
		console.log(this.dinamic_details.table_type);
		if (this.cart.length) {
			this.loaderStatus = false;
			// CART
			this.router.navigate(['/cart/bill']);
		}
		else {
			// ORDER DETAILS
			// this.loaderStatus = true;
			this.userService.billItems = 0; this.billTotal = 0;
			if (this.dinamic_details.table_type == "location") this.locationBased = true;

			let userDetails = JSON.parse(localStorage.getItem('user_details'));

			console.log("userDetails", userDetails)
			let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
			// this.userService.restaurant_gst = this.restaurant_gst;

			if (orderType == 'in_house') {
				if (userDetails) {
					this.apiService.PLACED_ORDERS().subscribe(result => {

						this.loaderStatus = false;
						console.log("placed orders....", result);

						if (result.status) {
							if (result.orders.order_list.length) {
								this.order_number = result.orders.order_number;
								console.log("orders found....", this.order_number);
								this.userService.placed_order_status = true;
							} else {
								this.userService.placed_order_status = false;
							}
						}
					});

					this.apiService.GET_BILL().subscribe(result => {
						console.log('oms bills.....', result);
						if (result.status) {

							let bills = result.bills.bills;
							let check_currentuser_ordered = bills.filter(ss => ss.orderer_name != userDetails.name);
							console.log('bills....', check_currentuser_ordered);

							if (check_currentuser_ordered.length) {
								this.userService.showOrderNow = true;
								// this.snackBar.BILLSETTLEMENTINPROGRESS('Bill settlement in progress.', 'OKAY');
								this.router.navigate(['bill/confirm']);
							} else {
								// this.snackBar.BILLSETTLEMENTINPROGRESS('Bill settlement in progress.', 'OKAY');
								this.router.navigate(['bill/confirm']);
								this.userService.showOrderNow = true;
							}
						} else {
							this.userService.showOrderNow = false;
						}
					})
				} else {
					this.userService.placed_order_status = false;
				}
			} else {
				this.userService.placed_order_status = false;
				this.loaderStatus = false;
			}

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


					this.userService.grandTotal = result.orders.grand_total;
					this.userService.service_charge_amount = result.orders.service_charge_amount ? result.orders.service_charge_amount : 0;
				    this.userService.service_charge_percentage = result.orders.service_charge_percentage ? result.orders.service_charge_percentage : 0;
					if(result.orders.item_discounts && result.orders.item_discounts.total_items  && result.orders.item_discounts.total_items != 0)
					{
						this.userService.item_discount = result.orders.item_discounts.total_discount
					}
					else
					{
						this.userService.item_discount = 0;
					}
					
					let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
					console.log("service charge..............", restaurant_details.service_charge)
					if(localStorage.getItem("service_status") === "false")
					{
						this.userService.service_charge = 0;
					}
					else
					{
						if (restaurant_details.service_charge != '0') {
							let service_charge = Number(restaurant_details.service_charge) / 100
							console.log("service charge1..............", result.orders.final_cost)
							this.userService.service_charge = (service_charge * result.orders.final_cost);
							console.log("service Charge...........................", this.userService.service_charge)
						}
						else {
							this.userService.service_charge = 0;
						}
					}
					
					
					

					this.userService.order_list_bill_page = result.orders.order_list;
					console.log("-----------", this.userService.order_list_bill_page)

					let item_details_array = this.userService.order_list_bill_page.map((order,i) => {
						console.log("order.user_id------------------------", result.orders.order_discount.order_number);
						// (price of the item / total price) * discount

						this.order_bill_cost = Number(order.bill_cost);
						this.discount = result.orders.order_discount;
						
						this.userService.my_service_charge = (Number(order.bill_cost)/Number(result.orders.total_cost))*Number(this.userService.service_charge_amount);
						console.log("my_service_charge ************ ",this.userService.my_service_charge)
						
						if(result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number)
						{
							this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.order_discount.discount_number);						
						}
						else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number)
						{
							this.user_discount = (Number(order.bill_cost))*(Number(result.orders.order_discount.discount_number/100));							
						}
						else if(result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number)
						{
							this.user_discount = (Number(order.bill_cost)/Number(result.orders.total_cost-this.userService.item_discount))*Number(result.orders.total_cost-(result.orders.order_discount.discount_number+this.userService.item_discount));
							
						}
						else if(result.orders.order_discount &&  result.orders.order_discount.discount_type === 'flat')
						{

							this.user_discount = (Number(order.bill_cost));
						
						}
						else{
							this.user_discount = 0;
						
						}

					   console.log("user_discount--------------------------",this.user_discount)
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

									
						this.userService.tax_total = this.userService.tax_details.reduce((a, b) => a + b.item_gst_price, 0)

					console.log("tax_total---------------------", parseFloat(this.userService.tax_total).toFixed(2));
					
					this.userService.order_list_bill_page.forEach((element, i) => {
						// this.altered_order_list[0].item_list.push(element.item_list[0]);  
						console.log("ele-------------", element);
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
						console.log("userservice ************************", this.userService.order_list_bill_page[i]);

						this.my_share_bill.billTotal = 0;
						this.my_share_bill.billTotal_gst = 0;
						this.my_share_bill.user_name = userDetails.dinamic_user_name;
						if (this.userService.order_list_bill_page[i].current_user) {
							console.log("currentuser", this.userService.order_list_bill_page[i].current_user);
							this.my_share_bill.user_name = this.userService.order_list_bill_page[i].user_name;
							this.userService.myshare_billTotal = this.userService.order_list_bill_page[i].bill_cost;
							this.userService.myshare_billTotal_gst = (this.userService.myshare_billTotal-this.userService.order_list_bill_page[i].user_discount) + this.userService.order_list_bill_page[i].my_tax_total+this.userService.order_list_bill_page[i].my_service_charge ;
						}

						console.log("mysharetotal", this.userService.myshare_billTotal_gst)


						this.userService.order_list_bill_page[i].gst = ((this.userService.restaurant_gst / 100) * this.userService.order_list_bill_page[i].bill_cost).toFixed(2);
						this.userService.billTotal += this.userService.order_list_bill_page[i].bill_cost;
						this.userService.billTotal_gst = (this.userService.billTotal- this.userService.order_list_bill_page[i].user_discount) + this.userService.tax_total;
						this.table_total = this.userService.billTotal_gst;
						console.log(this.userService.billTotal_gst, "bill_gst .................");

						let itemList = this.userService.order_list_bill_page[i].item_list;
						for (let j = 0; j < itemList.length; j++) {
							this.userService.billItems += itemList[j].quantity;
						}
					}



					//bill_type

					if (this.my_share_bill) {
						this.bill_type = 'my_share';
						// console.log('****', this.userService.has_unassigned_item)
						// this.my_bill['bill_cost_gst'] = Math.round(this.my_bill.bill_cost + this.my_bill.bill_cost * (this.userService.restaurant_gst/100));
						this.my_share_bill['bill_cost_gst'] = this.my_share_bill.billTotal_gst;
						// localStorage.getItem(hastableorder);
						if (this.hastableorder_type === "true") {
							this.userService.has_unassigned_item = true;
						}
						else {
							this.userService.has_unassigned_item = false;
						}
						if (!this.userService.has_unassigned_item) {

						} else {
							this.bill_type = 'split_equal';
						}
					}
					else
						this.bill_type = 'split';
					this.split_share = +(this.userService.grandTotal / this.split_count).toFixed(2);
					// this.split_share_gst = Math.round(this.split_share + this.split_share * (this.userService.restaurant_gst/100));
					this.split_share_gst = this.split_share;


					console.log("hastableorder_type------------------------------", this.hastableorder_type);
					// this.table_total_gst = Math.round(this.table_total + this.table_total * (this.userService.restaurant_gst/100)); 
					this.table_total_gst = this.userService.billTotal_gst;
					console.log("my bill....**************---------------------", this.my_bill)


				}
				else {
					this.userService.order_list_bill_page = [];
					console.log('response----------------------', result);
				}
				// setTimeout(() => { this.loaderStatus = false; }, 500);
			});
		}




	}

	decUserCount() {
		this.split_count = this.split_count - 1;
		this.split_share = +(Number(this.userService.grandTotal) / this.split_count).toFixed(2);
		// this.split_share_gst = Math.round(this.split_share + this.split_share * (this.userService.restaurant_gst/100));
		this.split_share_gst = this.split_share;
	}
	incUserCount() {
		this.split_count = this.split_count + 1;
		this.split_share = +(Number(this.userService.grandTotal) / this.split_count).toFixed(2);
		// this.split_share_gst = Math.round(this.split_share + this.split_share * (this.userService.restaurant_gst/100));
		this.split_share_gst = this.split_share;
	}

	onViewBill() {
		this.router.navigate(['/bill/view']);
	}

	onBillConfirm() {
		this.loaderStatus = true;
		let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"));		
		this.service_charge = 0;

		if(localStorage.getItem("service_status") == "false") 
		{
			this.service_charge = 0;
		}
		else
		{
			this.service_charge = restaurant_details.service_charge ? restaurant_details.service_charge : 0
		}
		let sendData = {
			"dinamic_details": JSON.parse(localStorage.getItem('dinamic_details')),
			"bill_details": {
				"bill_type": this.bill_type,
				"bill_count": this.split_count, 			
				"service_charge_percentage": this.service_charge
			}
		}

		console.log('bill details....', sendData)
		
		this.apiService.DINAMIC_BILL_CONFIRM(sendData).subscribe(result => {
			console.log("result status..............",result.status)
			if (result.status) {
		     this.router.navigate(['/bill/confirm']);
			}
			else {
				console.log('response', result);
			}
		});
	}


	// payOnline() {
	// 	let userDetails = JSON.parse(localStorage.getItem('user_details'));
	// 	let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'))
	// 	console.log("service charge..............", restaurant_details.service_charge)


	// 	this.cart = JSON.parse(localStorage.getItem('cart'));
	// 	if (!this.cart) { this.cart = []; }
	// 	let cartDetails = this.userService.CART_DETAILS();
	// 	console.log("cart Details......................", cartDetails)


	// 	// this.tax = Math.round(cartDetails.cart_total * (this.userService.restaurant_gst/100));
	// 	this.tax =  cartDetails.tax;			
	// 	this.cartItems = cartDetails.cart_items;
	// 	this.cartTotal = cartDetails.cart_total;
	// 	this.cartTax = cartDetails.tax;
	// 	this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
	// 	this.showlabel = true;

	// 	if (restaurant_details.service_charge != '0') {
	// 		let service_charge = Number(restaurant_details.service_charge) / 100
	// 		console.log("service charge1..............", cartDetails.cart_total)
	// 		this.userService.service_charge = (service_charge * cartDetails.cart_total);
	// 		console.log("service Charge...........................", this.userService.service_charge)
	// 	}
	// 	else {
	// 		this.userService.service_charge = 0;
	// 	}

	// 	console.log("payonline", userDetails)
	// 	let orderData = {
	// 		"order_details": {
	// 			"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
	// 			"item_details": JSON.parse(localStorage.getItem('cart')),
	// 		},
	// 		"cart_total": Math.round(this.cartTotal + this.cartTax + this.userService.service_charge ),
	// 		"email": this.userDetails.email,
	// 		"name": this.userDetails.dinamic_user_name,
	// 		"mobile": this.userDetails.mobile,
	// 		"order_number": '0000'
	// 	};
	// 	console.log("orderdata.........", orderData)



	// 	this.apiService.CONFIRM_PAYMENT(orderData).subscribe(result => {
	// 		console.log("payment result...........", result)
	// 		if(result.status)
	// 		{
	// 			// let storeOrderId = result.data.order_id;
	// 			let razoypayOrderId = result.data.razorpay_response.id;
	// 			// razorpay response handler
	// 			this.razorpayOptions.handler = (response) => {
	// 				let paymentId = response.razorpay_payment_id;
	// 				window.location.href = "https://care.dinamic.io/#/checkout/payment-confirm?payment_request_id="+paymentId;
	// 			};
	// 			this.razorpayOptions.order_id = razoypayOrderId;
	// 			// open razorpay modal
	// 			new this.winRef.nativeWindow.Razorpay(this.razorpayOptions).open();
	// 		}
	// 		// if (result.status) {
	// 		// 	//Generate order id here for every order , get and set the token for POS...
	// 		// 	//set the token - localstorage(user_details).token

	// 		// 	this.apiService.GET_ORDER_ACCESS_TOKEN().subscribe(result => {
	// 		// 		if (result.status) {
	// 		// 			console.log("New Token.....", result.token);
	// 		// 			let new_obj = JSON.parse(localStorage.getItem('user_details'));
	// 		// 			new_obj.token = result.token;
	// 		// 			localStorage.setItem('user_details', JSON.stringify(new_obj));
	// 		// 		}
	// 		// 	})

	// 		// 	localStorage.setItem('current_user_order_id', '<To be Generated>');

	// 		// 	localStorage.setItem('payment_status', 'raised');
	// 		// 	// this.router.navigate([result.data.payment_url]);
	// 		// 	// window.open(result.data.payment_url, "_self");
	// 		// 	this.payment_url = result.data.payment_url
	// 		// 	console.log("url....", this.payment_url)
	// 		// 	window.open(this.payment_url, "_self");
	// 		// 	//   Instamojo.open(result.data.payment_url); 

	// 		// } else {
	// 		// 	console.log('response', result);
	// 		// }

	// 	})

	// }

	paymode_change() {
		console.log("payment mode....", this.pay_mode);
	}

	onBillPayment(modeOfPay) {

		console.log("modeOfPay***********", modeOfPay)
		if (modeOfPay == 'cash') {
		//	this.onBillConfirm();
		} else {
			// Instamojo payment....
			console.log('Instamojo setting up....');
			let sendData = {
				"dinamic_details": JSON.parse(localStorage.getItem('dinamic_details')),
				"bill_details": {
					"bill_type": this.bill_type,
					"bill_count": this.split_count
				}
			}
		
			console.log("sendData****************", sendData);
	
			this.apiService.DINAMIC_BILL_CONFIRM(sendData).subscribe(result => {
				console.log('dinamic Bill confirm.............', result)
				if (result.status) {
					console.log('Bills for payment....', result);
					console.log('my bill for payment....', this.my_bill);
					let amount = '780';

					let orderData = {
						"order_details": {
							"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
							"item_details": JSON.parse(localStorage.getItem('cart')),
						},
						"cart_total": amount,
						"email": this.user_details.email,
						"name": this.user_details.dinamic_user_name,
						"mobile": this.user_details.mobile,
						"order_number": '0000'
					};
					console.log("orderdata.........", orderData);		

					this.apiService.CONFIRM_PAYMENT(orderData).subscribe(results => {
						console.log('response....', results);
						if (results.status) {
							let razoypayOrderId = result.data.razorpay_response.id;
				// razorpay response handler
				this.razorpayOptions.handler = (response) => {
					let paymentId = response.razorpay_payment_id;
					window.location.href = "https://localhost:4200/#/checkout/payment-confirm?payment_request_id="+paymentId;
				};
				this.razorpayOptions.order_id = razoypayOrderId;
				// open razorpay modal
				new this.winRef.nativeWindow.Razorpay(this.razorpayOptions).open();
						} else {
							console.log('response...', results)
						}
					})
				}
			})
		}
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


}