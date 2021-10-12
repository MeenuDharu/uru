import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../_services/api.service';
import { UserService } from 'src/app/_services/user.service';
import { CountdownComponent } from 'ngx-countdown';
import { CommonService } from 'src/app/_services/common.service';
import { LoadscriptService } from 'src/app/_services/loadscript.service';
import { SnackbarService } from '../../../_services/snackbar.service';
import { Socket } from 'ngx-socket-io';
import { PlatformLocation, CurrencyPipe } from '@angular/common';
declare var Instamojo: any;
import { CookieService } from 'ngx-cookie-service';
import { WindowRef } from '../../../_services/winref.service';
import { environment } from '../../../../environments/environment'
import { DynamicAssetLoaderService } from '../../../_services/dynamic-asset-loader.service';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
import * as moment from 'moment';
@Component({
	selector: 'app-bill-confirm',
	templateUrl: './bill-confirm.component.html',
	styleUrls: ['./bill-confirm.component.css'],
})
export class BillConfirmComponent implements OnInit {

	pre_loader: boolean = true;
	bill_details: any = {}; loaderStatus: boolean; shareAmt: number;
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	user_details: any = JSON.parse(localStorage.getItem('user_details'));
	valet_status: any;; selected_quick_option: any = null;
	progressValue: any;
	progressPerc: any;
	delayTime: any = '5';
	serial_number: any;
	showFetchingDetails: any;
	resultString: any;
	confirm_click: boolean = true;
	valet_id: any;
	status: boolean;
	config: any = {};
	billListDisp: boolean = false;
	valet_det_sta: any;
	service_charge: any = 0;
	razorpayOptions: any = {}
	userDetails: any;
	payOnlineStatus: boolean;
	re_request: boolean = false;
	val: number;
	restaurantDetails: any = JSON.parse(localStorage.getItem('restaurant_details'));
	disableBtn: boolean = false

	@ViewChild('cd', { static: false }) private countdown: CountdownComponent;
	@ViewChild('closeValett', { static: true }) closeValett: ElementRef;
	@ViewChild('openValetOpenModal', { static: true }) openValetOpenModal: ElementRef;
	@ViewChild('razorpayForm', { static: true }) razorpayForm: ElementRef;
	// @ViewChild('closeValet',  { static: true }) closeValet: ElementRef;
	razorpay_redirect_url: string;
	razorpayUrl: String;
	cancelUrl: String;

	constructor(public commonService: CommonService, private router: Router, private apiService: ApiService, private loadScript: LoadscriptService, public userService: UserService, private socket: Socket, location: PlatformLocation, private cookieService: CookieService, private winRef: WindowRef, private assetLoader: DynamicAssetLoaderService, private browserService: UserBrowserService, private cp: CurrencyPipe, private snackBar: SnackbarService) {
		location.onPopState(() => {
			console.log('pressed back in add!!!!!');
			//this.router.navigateByUrl(‘/multicomponent’);
			//history.forward();
		})
	}
	ngOnInit() {
		this.userService.vehicle.is_expired = false;
		history.pushState(null, document.title, location.href);
		window.addEventListener('popstate', function (event) {
			history.pushState(null, document.title, location.href);
		});
		this.razorpayUrl = environment.razorpay_payment_url;
		this.cancelUrl = environment.cancel_url;
		console.log("cancelUrl...............", this.cancelUrl);
		console.log("environment paymentLink .........", environment.paymentLink)
		this.razorpay_redirect_url = ""
		this.re_request = false;
		this.billListDisp = false;
		this.loaderStatus = true;
		this.userService.restaurant_gst = JSON.parse(localStorage.getItem('restaurant_details')).gst;
		this.userService.restuarant_taxes = JSON.parse(localStorage.getItem('restaurant_details')).restaurant_tax;
		this.loadScript.load('material-icons').then(data => {
			console.log('font awesome reference added....');
		}).catch(error => console.log('err...', error));


		if (this.user_details) {
			let a = this.user_details;
			let sendData = {
				dinamic_user_id: a.dinamic_user_id,
				access_code: localStorage.getItem("access_code"),
				pos_branch_id: this.restaurantDetails.branch_id
			}
			this.apiService.GET_VALET_DETAILS(sendData).subscribe(result => {
				console.log('valet result....', result);
				if (result.status) {
					this.commonService.valet_details = result.data;
					this.resultString = result.data.serial_number
					this.status = true;
					this.userService.showOrderAgain = false;
					if (result.data.valet_status) {
						this.userService.showValetAgain = true;
						this.resultString = result.data.serial_number;
						this.commonService.valetStatus = result.data.valet_status;
						localStorage.setItem(result.data.valet_status, "valet_staus")
						this.valet_status = result.data.valet_status;
						let valet_delivery = result.data.delivery_time;
						console.log('valet_delivery.....', this.commonService.valetStatus)
						if (valet_delivery) {
							this.commonService.deliveryTime = Number(valet_delivery);
							this.userService.vehicle.delivery_time = Number(result.data.delivery_time);
						}




						if (valet_delivery) {
							this.commonService.deliveryTime = Number(valet_delivery);
						}
						//	let timer_config = JSON.parse(localStorage.getItem('timerConfig'));
						// console.log('timer_config....', timer_config);

						if (this.valet_status) {
							if (this.valet_status == 'on_hold') {
								this.userService.vehicle.delivery_time = Number(result.data.delivery_time);
								this.userService.vehicle.valet_delay = Number(result.data.delay)
								let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
								let r_date: any = moment(new Date(), 'mm : ss');
								let duration = d_date.diff(r_date, 'seconds');
								//console.log("event duration.............", duration)
								if (duration > 0) {
									this.commonService.timerConfig = { leftTime: duration, format: 'mm:ss', notify: 0 };
								}
								else {
									this.commonService.timerConfig = { leftTime: 0, format: 'mm:ss', notify: 0 };
									this.commonService.valetStatus = 'awaiting';
								}

							} else if (this.valet_status == 'vehicle_ready') {
								this.userService.vehicle.delivery_time = Number(result.data.delivery_time);
								this.userService.vehicle.valet_delay = Number(result.data.delay)
								let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
								let r_date: any = moment(new Date(), 'mm : ss');
								let duration = d_date.diff(r_date, 'seconds');
								//console.log("event.............", duration)


								console.log("event.............", duration)
								if (duration > 0) {
									this.commonService.timerConfig = { leftTime: duration, format: 'mm:ss', notify: 0 };
								}
								else {
									this.commonService.timerConfig = { leftTime: 0, format: 'mm:ss', notify: 0 };
								}
							}

						}






						if (this.valet_status === 'awaiting' || this.valet_status === 'on_hold' || this.valet_status === 'confirmed' || this.valet_status === 'vehicle_ready' || this.valet_status === 'vehicle_re_ready' || this.valet_status === 're_confirmed' || this.valet_status === 'vehicle_parked' || this.valet_status === 'delivered' || this.valet_status === 're_request') {
							if (this.valet_status == 're_request') {
								this.commonService.valetStatus = 'awaiting'
							}
							else {
								this.commonService.valetStatus = this.valet_status;
							}

							document.getElementById("openValetStatusOpenModal").click();
						}
						this.status = true
						//return this.status;
					}
				}
				else {

					this.status = false;
					//return this.status;
				}
			})
		}

		//razorpayOptions
		console.log("status...........", this.status)

		this.apiService.PAYMENT_GATEWAY_DETAILS({ access_code: localStorage.getItem('access_code') }).subscribe(result => {
			console.log("Payment Dtails..................", result);
			if (result.data.status === 'active') {
				console.log("Payment Data.................")
				this.payOnlineStatus = true
				// this.razorpayOptions = {
				// 	"key": result.key_id,
				// 	"name": result.data.name,
				// 	"description":  result.data.description,
				// 	"modal": { "ondismiss": () => {
				// 		window.location.replace(environment.paymentLink+"bill/confirm");
				// 	 } }
				// 	}

				this.razorpayOptions.key = result.key_id;
				this.razorpayOptions.store_name = result.data.name;
				this.razorpayOptions.description = result.data.description;
				this.razorpayOptions.userBaseURL = environment.userBaseURL;
				this.razorpayOptions.restaurentId = this.restaurant_details.company_id;
				this.razorpayOptions.branchId = this.restaurant_details.branch_id;
				this.razorpayOptions.tableId = this.restaurant_details.table_id;

				if (JSON.parse(localStorage.getItem('user_details'))) {
					this.userDetails = JSON.parse(localStorage.getItem('user_details'));
					this.razorpayOptions.customer_name = this.userDetails.name;
					this.razorpayOptions.customer_email = this.userDetails.email;
					this.razorpayOptions.customer_mobile = this.userDetails.mobile;
					this.razorpayOptions.prefill = { "name": this.userDetails.name, "email": this.userDetails.email, "contact": this.userDetails.mobile };
				}
			}
			else {
				this.payOnlineStatus = false;
			}
		});


		console.log("table engaged bill confirm............")
		// this.socket.emit('table_engaged', this.restaurant_details.table_id);  // what is it s purpose? // nan chumma emit panni pathen data disconnect agudhla
		this.apiService.GET_BILL().subscribe(result => {
			console.log("order res 1...", result);
			if (result.status != 0) {
				this.loaderStatus = false;
				let billType = result.bills.bill_type;
				let billList = result.bills.bills;
				this.userService.bill_List = result.bills.bills;
				this.userService.bill_type = result.bills.bill_type;
				this.userService.bills = result.bills;

				console.log("bills start..........", result.bills)
				this.userService.order_id = result.bills._id;
				this.userService.order_number = result.bills.order_id;
				console.log("oreder number.................", this.userService.order_number)
				// this.userService.bill_type = rsult
				let userBill = this.getUserBill(billList, billType);

				console.log("userBill...........", userBill)
				if (this.userService.bill_List.length) {
					// this.userService.bill_type = this.userService.bill_List.bill_type


					this.userService.totalBasicBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_cost, 0);
					let all_bills_paid = this.userService.bill_List.filter((i) => i.bill_status != 'paid');
					console.log("this.userService.totalBasicBillCost................", this.userService.totalBasicBillCost)
					if (all_bills_paid.length) {
						this.userService.all_bills_paid = false;
						this.userService.payStatusText = 'PAY';
					}
					else {
						this.userService.all_bills_paid = true;
						this.userService.payStatusText = 'PAID';
					}
					console.log("all_bils_paid...........", all_bills_paid)
					for (let i = 0; i < this.userService.bill_List.length; i++) {
						// (price of the item / total price) * discount

						//this.userService.bill_List.bill_cost = Number(this.userService.bill_List[i].bill_cost);
						//this.discount = result.orders.order_discount;


						console.log("my_service_charge ************ ", this.userService.my_service_charge);


						this.userService.bill_List[i].service_charge_amount = this.userService.bill_List[i].service_charge_amount ? this.userService.bill_List[i].service_charge_amount : 0;

						if (result.bills.order_discount && result.bills.order_discount.discount_type === 'amount' && result.bills.order_discount.discount_number) {
							this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost) / Number(this.userService.totalBasicBillCost)) * Number(result.bills.order_discount.discount_number);
							this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost - this.userService.bill_List[i].user_discount) + this.userService.bill_List[i].bill_tax_amount + this.userService.bill_List[i].service_charge_amount;
						}
						else if (result.bills.order_discount && result.bills.order_discount.discount_type === 'percentage' && result.bills.order_discount.discount_number) {
							this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost)) * (Number(result.bills.order_discount.discount_number / 100));
							this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost - this.userService.bill_List[i].user_discount) + this.userService.bill_List[i].bill_tax_amount + this.userService.bill_List[i].service_charge_amount;
						}
						else if (result.bills.order_discount && result.bills.order_discount.discount_type === 'new_value' && result.bills.order_discount.discount_number) {
							this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost) / Number(this.userService.totalBasicBillCost)) * Number(this.userService.totalBasicBillCost - result.bills.order_discount.discount_number);
							this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost - this.userService.bill_List[i].user_discount) + this.userService.bill_List[i].bill_tax_amount + this.userService.bill_List[i].service_charge_amount
						}
						else if (result.bills.order_discount && result.bills.order_discount.discount_type === 'flat') {
							this.userService.bill_List[i].user_discount = (Number(this.userService.bill_List[i].bill_cost));
							this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost - this.userService.bill_List[i].user_discount) + this.userService.bill_List[i].bill_tax_amount + this.userService.bill_List[i].service_charge_amount;
						}
						else {
							this.userService.bill_List[i].user_discount = 0;
							this.userService.bill_List[i].bill_final_cost = (this.userService.bill_List[i].bill_cost - this.userService.bill_List[i].user_discount) + this.userService.bill_List[i].bill_tax_amount + this.userService.bill_List[i].service_charge_amount
							console.log("Discount Data..................", this.userService.bill_List[i].bill_cost, '+', this.userService.bill_List[i].bill_tax_amount, '+', this.userService.bill_List[i].service_charge_amount)
						}

						console.log("user_discount--------------------------", this.userService.bill_List[i].user_discount);

					}


					console.log("service_charge***************************", Number(this.userService.service_charge))


					console.log("this.userService.tax_total", this.userService.tax_total)

					this.userService.totalBillCost_withtax = this.userService.totalBillCost + this.userService.tax_total;

					this.userService.totalBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_cost_incl_tax, 0);
					this.userService.totalFinalBillCost = this.userService.bill_List.reduce((a, b) => a + b.bill_final_cost, 0);
					this.userService.billListLength = this.userService.bill_List.length;
					this.userService.itemListLength = this.userService.bill_List.reduce((a, b) => a + b.item_list.length, 0);
					console.log("length.............", this.userService.itemListLength)

					if (result.bills.bill_type === 'split_equal') {
						this.userService.itemListLength = this.userService.itemListLength / result.bills.bill_count
					}


					let restaurant_details = JSON.parse(localStorage.getItem("restaurant_details"))
					console.log("service charge..............", restaurant_details.service_charge)
					if (localStorage.getItem("service_status") === "false") {
						this.userService.service_charge = 0;
						this.userService.my_service_charge = 0;
					}
					else {
						if (restaurant_details.service_charge != '0') {
							let service_charge = Number(restaurant_details.service_charge) / 100
							this.userService.service_charge = (service_charge * this.userService.totalFinalBillCost);
							console.log("service Charge...........................", this.userService.service_charge);
							this.userService.my_service_charge = (Number(this.userService.bill_List.bill_cost) / Number(this.userService.totalBasicBillCost)) * Number(this.userService.service_charge);
						}
						else {
							this.userService.service_charge = 0;
						}
					}

					console.log("totalFinalBillCost...........................", this.userService.totalFinalBillCost);
					console.log("Total_billcost................", this.userService.totalBillCost_withtax);

					console.log("userBill.bill_status......................", userBill);

					if (userBill.bill_status == 'billed') {
						this.userService.billConfirmText = 'Total Payment';
						if (result.bills.bill_type === "my_share") {
							this.userService.bill_type_text = 'My Share';
						}
						else if (result.bills.bill_type === "split_equal") {
							this.userService.bill_type_text = 'Go Dutch';
						}
						else if (result.bills.bill_type === "split_by_item") {
							this.userService.bill_type_text = 'Split By Item';
						}
						else if (result.bills.bill_type === "total") {
							this.userService.bill_type_text = 'Table Total';
						}
						else {
							this.userService.bill_type_text = 'Bill Split - ' + result.bills.bill_type;
						}

						this.userService.showBillAmount = false;
						this.userService.payButtonStatus = false;

					}
					else if (userBill.bill_status == 'confirmed') {

						this.userService.billConfirmText = 'Total Payment';
						this.userService.showBillAmount = true;
						this.userService.payButtonStatus = true;
						//	this.userService.payStatusText = 'PAY';
						if (result.bills.bill_type === "my_share") {
							this.userService.bill_type_text = 'My Share';
						}
						else if (result.bills.bill_type === "split_equal") {
							this.userService.bill_type_text = 'Go Dutch';
						}
						else if (result.bills.bill_type === "split_by_item") {
							this.userService.bill_type_text = 'Split By Item';
						}
						else if (result.bills.bill_type === "total") {
							this.userService.bill_type_text = 'Table Total';
						}
						else {
							this.userService.bill_type_text = 'Bill Split - ' + result.bills.bill_type;
						}


					}

					else if (userBill.bill_status == 'split_by_item') {
						//	this.userService.payStatusText = 'PAY';
						this.userService.billConfirmText = 'Total Payment';
						this.userService.showBillAmount = false;
						this.userService.payButtonStatus = false;
						this.userService.bill_type_text = "Bill Split - Split By Item"
					}
					else {
						this.userService.billConfirmText = 'Total amount paid';
						this.userService.showBillAmount = true;
						this.userService.showValetAgain = true;
						this.userService.payButtonStatus = true;
						//this.userService.payStatusText = 'PAID';
						if (result.bills.bill_type === "my_share") {
							this.userService.bill_type_text = 'My Share';
						}
						else if (result.bills.bill_type === "split_equal") {
							this.userService.bill_type_text = 'Go Dutch';
						}
						else if (result.bills.bill_type === "split_by_item") {
							this.userService.bill_type_text = 'Split By Item';
						}
						else if (result.bills.bill_type === "total") {
							this.userService.bill_type_text = 'Table Total';
						}
						else {
							this.userService.bill_type_text = 'Bill Split - ' + result.bills.bill_type;
						}

					}
				}
				// else{
				//   this.userService.billConfirmText = 'Your share payable is';
				//   if(billType=='split_equal') { 
				//     this.userService.showBillAmount = true;
				//   }
				// }
				// this.bill_details = { bill_type: billType, bill_amount: billList[0].bill_cost, bill_amount_gst: billList[0].bill_cost + this.userService.tax_total };

				console.log("order res 2...", this.bill_details);
			}
			else {

				console.log('response', result);
				this.loaderStatus = false;
				console.log("valet status....", this.commonService.valetStatus)

				if (this.status === false) {

					//this.socket.disconnect();
					let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
					// this.socket.emit('leave_valet', '123456'); 
					this.apiService.CONFIRMED_ORDERS().subscribe((result) => {
						console.log('Confirmed Orders...... ', result);
						if (result.status) {
							this.router.navigate(['/bill/view']);
						} else {
							this.apiService.PLACED_ORDERS().subscribe((result) => {
								console.log('Placed Orders...... ', result);
								if (result.status) {
									this.router.navigate(['/order-status']);
								} else {
									if (restaurant_det.order_type === 'in_house') {
										this.socket.emit('leave_table', restaurant_det.table_id);
									}
									else {
										this.socket.emit('close_take_away', localStorage.getItem('pos_order_id'));
									}
									localStorage.clear();
									sessionStorage.clear();
									this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict')

									this.router.navigate(['/']);
								}
							});
						}
					});
				}

			}
			// setTimeout(() => { this.loaderStatus = false; }, 500);
		});
	}

	billListShow() {
		if (this.billListDisp == false) {
			this.billListDisp = true;
		}
		else {
			this.billListDisp = false;
		}


	}




	getValetDetails() {
		console.log("common valet.........", localStorage.getItem("valet_status"))
		//if (localStorage.getItem("valet_status") || localStorage.getItem("valet_status") != null) {
		if (this.user_details) {
			let a = this.user_details;
			let sendData = {
				dinamic_user_id: a.dinamic_user_id,
				access_code: localStorage.getItem("access_code"),
				pos_branch_id: this.restaurantDetails.branch_id
			}
			this.apiService.GET_VALET_DETAILS(sendData).subscribe(result => {
				console.log('valet result....', result);
				if (result.status) {
					this.commonService.valet_details = result.data;
					this.resultString = result.data.serial_number
					this.status = true
					if (result.data.valet_status) {
						this.resultString = result.data.serial_number;
						this.commonService.valetStatus = result.data.valet_status;
						localStorage.setItem(result.data.valet_status, "valet_staus")
						this.valet_status = result.data.valet_status;
						let valet_delivery = localStorage.getItem('valet_delivery');
						// console.log('valet_delivery.....', valet_delivery)
						if (valet_delivery) {
							this.commonService.deliveryTime = Number(valet_delivery);
						}
						let timer_config = JSON.parse(localStorage.getItem('timerConfig'));
						// console.log('timer_config....', timer_config);
						if (timer_config) {
							if (this.valet_status) {
								if (this.valet_status == 'on_hold') {
									let timer = sessionStorage.getItem("timer");
									// console.log('timer....', timer);
									if (timer) {
										this.commonService.timerConfig = { leftTime: Number(timer) / 1000, format: 'mm:ss', notify: 0 }
									} else {
										this.commonService.timerConfig = { leftTime: timer_config.leftTime, format: 'mm:ss', notify: 0 }
									}
								} else if (this.valet_status == 'vehicle_ready') {
									let timer = sessionStorage.getItem("timer");
									// console.log('timer....', timer);
									if (timer) {
										this.commonService.timerConfig = { leftTime: Number(timer) / 1000, format: 'mm:ss', notify: 0 }
									} else {
										this.commonService.timerConfig = { leftTime: timer_config.leftTime, format: 'mm:ss', notify: 0 }
									}

								}

							}


						}

						if (this.valet_status === 'awaiting' || this.valet_status === 'on_hold' || this.valet_status === 'confirmed' || this.valet_status === 'vehicle_ready' || this.valet_status === 'vehicle_re_ready' || this.valet_status === 're_confirmed' || this.valet_status === 'vehicle_parked' || this.valet_status === 'delivered' || this.valet_status === 're_request') {
							this.commonService.valetStatus = this.valet_status;
							this.openStatusPop()
						}
						this.status = true
						//return this.status;
					}
				}
				else {

					this.status = false;
					//return this.status;
				}
			})
		}
		//  }


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



	onHome() {
		// var user_det = localStorage.getItem('user_details');
		this.userService.showOrderAgain = false;
		this.loaderStatus = true;
		let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
		if (restaurant_det.order_type === 'in_house') {
			this.socket.emit('leave_table', restaurant_det.table_id);
		}
		else {
			this.socket.emit('close_take_away', localStorage.getItem('pos_order_id'));
		}
		localStorage.clear();
		sessionStorage.clear();
		this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict')
		this.userService.user_name = "";
		//sessionStorage.clear();
		// localStorage.setItem('user_details',user_det);
		this.router.navigate(['/']);
	};
	onBillPay(x) {
		console.log('user details.....', this.user_details);
		console.log('bill details....', x.disableBtn);

		let amount = this.cp.transform(x.bill_final_cost, '', '', '1.0-0')
		console.log("amount..................", amount)
		let val = Number(amount);
		console.log("payonline", val);

		let orderData = {
			"order_details": {
				"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
				"item_details": JSON.parse(localStorage.getItem('cart')),
			},
			"cart_total": amount,
			"amount": amount,
			"email": this.user_details.email,
			"name": this.user_details.dinamic_user_name,
			"mobile": this.user_details.mobile,
			"bill_id": x._id,
			"order_number": x._id,
			"pos_branch_id": this.restaurant_details.branch_id,
			"access_code": localStorage.getItem("access_code")
		};

		console.log("orderdata.........", orderData)
		console.log("environment paymentLink .........", environment.paymentLink)

		this.apiService.CONFIRM_PAYMENT(orderData).subscribe(results => {
			console.log('response....', results);
			if (results.status) {
				let payment_det = {
					user_id: JSON.parse(localStorage.getItem('user_details')).dinamic_user_id,
					order_id: results.data.order_id,
					bill_id: results.data.order_id,
					payment_request_id: results.data.razorpay_response.id,
					user_name: JSON.parse(localStorage.getItem('user_details')).dinamic_user_name,
					amount: amount,
					email: JSON.parse(localStorage.getItem('user_details')).email,
					payment_status: 'pending',
					pos_branch_id: this.restaurant_details.branch_id,
					access_code: localStorage.getItem("access_code")
				}

				console.log("Pament det............", payment_det)
				this.apiService.SAVE_PAYMENT(payment_det).subscribe(result => {
					console.log("payment response.....", result.payment_details._id);
					if (result.status) {
						this.razorpayOptions.my_order_id = results.data.order_id;
						this.razorpayOptions.my_payment_id = result.payment_details._id;
						this.razorpayOptions.order_type = this.restaurant_details.order_type;
						this.razorpayOptions.razorpay_order_id = results.data.razorpay_response.id;
						this.razorpay_redirect_url = environment.paymentLink + "user/bill/getpaymentrequeststatus/" + this.restaurant_details.branch_id + '/' + result.payment_details._id;
						setTimeout(_ => this.razorpayForm.nativeElement.submit());
					}


				});





				// let razoypayOrderId = results.data.razorpay_response.id;
				// let order_id = results.data.order_id;
				// let order_number = results.data.order_number;
				// //razorpay response handler

				// this.razorpayOptions.handler = (response) => {
				// 	console.log("response of razorpay*****************", response)
				// 	let paymentId = response.razorpay_payment_id;					
				// 	//window.location.href = "http://localhost:4200/#/checkout/payment-confirm?payment_request_id="+paymentId+"&order_id="+order_id+"&order_number="+order_number;
				// 	window.location.href = environment.paymentLink+"checkout/payment-confirm?payment_request_id="+paymentId+"&order_id="+order_id+"&order_number="+order_number;
				// };
				// this.razorpayOptions.order_id = razoypayOrderId;
				// // open razorpay modal
				// new this.winRef.nativeWindow.Razorpay(this.razorpayOptions).open();

			} else {
				console.log('response...', results)
			}
		})

	}



	onValet(modalName) {

		if (this.status) {
			modalName.show()
		}
		else {
			this.loaderStatus = true;
			if (localStorage.getItem('application_type') == 'ios') this.router.navigate(['/valet-ios']);
			else this.router.navigate(['/valet-android']);
		}

	}





	handleEvent(event) {
		let dtime = this.userService.vehicle.valet_delay;
		let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
		let r_date: any = moment(new Date(), 'mm : ss');
		let duration = d_date.diff(r_date, 'seconds');

		if (duration > 0) {
			if (event.action == 'start') {
				this.commonService.timerConfig = { leftTime: duration, format: 'mm:ss', notify: 0 };
				let a = event.left / 1000;
				// console.log('aaaaa',timer_config)
				this.progressValue = dtime;
				this.userService.progressPerc = 100;
			}
			else if (event.action == 'notify') {
				if (event.left > 0) {
					let a = event.left / 1000;
					let b = this.progressValue - a;
					let c = Math.round((a / this.progressValue) * 100);
					//console.log("event.............",  a, "---------------", this.progressValue)
					this.userService.progressPerc = c;

				} else {

					this.userService.progressPerc = 0;
					this.commonService.valetStatus = 'awaiting';
				}

				sessionStorage.setItem("timer", event.left);
			} else if (event.action == 'done') {
				sessionStorage.removeItem('timer');
				this.commonService.valetStatus = 'awaiting';
				this.userService.progressPerc = 0;
				//this.commonService.valetStatus = 'awaiting';
				localStorage.setItem('valet_status', this.commonService.valetStatus);
			}
		}
		else {
			this.commonService.valetStatus = 'awaiting';
			this.userService.progressPerc = 0;
			//this.commonService.valetStatus = 'awaiting';

			localStorage.setItem('valet_status', this.commonService.valetStatus);
		}

	}


	handleEventOne(event) {
		let dtime = this.userService.vehicle.valet_delay;
		let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
		let r_date: any = moment(new Date(), 'mm : ss');
		let duration = d_date.diff(r_date, 'seconds');
		if (duration > 0) {

			if (event.action == 'start') {
				this.commonService.timerConfig = { leftTime: duration, format: 'mm:ss', notify: 0 };
				let a = event.left / 1000;
				// console.log('aaaaa',timer_config)
				this.progressValue = dtime;
				this.userService.progressPerc = 100;
			}
			else if (event.action == 'notify') {
				if (event.left > 0) {
					let a = event.left / 1000;
					//console.log("event.left............", event.left)
					let b = this.progressValue - a;
					let c = Math.round((a / this.progressValue) * 100);
					this.userService.progressPerc = c;
				} else {

					this.userService.progressPerc = 0;
				}

				sessionStorage.setItem("timer", event.left);
			} else if (event.action == 'done') {
				sessionStorage.removeItem('timer');
				this.userService.progressPerc = 0;
				// this.commonService.valetStatus = 'awaiting';
				// localStorage.setItem('valet_status', this.commonService.valetStatus);
			}
		}
		else {
			this.userService.progressPerc = 0;
		}



	}






	ngAfterViewInit() {
		this.assetLoader.load('checkout').then(data => {
			console.log("checkout");
		}).catch(error => console.log("err", error));
	}


	setPlusFive() {
		let d = this.plusDate(new Date(), 5);
		let c = this.setDeliveryNew(d);
		return c;
	}
	setPlusTen() {
		let d = this.plusDate(new Date(), 10);
		let c = this.setDeliveryNew(d);
		return c;
	}
	setPlusFifteen() {
		let d = this.plusDate(new Date(), 15);
		let c = this.setDeliveryNew(d);
		return c;
	}
	setPlusTwenty() {
		let d = this.plusDate(new Date(), 20);
		let c = this.setDeliveryNew(d);
		return c;
	}

	plusDate(dt, minutes) {
		return new Date(dt.getTime() + minutes * 60000);
	}

	setDelivery() {
		let d = new Date(this.commonService.deliveryTime);
		let hours = d.getHours();
		let minutes = d.getMinutes();

		var ampm = hours >= 12 ? 'pm' : 'am';
		// console.log('hrs....', hours);
		// console.log('minutes...', minutes);
		let hrs = hours % 12;
		let a = hrs ? hrs : 12; // the hour '0' should be '12'
		let mins = minutes < 10 ? '0' + minutes : String(minutes);
		var strTime = a + ':' + mins + ' ' + ampm;
		return strTime;

	}

	setDeliveryNew(date) {
		let d = date;
		let hours = d.getHours();
		let minutes = d.getMinutes();

		var ampm = hours >= 12 ? 'pm' : 'am';
		// console.log('hrs....', hours);
		// console.log('minutes...', minutes);
		let hrs = hours % 12;
		let a = hrs ? hrs : 12; // the hour '0' should be '12'
		let mins = minutes < 10 ? '0' + minutes : String(minutes);
		var strTime = a + ':' + mins + ' ' + ampm;
		return strTime;

	}

	closeValet() {
		// console.log('result string...');
		let closeValett: HTMLElement = this.closeValett.nativeElement as HTMLElement;
		closeValett.click();
	}

	openPop() {
		let openValetModal: HTMLElement = this.openValetOpenModal.nativeElement as HTMLElement;
		openValetModal.click();

	}
	openStatusPop() {
		document.getElementById("openValetStatusOpenModal").click();
		// let openValetStatusModal: HTMLElement = this.openValetStatusOpenModal.nativeElement as HTMLElement;
		// openValetStatusModal.click();
		console.log("status......", this.commonService.valetStatus)




	}

	backToMenu() {
		// localStorage.removeItem('re_request');
		this.router.navigate(['/home']);
	}

	requestAgain() {
		let valet_details = JSON.parse(localStorage.getItem('valet_details'));

		// this.serial_number = this.commonService.valet_details.serial_number
		// this.delayTime = '5';

		// this.openPop();

		this.re_request = true;
		//localStorage.setItem('valet_details', JSON.stringify(result.data));
		this.router.navigate(['/valet/status'])

		//this.router.navigate(['/valet/status'])

	}

	radioChange(event) {
		console.log('delay time....', event);
	}

	contactManager() {
		// console.log('contact manager....');
	}

	vehicleReq() {
		let a = localStorage.getItem('reRequest');
		if (a) {
			if (a == '1') {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	}
	vehicleReReq() {
		let a = localStorage.getItem('reRequest');
		if (a) {
			if (a == '1') {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}

	}

	getTimer() {
		//console.log("timer Event..............", event)


		let dtime = localStorage.getItem("valet_delay");
		this.userService.vehicle.delivery_time = Number(localStorage.getItem("valet_delivery"));
		this.userService.vehicle.is_expired = false;

		let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
		let r_date: any = moment(new Date(), 'mm : ss');
		let duration = d_date.diff(r_date, 'seconds');
		let minutes = Math.floor(duration / 60);


		if (duration > 0) {

			setInterval(() => {
				let d_date = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
				r_date = moment(new Date(), 'mm : ss');
				duration = d_date.diff(r_date, 'seconds');
				let a = Number(dtime);

				let minutes = Math.floor((duration / 60));
				let seconds = duration - minutes * 60;

				if (duration < 0) {
					this.userService.progressPerc = 0;
					this.userService.vehicle.time = '00:00';
					this.userService.vehicle.is_expired = true;
					//	this.commonService.valetStatus = 'awaiting';
					clearInterval()
				} else {
					let c = Math.round((duration / a) * 100);
					this.userService.progressPerc = c;
					let helper = String(minutes).padStart(2, '0') + " : " + String(seconds).padStart(2, '0');
					this.userService.vehicle.time = helper;
					clearInterval()
				}

			}, 1000);
		} else {
			// setTimeout(() => {
			// 	this.userService.progressPerc = 0;
			// 	this.userService.vehicle.time = '00:00';																
			// 	this.commonService.valetStatus = 'awaiting';
			// }, 100);		
		}


	}


	onWaiterCall(serviceModal) {
		this.selected_quick_option = null;
		let quickOptions = this.restaurant_details.quick_options;

		quickOptions.filter((service) => {
			if (service.name === "call waiter") this.selected_quick_option = service;
		});

		// console.log(this.selected_quick_option);
		if (localStorage.getItem('user_details')) {
			this.onServiceConfirm(this.selected_quick_option).then((result: any) => {
				console.log(result);
				if (result.status) {
					serviceModal.hide();
				}
				else {
					console.log('response', result.response);
				}

			});
			this.snackBar.OPEN('A waiter will assist you shortly.', 'Close');
			serviceModal.hide();

		}
		else {
			serviceModal.hide();
		}
	}
	onServiceConfirm(selectedQuickOption) {
		return new Promise((resolve, reject) => {
			// if(reject){
			//  console.log("reject...", reject);
			// }
			let type_id;
			let order_type;
			if (this.restaurant_details.order_type === 'in_house') {
				type_id = this.restaurant_details.table_id;
				order_type = this.restaurant_details.order_type
			}
			else {
				type_id = localStorage.getItem("pos_order_id");
				order_type = this.restaurant_details.order_type;
			}

			let sendData = {
				services: [{
					service_id: selectedQuickOption._id,
					name: selectedQuickOption.name,
					quantity: 1,
					free_service: true,
					called_on: "12/02/2015"
				}],
				order_type: order_type,
				type_id: type_id

			};
			console.log("quickservice senddata............", sendData)
			// service api
			this.apiService.CONFIRM_SERVICE(sendData).subscribe(result => {

				console.log("on service confirm....", result)
				if (result.status) {
					this.snackBar.OPEN('Your service call has been placed.', 'Close');
					resolve({ status: true });
				}
				else {
					resolve({ status: false, response: result });
				}
			});
		});
	}

	getTimer1() {
		//console.log("timer Event..............", event)


		let dtime = localStorage.getItem("valet_delay");
		this.userService.vehicle.delivery_time = Number(localStorage.getItem("valet_delivery"));

		let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
		let r_date: any = moment(new Date(), 'mm : ss');
		let duration = d_date.diff(r_date, 'seconds');
		let minutes = Math.floor(duration / 60);


		//console.log("duration.............", dtime)
		//	if(this.commonService.valetStatus === 'on_hold' || this.commonService.valetStatus === 'vehicle_ready')
		//	{
		if (duration > 0) {

			const inter = setInterval(() => {
				let d_date = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
				r_date = moment(new Date(), 'mm : ss');
				duration = d_date.diff(r_date, 'seconds');
				let a = Number(dtime);
				//let b = a*60							
				let minutes = Math.floor((duration / 60));
				let seconds = duration - minutes * 60;
				//console.log("duration.................", duration)

				if (duration < 0) {
					this.userService.progressPerc = 0;
					this.userService.vehicle.time = '00:00';


				} else {
					//this.userService.progressPerc = 0;
					let c = Math.round((duration / a) * 100);
					this.userService.progressPerc = c;
					let helper = String(minutes).padStart(2, '0') + " : " + String(seconds).padStart(2, '0');
					this.userService.vehicle.time = helper;
					clearInterval(inter)
				}

			}, 1000);



		}



	}


}