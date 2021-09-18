import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../_services/api.service';
import { UserService } from 'src/app/_services/user.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { UserBrowserService } from 'src/app/_services/user-browser.service';

@Component({
	selector: 'app-bill-view',
	templateUrl: './bill-view.component.html',
	styleUrls: ['./bill-view.component.css']
})
export class BillViewComponent implements OnInit {
	@ViewChild('scrollMe', { static: false }) scrollMe: ElementRef;
	disableScrollDown = false;
	awaitingcontent: any;
	index: any;
	cart: any = []; loaderStatus: boolean = true;
	user_discount: any;
	discount: any;
	final_cost: any = 0;
	my_service_charge: any;
	order_bill_cost: any;
	disableBtn: boolean = false;
	altered_order_list: any = [{
		'bill_cost': 0,
		'bill_cost_gst': 0,
		'current_user': false,
		'gst': "0.00",
		'item_list': [],
		'user_id': null,
		'user_name': null,
	}];
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	order: any;
	showlabel: boolean = true;
	restaurantDetails: any = JSON.parse(localStorage.getItem('restaurant_details'));
	customer_editable_sc: any = this.restaurantDetails.customer_editable_sc;
	serviceStatus: any;

	order_list: any = []; billItems; billTotal; locationBased: boolean;
	billTotal_gst: any;
	dinamic_details: any = JSON.parse(localStorage.getItem('dinamic_details'));
	restaurant_gst: any = JSON.parse(localStorage.getItem('restaurant_details')).gst;
	constructor(private router: Router, private apiService: ApiService, public userService: UserService, public snackBar: SnackbarService, private browserService: UserBrowserService) { }



	onScroll() {
		let element = this.scrollMe.nativeElement
		let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
		if (this.disableScrollDown && atBottom) {
			this.disableScrollDown = false
			console.log("false")
		} else {
			this.disableScrollDown = true;
			console.log("true")
		}
	}


	ngOnInit() {
		console.log("Has uunassigned item--------------------", this.userService.has_unassigned_item)
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
								this.userService.placed_order_status = true;
								this.userService.order_number = result.orders.order_number;
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
										this.userService.awaitingcontent = "Placed by You";
									}
									else {
										this.userService.awaitingcontent = "Placed by " + placedUserName;
									}
								}

								else {
									let otherUserName = (result.orders.order_list[this.index].user_name.split(' ').length) >= 2 ? result.orders.order_list[this.index].user_name.split(' ')[0] : result.orders.order_list[this.index].user_name
									if (orderListLength === 2) {

										if (user_Status.length) {
											this.userService.awaitingcontent = "Placed by You and " + otherUserName
										}
										else {
											this.userService.awaitingcontent = "Placed by " + otherUserName + " and " + (orderListLength - 1) + " other";
										}
									}
									else {
										if (user_Status.length) {
											this.userService.awaitingcontent = "Placed by You and " + (orderListLength - 1) + " others";
										}
										else {
											this.userService.awaitingcontent = "Placed by " + otherUserName + " and " + (orderListLength - 1) + " others";
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
								//this.snackBar.BILLSETTLEMENTINPROGRESS('Bill settlement in progress.', 'OKAY');
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
					this.order = result.orders;
					this.userService.grandTotal = result.orders.grand_total;
					this.userService.service_charge_amount = result.orders.service_charge_amount ? result.orders.service_charge_amount : 0;
					this.userService.service_charge_percentage = result.orders.service_charge_percentage ? result.orders.service_charge_percentage : 0;
					this.userService.total_cost_after_dicount = result.orders.total_cost_after_dicount ? result.orders.total_cost_after_dicount : 0;
					if (result.orders.item_discounts && result.orders.item_discounts.total_items && result.orders.item_discounts.total_items != 0) {
						this.userService.item_discount = result.orders.item_discounts.total_discount
					}
					else {
						this.userService.item_discount = 0;
					}

					if (result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number) {
						this.userService.bill_discount = result.orders.order_discount.discount_number;

					}
					else if (result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number) {
						this.userService.bill_discount = (Number(result.orders.total_cost - this.userService.item_discount)) * (Number(result.orders.order_discount.discount_number / 100));
						this.userService.discount_type = result.orders.order_discount.discount_type;
						this.userService.discount_number = result.orders.order_discount.discount_number + "%";
					}
					else if (result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number) {
						this.userService.bill_discount = Number(result.orders.total_cost - (result.orders.order_discount.discount_number + this.userService.item_discount));
						this.userService.discount_type = result.orders.order_discount.discount_type;
						this.userService.discount_number = Number(result.orders.total_cost - (result.orders.order_discount.discount_number));
					}
					else if (result.orders.order_discount && result.orders.order_discount.discount_type === 'flat') {

						this.userService.bill_discount = (Number(result.orders.total_cost - this.userService.item_discount));
						this.userService.discount_type = result.orders.order_discount.discount_type;
						this.userService.discount_number = "100%";
					}
					else {
						this.userService.bill_discount = 0;
						this.userService.discount_type = "none";
						this.userService.discount_number = 0;
					}


					console.log("this.userService.item_discount-----------------", this.userService.item_discount)
					if (this.customer_editable_sc) {
						console.log("this.customer_editable_sc.............", this.customer_editable_sc)
						if (result.orders.is_applied_service_charge === true) {
							localStorage.setItem("service_status", "true");
							this.userService.serviceStatus = true;
							console.log("this.userService.serviceStatus .............", this.userService.serviceStatus)
						}
						else {
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

					let item_details_array = this.userService.order_list_bill_page.map((order, i) => {
						console.log("order.user_id------------------------", result.orders.order_discount.order_number);
						// (price of the item / total price) * discount

						this.order_bill_cost = Number(order.bill_cost);
						this.discount = result.orders.order_discount;
						console.log("order..............", order)

						this.userService.my_service_charge = (Number(order.bill_cost) / Number(result.orders.total_cost - this.userService.item_discount)) * Number(result.orders.service_charge_amount);
						console.log("my_service_charge ************ ", this.userService.my_service_charge);

						console.log("order_bill_cost************", order.bill_cost, "total cost......", result.orders.total_cost)

						if (result.orders.order_discount && result.orders.order_discount.discount_type === 'amount' && result.orders.order_discount.discount_number) {
							this.user_discount = (Number(order.bill_cost) / Number(result.orders.total_cost - this.userService.item_discount)) * Number(result.orders.order_discount.discount_number);
							this.userService.discount_type = result.orders.order_discount.discount_type;
							this.userService.discount_number = result.orders.order_discount.discount_number;
						}
						else if (result.orders.order_discount && result.orders.order_discount.discount_type === 'percentage' && result.orders.order_discount.discount_number) {
							this.user_discount = (Number(order.bill_cost)) * (Number(result.orders.order_discount.discount_number / 100));
							this.userService.discount_type = result.orders.order_discount.discount_type;
							this.userService.discount_number = result.orders.order_discount.discount_number + "%";
						}
						else if (result.orders.order_discount && result.orders.order_discount.discount_type === 'new_value' && result.orders.order_discount.discount_number) {
							this.user_discount = (Number(order.bill_cost) / Number(result.orders.total_cost - this.userService.item_discount)) * Number(result.orders.total_cost - (result.orders.order_discount.discount_number + this.userService.item_discount));
							this.userService.discount_type = result.orders.order_discount.discount_type;
							this.userService.discount_number = Number(result.orders.total_cost - (result.orders.order_discount.discount_number + this.userService.item_discount));
						}
						else if (result.orders.order_discount && result.orders.order_discount.discount_type === 'flat') {

							this.user_discount = (Number(order.bill_cost));
							this.userService.discount_type = result.orders.order_discount.discount_type;
							this.userService.discount_number = "100%";
						}
						else {
							this.user_discount = 0;
							this.userService.discount_type = "none";
							this.userService.discount_number = 0;
						}

						console.log("user_discount--------------------------", this.user_discount)
						let sub_total = order.item_list.reduce((a, b) => a + (b.selling_price * b.quantity), 0)
						console.log("subtotal............", sub_total);

						//let all_item_list1 = item_details_array.flat(Infinity);

						let addon_rates = order.item_list.map((item) => {
							console.log("Items of addon.......", item)
							let new_addon_rates = item.addons.filter((addon) => {
								console.log('type of tax.value  --------', addon.addon_price)
								console.log('tax.percentage  --------', addon.addon_quantity)
								//	console.log('tax.checked  --------', tax.checked)

								if (addon) {
									addon.addon_quantity = item.quantity;
									addon.addon_total = addon.addon_price * item.quantity;

									console.log("adddon total.......", addon.addon_price * item.quantity)
									return addon
								} else {
									return false
								}
							})
							console.log('new_addon_rates...............', new_addon_rates)
							return new_addon_rates;
						})

						console.log('addon_rates...............', addon_rates)
						let addon_rates_array = addon_rates.flat(Infinity);
						let result4 = [];
						addon_rates_array.reduce(function (res, value) {
							console.log('value of addon---------', value)
							res[value.addon_heading] = { addon_heading: value.addon_heading, addon_total: 0, addon_name: value.addon_name, adddon_quantity: value.adddon_quantity };
							result4.push(res[value.addon_heading])
							res[value.addon_heading].addon_total += value.addon_total;
							return res;

						}, {});
						console.log('result4----------', result4)
						let addon_total = result4.reduce((a, b) => a + b.addon_total, 0)

						this.userService.order_list_bill_page[i].addon_total = addon_total;
						this.userService.order_list_bill_page[i].sub_total = sub_total;
						this.userService.order_list_bill_page[i].user_discount = this.user_discount;
						this.userService.order_list_bill_page[i].my_service_charge = this.userService.my_service_charge;
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
										tax.discount = ((item.sold_price * item.quantity) / this.order_bill_cost) * this.user_discount;
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
							console.log('type of tax.value--------', typeof (tax.percentage))
							console.log('tax.percentage--------', tax.percentage)
							console.log('tax.checked--------', tax.checked);
							if (tax.checked == true) {
								tax.item_price = item.sold_price * item.quantity;
								tax.discount = ((item.sold_price * item.quantity) / this.order_bill_cost) * this.user_discount;
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

					console.log("tax_total det---------------------", result2);
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

						console.log("final cost**********************", result.orders.final_cost);
						this.altered_order_list[0].discont = result.orders.total_cost;
						this.altered_order_list[0].user_discount = element.user_discount;
						this.altered_order_list[0].bill_cost = this.altered_order_list[0].bill_cost + element.bill_cost;
						this.altered_order_list[0].bill_tax = this.userService.tax_total;
						this.altered_order_list[0].total_cost = result.orders.total_cost; this.altered_order_list[0].current_user = true;
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
	}


	checkValue(event: any, modalName) {
		this.cart = JSON.parse(localStorage.getItem('cart'));
		if (!this.cart) { this.cart = []; }
		let cartDetails = this.userService.CART_DETAILS();
		console.log("cart Details......................", cartDetails);
		// this.tax = Math.round(cartDetails.cart_total * (this.userService.restaurant_gst/100));
		this.showlabel = true;
		console.log(event);
		console.log(event.target.checked)

		if (event.target.checked) {
			this.serviceStatus = true
			localStorage.setItem("service_status", "true")
			console.log("service charge..............", this.restaurantDetails.service_charge)
			if (this.restaurantDetails.service_charge != '0') {
				let service_charge = Number(this.restaurantDetails.service_charge) / 100;
				console.log("service charge1..............", cartDetails.cart_total)
				this.userService.service_charge = (service_charge * this.final_cost);
				console.log("service Charge...........................", this.userService.service_charge)

			}
			else {

				this.userService.service_charge = 0;
			}


		}
		else {
			event.target.checked = true
			this.userService.serviceStatus = true;
			modalName.show();

		}

	}

	serviceChargeRequest(modalName) {
		console.log("bill value.................", this.order)
		this.apiService.SERVICE_STATUS_REQUEST({ 'order_id': this.order._id }).subscribe(result => {
			console.log('response', result);
			if (result) {
				this.userService.serviceStatus = false;
				localStorage.setItem("service_status", "false")
				this.apiService.CONFIRMED_ORDERS().subscribe(result => {
					this.userService.grandTotal = result.orders.grand_total;

					this.userService.service_charge_amount = result.orders.service_charge_amount ? result.orders.service_charge_amount : 0;
					this.userService.service_charge_percentage = result.orders.service_charge_percentage ? result.orders.service_charge_percentage : 0;
				});
				modalName.hide();

			}

		});

	}

	onRequestBill() {
		localStorage.setItem('user_count', this.userService.order_list_bill_page.length);
		localStorage.setItem('table_total', this.userService.billTotal_gst);
		for (let i = 0; i < this.userService.order_list_bill_page.length; i++) {
			if (this.userService.order_list_bill_page[i].current_user) {
				let myBill = {
					user_name: this.userService.order_list_bill_page[i].user_name,
					bill_cost: (this.userService.order_list_bill_page[i].bill_cost + this.userService.my_tax_total),
				};
				localStorage.setItem('my_bill', JSON.stringify(myBill));
			}
		}
		console.log("this.userService.order_list_bill_page*****************************", this.userService.order_list_bill_page);
		let hastableorder1 = !!this.userService.order_list_bill_page.filter(x => !x.user_id).length;
		localStorage.setItem("hastableorder", String(hastableorder1));
		console.log("hastableorder type------", hastableorder1);

		this.router.navigate(['/bill/type']);
	}

	onSettleBill() {
		let sendData = {
			"dinamic_details": JSON.parse(localStorage.getItem('dinamic_details')),
			"bill_details": {
				"bill_type": "my_share",
				"bill_count": 1
			}
		}
		this.apiService.DINAMIC_BILL_CONFIRM(sendData).subscribe(result => {
			if (result.status) this.router.navigate(['/bill/confirm']);
			else console.log('response', result);
		});
	}

	goToOrderStatus() {
		this.router.navigate(['/order-status']);
		localStorage.setItem("viewStatus", "awaiting")
	}
	calculateTax(cost) {
		let tax = Math.round(cost * (this.userService.restaurant_gst / 100));
		return tax;
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
					tax.discount = ((item.sold_price * item.quantity) / this.order_bill_cost) * this.user_discount;
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
		console.log("tax_total1-----------------------------------", tax_total);
		return tax_total;


	}

}
