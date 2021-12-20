import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwPush } from '@angular/service-worker';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { UserService } from '../../_services/user.service';
import { ApiService } from '../../_services/api.service';
import { environment } from '../../../environments/environment';
// import { SocketService } from '../../_services/socket.service';
import { Socket } from 'ngx-socket-io';
import { SnackbarService } from './../../_services/snackbar.service';
import * as sha512 from 'js-sha512';
import { LoadscriptService } from 'src/app/_services/loadscript.service';
import { CommonService } from 'src/app/_services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
import * as moment from 'moment';
declare var gapi: any;
declare var bolt: any;
declare const navigator: any;
declare const Swiper: any;
declare const $: any;
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	@HostListener('window:popstate', ['$event'])
	onPopState(event) {
		console.log('Back button pressed');
		if (localStorage.getItem('selected_tag_name')) {
			this.location.go('/menu/sections');
		}

	}

	// @HostListener('window:DOMContentLoaded', ['$event'])
	// onDOMContentLoaded(event) {
	//   this.receiveMessage1(event);
	// }

	// 	@HostListener('window:message', ['$event'])
	// onMessage(event) {
	//   this.receiveMessage(event);
	// }
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	user_details: any = JSON.parse(localStorage.getItem('user_details'));
	signupForm: any = {}; otpForm: any = {}; loginForm: any = {}; forgotForm: any = {}; user_name: string; user_id: string; photo_url: string;
	lp_hide: boolean; sp_hide: boolean; customer_id: any;
	cartItems: Number = 0; selected_quick_option: any = null;
	page_redirect: string; billStatus: string; paymentStatus: string; orderTypeFlag: string; hideBubble: boolean;
	orderedItemCount: number;
	enterEmailField: boolean = true;
	enterNameField: boolean = true;
	enterSurNameField: boolean = false;
	enterPasswordField: boolean = false;
	confirmPasswordField: boolean = false;
	enterMobileField: boolean = false;
	enterOtpField: boolean = false;
	pleasewait: boolean = false;
	passwordMismatch: boolean = true;
	auth2: any;
	interval: any;
	mobile_num: any;
	timeLeft: number;
	mob_num_exist: boolean = false;
	exist_email: String = '';
	private user: SocialUser;
	timeLeftString: String = '00 : 60';
	social_data: any;
	showExit: boolean = true;
	take_aways: boolean = false;
	orderContent: any;
	awaitingcontent: any;
	userDetails: any;
	index: any;
	resendOTP: boolean = false;
	sendOTP: boolean = true;
	mobileShow: boolean = false;
	modalLogo: boolean = false;
	socialLogo: boolean = false;
	yesBtnStatus: boolean = false;
	loaderStatus: boolean = false;
	baseUrl = environment.img_url;
	isReadonly: boolean = true;
	valet_status: any;
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
	re_request: boolean = false;
	isDepart: boolean;
	valet_det_sta: any;
	popupBanner: any;
	userDob: any;

	@ViewChild('closeValett', { static: true }) closeValett: ElementRef;
	@ViewChild('openValetOpenModal', { static: true }) openValetOpenModal: ElementRef;
	sectionMenu: any;
	popupheader: any;
	deviceStringCat: string;
	deviceStringLogo: string;
	deviceStringItem: string;
	alterUrl: any;
	constructor(
		private router: Router,
		private socket: Socket,
		public userService: UserService,
		private socialAuthService: AuthService,
		private apiService: ApiService,
		private swPush: SwPush,
		private snackBar: SnackbarService,
		private location: Location,
		private ldScript: LoadscriptService,
		public commonService: CommonService, private cookieService: CookieService, private browserService: UserBrowserService
	) {
		// if (window['OTPCredential']) {
		// window.addEventListener('DOMContentLoaded', e => {
		// 	console.log("Trigger1...................", e)
		// 	const input = document.querySelector('input[autocomplete="one-time-code"]');
		// 	if (!input) return;
		// 	const ac = new AbortController();
		// 	const form = input.closest('form');
		// 	if (form) {
		// 	  form.addEventListener('submit', e => {
		// 		ac.abort();
		// 	  });
		// 	}
		// 	navigator.credentials.get({
		// 	  otp: { transport:['sms'] },
		// 	  signal: ac.signal
		// 	}).then(otp => {
		// 		console.log("OTP1...............................", otp)
		//      input.nodeValue = otp.code;
		// 	  if (form) form.submit();
		// 	}).catch(err => {
		// 	  console.log(err);
		// 	});
		//   });
		// }
		// if (window['OTPCredential']) {
		window.addEventListener('message', e => {
			console.log("Trigger2...................", e)
			const input = document.querySelector('input[autocomplete="one-time-code"]');
			if (!input) return;
			const ac = new AbortController();
			const form = input.closest('form');
			if (form) {
				console.log("Form data");
				form.addEventListener('submit', e => {
					ac.abort();
				});
			}
			navigator.credentials.get({
				otp: { transport: ['sms'] },
				signal: ac.signal
			}).then(otp => {

				input.nodeValue = otp.code;
				console.log("OTP2...............................", otp.code)
				if (form) form.submit();
			}).catch(err => {
				console.log(err);
			});
		});

		// }



	}




	ngOnInit() {

		//this.loginForm.mobile.length = 0;
		console.log(this.userService.showExit)
		//user details
		this.ldScript.load('font-awesome', 'material-icons').then(data => {
			console.log('font awesome reference added....');
		}).catch(error => console.log('err...', error));

		this.sp_hide = true;
		this.orderedItemCount = 0;
		localStorage.removeItem('catIndex');
		this.userService.showOrderNow = false;
		this.userService.showExit = true;

		// console.log(this.location._platformStrategy._platformLocation.location.origin);
		//cart
		let cartDetails = this.userService.CART_DETAILS();
		this.cartItems = cartDetails.cart_items;



		if (this.browserService.isChrome) {
			this.alterUrl = 'assets/images/Dinamic_Logo.webp'
		}
		else {
			this.alterUrl = 'assets/images/Dinamic_Logo.png'
		}

		let code = encodeURI(localStorage.getItem('access_code'));
		console.log("qrcode.............", code);

		this.apiService.ACCESS_CODE_DETAILS({ "id": 'q', "code": code, baseURL: environment.baseUrl }).subscribe(result => {
			console.log('api call')
			if (result.status) {
				console.log('result -------------------------', result);
				if (result.dinamic_details.table_type == "location") {


					console.log("location origin....", location.origin);
					console.log("restuarent det....", result);
					let isBanner: boolean;
					console.log("image length..........", result.branch_details[0].banner_images.length)
					if (result.branch_details[0].banner_images && result.branch_details[0].banner_images.length) {
						isBanner = true
						console.log("banner images true...............",)
					}
					else {
						isBanner = false;
						console.log("banner images false...............",)
					}
					result.branch_details[0].categories_list[0].categories.forEach(element => {
						let str = element.imageUrl
						if (element.imageUrl) {
							var elems = str.split("/");
							elems.splice(elems.length - 1, 0, this.deviceStringCat)
							element.imageUrl = elems.join("/")
						}

					});




					let categoryList = result.branch_details[0].categories_list[0].categories;
					let logoStr = result.branch_details[0].logo_url ? (environment.img_url + result.branch_details[0].logo_url) : this.alterUrl
					var logoElems = logoStr.split("/");
					logoElems.splice(logoElems.length - 1, 0, this.deviceStringLogo);
					let logoURL = logoElems.join("/")




					console.log("category list....", categoryList);
					this.userService.restaurant_gst = result.branch_details[0].tax_value;
					result.branch_details[0].taxes.forEach((element, index) => {
						if (index != (result.branch_details[0].taxes.length - 1)) {
							this.userService.restuarant_taxes = this.userService.restuarant_taxes + element.value + " + ";
						} else {
							this.userService.restuarant_taxes = this.userService.restuarant_taxes + element.value;
						}
					});

					console.log("restuarant taxes.....", this.userService.restuarant_taxes);
					let itemsCount = 0;


					var str = "/image/picture.jpg";
					var elems = str.split("/");
					elems.splice(elems.length - 1, 0, "original")
					console.log("join...............", elems.join("/"))

					for (let i = 0; i < categoryList.length; i++) {
						itemsCount += categoryList[i].item_count;
					}

					if (result.branch_details[0].has_department_module) {
						result.branch_details[0].departments.forEach(element => {
							let rest = JSON.parse(localStorage.getItem('restaurant_details'))

							if (element.pop_up_banners && element.pop_up_banners.length) {

								rest.departments.filter(element1 => {

									if (element1._id === element._id) {
										console.log("element1...............", element1)
										if (element1.pop_up_banners && element1.pop_up_banners.length && element1.popup == false) {
											element.popup = false;
										}
										else {
											element.popup = true;
										}
									}
								})

							}
						});
					}



					//var items = result.branch_details[0].departments;

					var departments = result.branch_details[0].departments.sort((a, b) => {
						return a.department_order - b.department_order;
					});

					//  console.log("data..........", result.branch_details[0].departments)


					console.log('result -------------------------', result);
					console.log("location origin....", location.origin)
					if (result.dinamic_details.table_type == "location") {
						// location
						let restaurant_details = {
							order_type: "in_house",
							company_id: result.branch_details[0].company_id,
							branch_id: result.branch_details[0]._id,
							floor_id: result.table_detail.floor_id,
							table_id: result.table_detail._id,
							branch_name: result.branch_details[0].name,
							logo_url: result.branch_details[0].logo_url ? (environment.img_url + result.branch_details[0].logo_url) : this.alterUrl,
							service_charge: result.branch_details[0].service_charge ? result.branch_details[0].service_charge : '0',
							customer_editable_sc: result.branch_details[0].customer_editable_sc,
							branch_location: result.branch_details[0].location,
							gst: result.branch_details[0].tax_value,
							restaurant_tax: this.userService.restuarant_taxes,
							valet_service: true,
							session_started_at: result.table_detail.session_started_at,
							offers: [],
							total_items: result.branch_details[0].total_items_count,
							table_order_status: result.table_detail.table_order_status,
							table_name: result.table_detail.name ? result.table_detail.name : '',
							menu_category: categoryList,
							isDepartment: result.branch_details[0].has_department_module,
							departments: result.branch_details[0].departments ? departments : 'empty',
							menu_sections: result.branch_details[0].menu_sections ? result.branch_details[0].menu_sections : [{ 'header': 'Order Now', 'name': 'all', 'section_order': 1 }],
							quick_options: result.branch_details[0].quick_options,
							isBanner: isBanner,
							banner_images: isBanner ? result.branch_details[0].banner_images : 'empty'
						}
						localStorage.setItem('restaurant_details', JSON.stringify(restaurant_details));

					}
					else {
						// locationless
						let restaurant_details = {
							order_type: "take_aways",
							company_id: result.branch_details[0].company_id,
							branch_id: result.branch_details[0]._id,
							branch_name: result.branch_details[0].name,
							branch_location: result.branch_details[0].location,
							logo_url: result.branch_details[0].logo_url ? (environment.img_url + result.branch_details[0].logo_url) : this.alterUrl,
							service_charge: result.branch_details[0].service_charge ? result.branch_details[0].service_charge : '0',
							gst: result.branch_details[0].tax_value,
							restaurant_tax: this.userService.restuarant_taxes,
							valet_service: false,
							offers: [],
							total_items: result.branch_details[0].total_items_count,
							menu_category: categoryList,
							isDepartment: result.branch_details[0].has_department_module,
							departments: result.branch_details[0].departments ? departments : 'empty',
							menu_sections: result.branch_details[0].menu_sections ? result.branch_details[0].menu_sections : [{ 'header': 'Order Food', 'name': 'all', 'section_order': 1 }],
							quick_options: result.branch_details[0].quick_options,
							isBanner: isBanner,
							banner_images: isBanner ? result.branch_details[0].banner_images : 'empty'
						}
						localStorage.setItem('restaurant_details', JSON.stringify(restaurant_details));
					}



					localStorage.setItem('access_type', result.dinamic_details.table_type);
					localStorage.setItem('dinamic_details', JSON.stringify(result.dinamic_details));
					console.log("table Engaged Socket..........*******************")
					// this.socket.emit("table_engaged", resturant_det.table_id);




				}

			} else {
				console.log('response', result);
				console.log('response idle', result);
				document.getElementById("networkAlertModal").click();
				let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
				if (restaurant_det.order_type === 'in_house') {
					this.socket.emit('leave_table', restaurant_det.table_id);
				}
				else {
					this.socket.emit('close_take_away', localStorage.getItem('pos_order_id'));
				}

				// localStorage.clear();
				// sessionStorage.clear();
				this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');
			}
		});




		console.log("restaurant details.......", JSON.parse(localStorage.getItem('restaurant_details')));


		let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
		// this.apiService.RAZOR_WEBHOOK({branch_id:restaurant_det.branch_id}).subscribe(result => {
		// 	console.log("razor result..............", result)
		// })

		if (restaurant_det.table_order_status === 'bill_request') {
			this.userService.showOrderNow = true;
			console.log("billrequest.............")
		}

		this.isDepart = restaurant_det.isDepartment
		console.log("department................", this.isDepart)
		if (!restaurant_det.isDepartment) {


			console.log("department..................", this.restaurant_details.menu_category)

			this.restaurant_details.departments[0].menu_sections.filter(element => {
				element.itemsCount = 0;

				//let myorderitems = this.restaurant_details.menu_category.flat(Infinity);

				this.restaurant_details.menu_category.filter((item) => {
					let menu_items = item.associated_dept_sections.filter((menu) => {
						// console.log('type of tax.value  --------',menu);								
						let t = menu.menu_sections.filter((j) => j._id === element._id && j.selected === true);
						if (t.length) {
							element.itemsCount += Number(item.item_count)
						}

					})
					// console.log('new_tax_rates', menu_items)
					//return menu_items;
				})









			});
		}



		console.log("menu Sections...................", this.restaurant_details.menu_sections)
		let user_details = JSON.parse(localStorage.getItem('user_details'));
		if (JSON.parse(localStorage.getItem('user_details'))) {

			//restaurant session check

			let a = JSON.parse(localStorage.getItem('user_details'));
			let sendData = {
				dinamic_user_id: a.dinamic_user_id,
				access_code: localStorage.getItem("access_code"),
				pos_branch_id: this.restaurant_details.branch_id
			}

			this.apiService.GET_VALET_DETAILS(sendData).subscribe(result => {
				console.log('valet result....', result.status);
				if (result.status === true) {
					this.commonService.valet_details = result.data;
					if (result.data.valet_status) {
						console.log("home valet", result.data.valet_status)
						this.commonService.valetStatus = result.data.valet_status;

						// this.apiService.GET_BILL().subscribe(result => {
						// 	console.log("valet bill.......", result)
						// })
						//	this.router.navigate(['/bill/confirm']);
					} else {
						this.apiService.CANCEL_VALET({ _id: result.data._id }).subscribe(result => {
							console.log('valet result....', result);
						})
					}

				}
			})
			this.billStatus = localStorage.getItem('await_settlement');
			this.paymentStatus = localStorage.getItem('payment_status') ? localStorage.getItem('payment_status') : "";
			let userDetails = JSON.parse(localStorage.getItem('user_details'));
			this.userService.user_name = user_details.name;
			this.user_id = user_details.dinamic_user_id;
			this.photo_url = user_details.photo_url;



			this.apiService.CONFIRMED_ORDERS().subscribe(result => {
				console.log('orders........................', result)
				if (result.status) {
					let order_list = result.orders.order_list;
					if (order_list.length) {
						this.userService.showExit = false;
					} else {
						this.apiService.PLACED_ORDERS().subscribe(reslt => {
							console.log('placed orders1.....', reslt);
							if (reslt.status) {
								let ord_list = reslt.orders.order_list;
								if (ord_list.length) {
									this.userService.showExit = false;
								} else {
									this.userService.showExit = true;
								}
							}
						})
					}

				}
			})

			this.apiService.GET_BILL().subscribe(result => {
				console.log('oms bills.....', result);
				if (result.status) {
					let bills = result.bills.bills;
					console.log("result.bills.bills", result.bills.bills);
					let check_currentuser_ordered = bills.filter(ss => ss.orderer_id === this.user_id);
					console.log('bills....', check_currentuser_ordered);

					if (check_currentuser_ordered.length) {
						this.userService.showOrderNow = true;
						this.userService.showExit = true;
						//this.snackBar.BILLSETTLEMENTINPROGRESS('Bill settlement in progress.', 'OKAY');
						this.router.navigate(['bill/confirm']);

					} else {
						this.snackBar.BILLSETTLEMENTINPROGRESSCLOSE();
						if (!this.take_aways) {
							this.userService.showOrderNow = true;
						}


					}

				}
				else {
					console.log("bills else.....")
					let a = JSON.parse(localStorage.getItem('user_details'));;
					let sendData = {
						dinamic_user_id: a.dinamic_user_id,
						access_code: localStorage.getItem("access_code"),
						pos_branch_id: this.restaurant_details.branch_id
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



			});


		}

		let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;

		if (orderType == 'in_house') {
			this.orderTypeFlag = 'View Bill';
			this.orderContent = 'Order Now'
			this.take_aways = false;
		} else {
			this.orderTypeFlag = 'View Orders';
			this.orderContent = 'Order Food'
			this.take_aways = true;
			//console.log(localStorage.getItem('order_again'));
			// if (localStorage.getItem('order_again')) {
			// 	this.userService.ORDER_AGAIN();
			// }
		}
		console.log("take aways..............", this.take_aways)

		if (localStorage.getItem('payment_status') == 'paid') {
			// document.getElementById('tooltipdiv').setAttribute('data-tooltip','Tab to see your order.');
			// document.getElementById('tooltipdiv').classList.add('tooltip-bottom');
			let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
			if (orderType == 'in_house') {
				this.hideBubble = false;
			} else {
				this.hideBubble = true;
				// this.snackBar.BILLSETTLEMENTINPROGRESS("View your order status here!",'OKAY')
			}

		}
		// push subscription
		if (environment.production && !localStorage.getItem('device_token')) {
			this.swPush.requestSubscription({ serverPublicKey: environment.server_public_key })
				.then(subscription => {
					localStorage.setItem('device_token', JSON.stringify(subscription))
				})
				.catch(err => {
					console.error("Could not subscribe to notifications", err)
				});
		}


		let user_Details = JSON.parse(localStorage.getItem('user_details'));

		if (orderType == 'in_house') {

			if (user_Details) {

				this.apiService.PLACED_ORDERS().subscribe(result => {
					console.log("placed orders2kjbhjbjhb....", result);
					if (result.status) {
						if (result.orders.order_list.length) {

							// console.log("orders found....");              
							this.userService.placed_order_status = true;
							/** Awaiting  strip */
							this.userService.order_number = result.orders.order_number;
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
			} else {

				this.userService.placed_order_status = false;
			}
		} else {
			this.userService.placed_order_status = false;
		}


		console.log('oniniti..............', this.userService.showExit)
	}
	receiveMessage(event) {
		console.log("SMS Meesage Data.....................", event.data)
	}
	receiveMessage1(event) {
		console.log("SMS Meesage Data2.....................", event)
	}
	userIndex(orderList) {
		orderList.forEach((e, i) => {

			if (e.current_user == true) {
				console.log("userIndex...........................", i)
				let count = i;
				return count;
			}
		});

	}
	onKeyPress(event: any) {
		// this.values = event.target.value;
		this.otpForm.error_msg = "";
		this.userService.error_msg = "";
		// console.log(event.target.value.length)

	};

	OnKeyDown(element) {
		//  console.log(element.target.value.length)
	}

	onKeyUp(element) {
		let length = element.target.value.length; //this will have the length of the text entered in the input box
		//console.log(element.target.value.length);
		this.userService.continueBtn = false;
		this.userService.loginSocialDisable = true;

		if (length === 10) {

			let sendData =
			{
				mobile: element.target.value,
				type: 'checkmobile',
				company_id: this.restaurant_details.company_id,
				branch_id: this.restaurant_details.branch_id,
				user_type: 'existing_user'
			}
			this.isReadonly = true;
			console.log("keyup data..........", sendData);
			this.apiService.CHECK_MOBILE_LOGIN(sendData).subscribe(result => {
				console.log("result Mobile..............", result);
				if (result.data && result.data.activation === true) {
					this.userService.loginDetails = result.data;
					this.isReadonly = false;
					this.customer_id = result.data._id;
					this.userService.continueBtn = true;
				}
				else {
					this.userService.isDobFieldVisible = true;
					// this.userService.loginSocialDisable = false;
					this.isReadonly = false;
				}

			})
		}
		else {
			this.userService.loginSocialDisable = true
		}
	}

	onKeyUpDob(element) {
		let value = element.target.value;
		console.log(value);
		if(value) {
			this.userService.loginSocialDisable = false;
			console.log('newvalue ', moment(this.userDob).format('DD-MM-YYYY'));
		} else {
			this.userService.loginSocialDisable = true;
		}
		
	}


	continueSignin(newUserModal, newOTPModal) {
		// newUSerModal.hide() ;
		// newOTPModal.show();
		//	this.social_data['mobile'] = this.mobile_num;

		let userData = this.social_data;
		let sendUserData = {
			'mobile': this.mobile_num,
			'customer_id': this.customer_id,
			'otp_status': 'sent',
			'user_type': 'existing_user',
			'type': 'sentotp',
			'company_id': this.restaurant_details.company_id,
			'branch_id': this.restaurant_details.branch_id,
			'smsType': environment.smsType,
			'smsUrl': environment.smsUrl,
			'smsApiStatus': environment.smsApiStatus
		}

		this.userService.UPDATE_USER(sendUserData).then((userResp: any) => {
			console.log('userResp1....', userResp);
			// this.timeLeft = 60;
			// this.timeLeftString = '00 : 60';
			// this.startTimer();
			newUserModal.hide();
			this.mobileShow = false;
			this.otpForm.otp = "";
			this.sendOTP = true;
			this.loaderStatus = false;
			environment.smsApiStatus ?
				this.signinVerify(newOTPModal) :
				newOTPModal.show();
			this.customer_id = userResp.customer_id;
		})
		this.loaderStatus = true;
		// newUserModal.hide();
		// this.mobileShow = false;
		// this.otpForm.otp = "";
		// this.sendOTP = true;
		// newOTPModal.show();


	}

	signinVerify(newOTPModal) {
		this.loaderStatus = true;
		console.log("otp value.........", this.otpForm.otp)
		let sendUserData = {
			'mobile': this.mobile_num,
			'customer_id': this.customer_id,
			'otp_status': 'verified',
			'type': 'otpverify',
			'otp': environment.smsApiStatus ? '123456' : String(this.otpForm.otp),
			'company_id': this.restaurant_details.company_id,
			'branch_id': this.restaurant_details.branch_id
		}
		console.log("senddata............", sendUserData);
		this.apiService.UPDATE_EXISTING_USER(sendUserData).then(result => {
			console.log('SAVE_SOCIAL_USER....', result);
			console.log("result", result);
			if (result.status) {
				if (result.data.user_id) {
					let userData = {
						id: result.data.user_id,
						social_unique_id: result.data.user_id,
						name: result.data.name,
						email: result.data.email,
						mobile: result.data.mobile,
						provider: result.data.third_party_provider,
						photoUrl: result.data.photo_url,
						user_type: result.data.user_type
					}
					console.log("true2..........", userData)
					this.social_login_user(userData, newOTPModal);
				}
				else {
					let userData = {
						id: result.data._id,
						social_unique_id: result.data._id,
						name: result.data.name,
						email: result.data.email,
						mobile: result.data.mobile,
						email_confirmed: result.data.email_confirmed,
						provider: 'Dinamic',
						user_type: result.data.user_type,
						status: result.status
					}
					console.log("true1..........", userData)
					this.email_login_user(userData, newOTPModal);
				}


			}
			else {

				this.otpForm.error_msg = result.message;
				// this.otpForm.otp = "";
				this.sendOTP = true;
				this.resendOTP = true;
				this.loaderStatus = false;
			}

		})
		this.mobileShow = false;
		this.otpForm.otp = "";
		this.sendOTP = true;
		//	newOTPModal.hide();

	}

	email_login_user(userData, newOTPModal) {
		this.userService.LOGIN(userData).then((result: any) => {
			console.log('user login....', result);
			if (result.status) {
				newOTPModal.hide();
				this.loaderStatus = false;
				this.ngOnInit();
				//modalName.hide();
				if (this.page_redirect) {
					console.log(this.page_redirect);
					if (this.page_redirect === '/myorder') {
						this.router.navigate(['/myorder']);
					} else {
						if (this.page_redirect === '/myoder') {
							this.router.navigate(['/myorder']);
						} else {
							this.router.navigate([this.page_redirect]);
						}

					}

				}

				else if (this.selected_quick_option)
					this.onServiceConfirm(this.selected_quick_option);
			}
			else {
				this.loaderStatus = false;
				this.loginForm.error_msg = result.message;
			}
		});
	}

	social_login_user(userData, newOTPModal) {
		this.userService.SOCIAL_APP_LOGIN(userData).then((result: any) => {
			console.log("userData....", userData)
			if (result.status) {
				this.userService.user_name = userData.name;
				this.photo_url = userData.photoUrl;
				newOTPModal.hide();
				this.loaderStatus = false;
				// if (userData.user_type === 'existing_user') {
				this.apiService.GET_BILL().subscribe(result => {
					console.log('oms bills.....', result);
					if (result.status) {
						this.ngOnInit();
						let bills = result.bills.bills;
						let check_currentuser_ordered = bills.filter(ss => ss.orderer_name === this.user_name);
						console.log('bills....', check_currentuser_ordered);

						if (check_currentuser_ordered.length) {
							this.userService.showOrderNow = true;
							this.userService.showExit = true;

							if (!this.take_aways) {
								this.router.navigate(['bill/confirm']);
							}
							else {

							}

						} else {
							this.userService.showOrderNow = false;
						}
					} else {
						this.userService.showOrderNow = false;
						this.ngOnInit();
						if (this.page_redirect)
							this.router.navigate([this.page_redirect]);
						else if (this.selected_quick_option)
							this.onServiceConfirm(this.selected_quick_option);
					}
				})
				// }

			}
			else this.signupForm.error_msg = result.message;
		}).catch((err) => {
			this.loaderStatus = false;
			console.log("error of home1............", err)
		});
	}
	OTPCloseModal(modalName) {
		modalName.hide();
		this.loaderStatus = false;
	}
	OnKeyFocus(event: any) {
		console.log(this.loginForm.mobile.length)
	}

	handleBubble() {
		// console.log("efhwefwvf");
		this.hideBubble = false;
		localStorage.removeItem('payment_status');
	}

	userIconClick(userModal, logoutModal) {
		this.hideBubble = false;
		localStorage.removeItem('payment_status');
		if (localStorage.getItem('user_details')) {
			logoutModal.show();
			this.socialLogo = false;
		}
		else {
			this.mobile_num = "";
			this.userDob = "";
			this.userService.isDobFieldVisible = false;
			this.userService.continueBtn = false;
			this.userService.loginSocialDisable = true;
			this.isReadonly = false;
			userModal.show();
			this.socialLogo = true;
		}

	}

	onWaiterCall(userModal, serviceModal) {
		this.page_redirect = null;
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
			this.mobile_num = "";
			this.userDob = "";
			this.userService.isDobFieldVisible = false;
			this.userService.continueBtn = false;
			this.userService.loginSocialDisable = true;
			this.isReadonly = false;
			this.socialLogo = true;
			userModal.show();
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
	clearInt() {
		clearInterval(this.interval);
	}

	startTimer() {
		this.interval = setInterval(() => {
			if (this.timeLeft > 0) {
				this.timeLeft--;
				if (this.timeLeft < 10) {
					this.timeLeftString = '00 : 0' + this.timeLeft;
				} else {
					this.timeLeftString = '00 : ' + this.timeLeft;
				}
				//this.sendOTP = true;
				console.log("Timer...........")
			} else {
				//this.sendOTP = false;
				this.resendOTP = true;
				// this.sendOTP = false;
				console.log("Timer Left...........")
				this.timeLeftString = '00 : 00';

				if (this.timeLeft == 0) {
					// this.apiService.OTP_EXPIRATION({ customer_id: this.customer_id }).subscribe(result => {
					// 	console.log("OTP Expiration....", result);
					// 	clearInterval(this.interval);


					// })
					clearInterval(this.interval);
				}

			}
		}, 1000)
	}


	resend_otp() {
		this.apiService.RESEND_OTP({ customer_id: this.customer_id, mobile: this.loginForm.mobile }).subscribe(result => {
			console.log("Resend OTP...", result);

			//this.resendOTP = false;
			this.timeLeft = 60;
			this.timeLeftString = '00 : 60';
			this.startTimer();
		})
	}

	onOtherService(userModal, routingName) {
		console.log('valet sTatus.....', this.commonService.valetStatus)
		// localStorage.setItem('close_tooltip','true');  
		console.log("show exist", this.userService.showExit)
		this.page_redirect = null;
		this.selected_quick_option = null;
		this.socialLogo = true;
		if (routingName == '/myoder') {
			if (this.orderTypeFlag == 'My Orders') {
				routingName = '/myorder';
			}
			if (this.orderTypeFlag == 'View Bill') {
				routingName = '/bill/view';
			}
		}
		console.log(routingName);
		console.log(this.orderTypeFlag);
		if (this.userService.showExit) {
			//console.log("valet")

			if (routingName == 'valet') {
				console.log("qwerty.....", localStorage.getItem('application_type'));
				if (this.commonService.valetStatus) {
					if (this.commonService.valetStatus === 'delivered') {
						if (localStorage.getItem('application_type') == 'ios') routingName = '/valet-ios';
						else routingName = '/valet-android';
					} else {
						document.getElementById("openValetStatusOpenModal").click();
					}
				} else {
					if (localStorage.getItem('application_type') == 'ios') routingName = '/valet-ios';
					else routingName = '/valet-android';
				}

			}

		}

		else {
			if (routingName == 'valet') {
				console.log("qwerty.....", localStorage.getItem('application_type'));
				this.snackBar.OPEN('Please settle your bill to continue.', 'Close');
				this.router.navigate(['/bill/view']);
			}

		}

		if (localStorage.getItem('user_details')) {

			let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;

			console.log('order type...', orderType);

			if (orderType == 'in_house') {
				this.apiService.CONFIRMED_ORDERS().subscribe(result => {
					if (result.status) {
						let order_list = result.orders.order_list;
						if (order_list.length) {
							console.log("qwerty..............", order_list, "............", order_list[0].bill_cost)

							if (order_list[0].bill_cost) {
								console.log(routingName);

								if (routingName == '/valet-android') {
									this.snackBar.OPEN('Please settle your bill to continue.', 'Close');
									// this.router.navigate(['/bill/view']);
								} else {
									// this.router.navigate(['/bill/view']);
								}

							} else {

								if (routingName == '/valet-android') {
									if (this.commonService.valetStatus) {
										if (this.commonService.valetStatus === 'delivered') 
										this.router.navigate(['/valet-android']);
										else
										document.getElementById("openValetStatusOpenModal").click();
									} else {
										this.router.navigate(['/valet-android']);
									}
								} else {
									// this.router.navigate(['/bill/view']);
								}
							}

						} else {
							console.log('asdfg.....', routingName);
							if (routingName == '/valet-android') {
								if (this.commonService.valetStatus) {
									if (this.commonService.valetStatus === 'delivered') 
									this.router.navigate(['/valet-android']);
									else
									document.getElementById("openValetStatusOpenModal").click();
								} else {
									this.router.navigate(['/valet-android']);
								}
							} else {
								// this.router.navigate(['/bill/view']);
							}
						}
					}
					else {
						//No orders found table
						console.log('asdfg.....', routingName);
						if (routingName == '/valet-android') {
							if (this.commonService.valetStatus) {
								if (this.commonService.valetStatus === 'delivered') 
								this.router.navigate(['/valet-android']);
								else
								document.getElementById("openValetStatusOpenModal").click();
							} else {
								this.router.navigate(['/valet-android']);
							}
						} else {
							// this.router.navigate(['/bill/view']);
						}
					}

				});


			} else {
				if (routingName == '/myoder') {
					this.router.navigate(['/myorder']);
				} else {
					this.router.navigate([routingName]);
				}
			}


		}
		else {
			if (routingName === '/valet-android') {
				if (this.commonService.valetStatus) {
					if (this.commonService.valetStatus === 'delivered') 
					this.router.navigate(['/valet-android']);
					else
					document.getElementById("openValetStatusOpenModal").click();
				} else {
					this.router.navigate(['/valet-android']);
				}
			}
			else if (routingName === '/valet-ios') {
				if (this.commonService.valetStatus) {
					if (this.commonService.valetStatus === 'delivered') 
					this.router.navigate(['/valet-ios']);
					else
					document.getElementById("openValetStatusOpenModal").click();
				} else {
					this.router.navigate(['/valet-ios']);
				}
			}
			else {
				this.page_redirect = routingName;
				this.mobile_num = "";
				this.userDob = "";
				this.userService.isDobFieldVisible = false;
				this.userService.continueBtn = false;
				this.userService.loginSocialDisable = true;
				this.isReadonly = false;
				this.socialLogo = true;
				userModal.show();
			}

		}
	}

	socialSignIn(modalName, socialPlatform: string, otpModal) {
		let socialPlatformProvider;
		this.userService.usableLink = false;
		this.loaderStatus = true;
		if (socialPlatform == "facebook") {
			console.log("success2............")
			socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;

		}
		else if (socialPlatform == "google") {
			socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
			console.log("success1............")
			if (socialPlatformProvider) {
				console.log("success............")
			}
			else {
				console.log("false............")
			}

		}

		console.log("HAndle socialPlatformProvider............", socialPlatformProvider)
		if (socialPlatformProvider) {
			console.log("success............")
		}
		else {
			console.log("false............")
		}

		this.socialAuthService.signIn(socialPlatformProvider).then((userData: any) => {
			console.log("social data...", userData);

			let sendData = {
				email: userData.email,
				company_id: this.restaurant_details.company_id
			}
			this.social_data = userData;

			this.userService.usableLink = true;
			// this.apiService.CHECK_MOBILE_SOCIAL_LOGIN(sendData).subscribe(result => {
			// 	console.log("result Login................", result)
			// 	if (result.status === true && result.data.activation === true) {
			// 		this.social_data = userData;							
			// 	    this.userService.error_msg = result.message;

			// 	} else {


			console.log("ask_mobile Data", this.social_data)
			modalName.hide();

			this.social_data['mobile'] = this.mobile_num;

			console.log('user social login details....', this.social_data);
			console.log("social data...", userData);
			let sendUserData = {
				user_id: userData.id,
				social_unique_id: userData.id,
				name: userData.name,
				email: userData.email,
				mobile: userData.mobile,
				dob: moment(this.userDob).format('DD-MM-YYYY'),
				email_confirmed: true,
				photo_url: userData.photoUrl,
				third_party_provider: userData.provider,
				'password': '13579',
				social_user: this.social_data,
				company_id: this.restaurant_details.company_id,
				branch: { branch_id: this.restaurant_details.branch_id, count: 0 },
				user_type: 'new_user',
				smsType: environment.smsType,
				'smsUrl': environment.smsUrl,
				count: 0,

			}
			console.log('Social Sign in User data ', sendUserData);
			this.userService.SAVE_SOCIAL_USER(sendUserData).then((result: any) => {
				console.log('userResp1....', result);
				if (result.status) {
					this.customer_id = result.customer_id;
					this.timeLeft = 60;
					this.userService.loginDetails = result.data;
					modalName.hide();
					this.mobileShow = false;
					this.otpForm.otp = "";
					this.sendOTP = true;
					this.loaderStatus = false
					otpModal.show();
				}
				else {
					this.loaderStatus = false
				}
			})
			// 	}
			// }, err => {
			// 	console.log("Google err............", err)
			// })
		}, err => {
			this.loaderStatus = false;
			console.log("Google err1............", err);
			this.userService.usableLink = true;
		});

	}

	googleSignIn(modalName, socialPlatform: string) {
		this.apiService.LOGIN_WITH_GOOGLE_SOCIAL({ login_with: 'google' }).subscribe(result => {
			console.log("result...", result);
			window.open(result.authUrl, '_blank');
		})
	}


	userRegister(closeModal, openModal) {
		this.signupForm.submit = true;
		this.apiService.DINAMIC_SIGNUP(this.signupForm).subscribe(result => {
			this.signupForm.submit = false;
			if (result.status) {
				this.customer_id = result.customer_id;
				closeModal.hide();
				openModal.show();
			}
			else {
				console.log('response', result);
				this.signupForm.error_msg = result.message;
			}
		});
	}

	userRegisterNew(closeModal) {
		// this.signupForm.submit = true;
		let newSignupForm = {
			'email': this.loginForm.username,
			'name': this.loginForm.name,
			'surname': this.loginForm.surname,
			'mobile': this.loginForm.mobile,
			'password': this.loginForm.password,
			'confirm_password': this.loginForm.confirm_password
		}

		this.apiService.DINAMIC_SIGNUP(newSignupForm).subscribe(result => {
			this.signupForm.submit = false;
			if (result.status) {
				this.customer_id = result.customer_id;
				closeModal.hide();
			}
			else {
				console.log('response', result);
				this.signupForm.error_msg = result.message;
			}
		});
	}

	social_mob_otp_validate(otpModal) {
		this.sendOTP = false;
		this.apiService.SOCIALMOB_OTP_VALIDATE({ customer_id: this.customer_id, otp: String(this.otpForm.otp) }).subscribe((result: any) => {
			console.log("result", result);

			if (result.status) {
				clearInterval(this.interval);
				this.social_data['mobile'] = result.mobile;
				let userData = this.social_data;

				this.userService.SOCIAL_APP_LOGIN(userData).then((result: any) => {

					if (result.status) {
						this.userDetails = JSON.parse(localStorage.getItem('user_details'));
						this.userService.user_name = this.userDetails.name;
						this.photo_url = this.userDetails.photo_url;
						let sendUserData = {
							'name': userData.name,
							'mobile': userData.mobile,
							'email': userData.email,
							'activation': true
						}
						this.apiService.UPDATE_SOCIAL_LOGIN_USER(sendUserData).then((userResp: any) => {
							console.log('userResp....', userResp);
							if (result.status) {
								if (this.page_redirect) {
									console.log("his.page_redirect.........", this.page_redirect)
									this.router.navigate([this.page_redirect]);
								}

								else if (this.selected_quick_option) {
									console.log("this.selected_quick_option", this.selected_quick_option)
									this.onServiceConfirm(this.selected_quick_option);
								}
							}
							else {
								this.sendOTP = true;
								this.resendOTP = true;
							}
						})
						otpModal.hide();

					}
					else this.signupForm.error_msg = result.message;
				});
			}
			else {

				this.otpForm.error_msg = result.message;
				this.otpForm.otp = "";
				this.sendOTP = true;
				this.resendOTP = true;
			}
		})
	}

	userOtpValidate(modalName) {
		console.log("validate initiated...", this.customer_id)
		this.loaderStatus = true;
		//clearInterval(this.interval);
		if (this.otpForm.otp !== '') {
			this.userService.SIGNUP_OTP_VALIDATE({ customer_id: this.customer_id, otp: String(this.otpForm.otp) }).then((result: any) => {
				console.log("OTP Result.....", result)
				if (result.status) {
					// console.log("validation successfull...")
					// this.ngOnInit();
					// this.userService.user_name = ;
					this.loaderStatus = false;
					modalName.hide();
					if (this.page_redirect)
						this.router.navigate([this.page_redirect]);
					else if (this.selected_quick_option)
						this.onServiceConfirm(this.selected_quick_option);
				}
				else {
					this.loaderStatus = false;
					this.otpForm.error_msg = result.message;
					console.log("error OTP")
				};
			});
		}

	}

	onConfirmPassVal(event) {

		console.log("password and confirm");

		if (this.loginForm.password !== this.loginForm.confirm_password) {
			console.log("Mismatch password....");
			this.passwordMismatch = true;

		} else {
			this.passwordMismatch = false;
			this.userService.pass_error = "";
			//	this.loaderStatus = true;
		}


	}

	userEmailCheck(modalName) {
		// console.log(this.loginForm)
		this.passwordMismatch = true;
		if (this.loginForm.name) {
			// console.log("password and confirm");
			this.enterEmailField = false;
			this.enterOtpField = false;
			this.enterNameField = true;
			this.enterPasswordField = true;
			this.confirmPasswordField = true;
			this.mob_num_exist = false;


			this.userService.pass_error = ""
			this.passwordMismatch = false;
			this.loaderStatus = true;
			//this.pleasewait = true;

			if (environment.password === false) {
				this.loginForm.password = '123456'
				this.loginForm.confirm_password = '123456'
			}

			let newSignupForm = {
				'email': this.loginForm.username,
				'name': this.loginForm.name,
				'surname': this.loginForm.surname,
				'mobile': this.mobile_num,
				'password': this.loginForm.password,
				'confirm_password': this.loginForm.confirm_password,
				"company_id": this.restaurant_details.company_id,
				"branch": { "branch_id": this.restaurant_details.branch_id, count: 0 },
				"smsType": environment.smsType,
				'smsUrl': environment.smsUrl
			}

			console.log("Signup Details...", newSignupForm)

			this.apiService.DINAMIC_SIGNUP(newSignupForm).subscribe(result => {
				//  this.signupForm.submit = false;
				console.log("signup result Data.........", result)
				if (result.status) {
					//	this.pleasewait = false;
					this.loaderStatus = false;
					this.customer_id = result.customer_id;
					this.user_name = result.name;
					let sendData = {
						"user": this.customer_id,
						"company_id": this.restaurant_details.company_id,
						"branch_id": this.restaurant_details.branch_id,
						"userBaseURL": environment.userBaseURL
					}
					this.apiService.SEND_CONFIRM_EMAIL_LINK(sendData).subscribe(result => {
						console.log("mail result...", result);
						if (result.status) {
							this.loaderStatus = false;

						}
						else {
							this.loaderStatus = false;
						}

					})

					this.enterPasswordField = false;
					this.confirmPasswordField = false;
					this.enterNameField = false;
					this.mob_num_exist = false;
					this.enterOtpField = true;
					//this.loginForm.name = "";
					//this.loginForm.password = "";
					//this.loginForm.confirm_password = "";
				}
				else {
					console.log('response', result);
					this.loaderStatus = false;
					//this.pleasewait = false;						
					this.loginForm.error_msg = result.message;
					this.signupForm.error_msg = result.message;
				}
			});



		}

		else if (this.loginForm.password) {
			this.userService.LOGIN(this.loginForm).then((result: any) => {
				console.log('user login....', result);
				if (result.status) {
					this.ngOnInit();
					modalName.hide();
					if (this.page_redirect) {
						console.log(this.page_redirect);
						if (this.page_redirect === '/myorder') {
							this.router.navigate(['/myorder']);
						} else {
							if (this.page_redirect === '/myoder') {
								this.router.navigate(['/myorder']);
							} else {
								this.router.navigate([this.page_redirect]);
							}
						}
					}
					else if (this.selected_quick_option)
						this.onServiceConfirm(this.selected_quick_option);
				}
				else this.loginForm.error_msg = result.message;
			});
		}

		else if (this.loginForm.username) {

			this.enterEmailField = false;
			this.enterNameField = true;
			this.enterPasswordField = true;
			this.confirmPasswordField = true;
			this.enterOtpField = false;
			this.mob_num_exist = false;
			//this.loginForm.name = "";
			this.loginForm.password = "";


		}

	}

	closeLogin() {
		// console.log("jhggeghjhegbj");
		this.enterEmailField = true;
		this.enterOtpField = false;
		this.enterNameField = true;
		this.enterMobileField = false;
		this.enterSurNameField = false;
		this.enterPasswordField = false;
		this.confirmPasswordField = false;
		this.pleasewait = false;
		this.mob_num_exist = false
		this.loginForm = {};
		clearInterval(this.interval);
	}

	goBack(m1, m2) {
		if (this.enterEmailField) {
			m1.hide();
			this.closeLogin()
			m2.show()
		}
		else if (this.enterNameField && this.enterPasswordField && this.confirmPasswordField) {
			this.enterEmailField = true;
			this.enterOtpField = false;
			this.enterNameField = true;
			this.enterPasswordField = false;
			this.confirmPasswordField = false;
			this.pleasewait = false;
			this.loginForm.confirm_password = "";
			this.loginForm.password = ""
			this.mob_num_exist = false
		}
	}

	userLogin(modalName) {
		this.userService.LOGIN(this.loginForm).then((result: any) => {
			console.log('user login....', result);
			if (result.status) {
				this.ngOnInit();
				modalName.hide();
				if (this.page_redirect) {
					console.log(this.page_redirect);
					if (this.page_redirect === '/myorder') {
						this.router.navigate(['/myorder']);
					} else {
						if (this.page_redirect === '/myoder') {
							this.router.navigate(['/myorder']);
						} else {
							this.router.navigate([this.page_redirect]);
						}
					}
				}
				else if (this.selected_quick_option)
					this.onServiceConfirm(this.selected_quick_option);
			}
			else this.loginForm.error_msg = result.message;
		});
	}

	onLogout() {
		this.yesBtnStatus = true;
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
					if (rsult.status) {
						// Block Order Now and show bill settlement in progress snackbar
						let bills = rsult.bills.bills;
						let check_currentuser_ordered = bills.filter(ss => ss.orderer_id === this.user_id);
						console.log('bills....', check_currentuser_ordered);

						if (check_currentuser_ordered.length) {
							let order_list = result.orders.order_list;
							if (order_list.length) {
								if (this.take_aways) {
									this.router.navigate(['/myorder']);
								}
								else {
									this.router.navigate(['/bill/confirm']);
								}

							} else {
								this.apiService.PLACED_ORDERS().subscribe(res => {
									if (res.status) {
										let ord_list = res.orders.order_list;
										console.log('ord_list1-----------------------', ord_list)
										if (ord_list.length) {
											if (this.take_aways) {
												this.router.navigate(['/myorder']);
											}
											else {
												this.router.navigate(['/order-status']);
											}

										} else {
											this.apiService.DINAMIC_LOGOUT(userData).subscribe(result => {

												//this.socket.disconnect();
												let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
												if (this.take_aways) {
													this.socket.emit('close_take_away', localStorage.getItem("pos_order_id"));
												}
												else {
													this.socket.emit('leave_table', restaurant_det.table_id);
												}
												localStorage.clear();
												sessionStorage.clear();
												this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');

												this.router.navigate(['/']);
											});
										}
									}
								})

							}
						}
						else {
							this.apiService.DINAMIC_LOGOUT(userData).subscribe(result => {

								//this.socket.disconnect();
								let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
								if (this.take_aways) {
									this.socket.emit('close_take_away', localStorage.getItem("pos_order_id"));
								}
								else {
									this.socket.emit('leave_table', restaurant_det.table_id);
								}
								this.userService.user_name = "";
								localStorage.clear();
								sessionStorage.clear();
								this.snackBar.CLOSE();
								this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');

								this.router.navigate(['/']);
							});


						}
					} else {

						let order_list = result.orders.order_list;
						if (order_list.length) {
							if (this.take_aways) {
								this.router.navigate(['/myorder']);
							}
							else {
								this.router.navigate(['/bill/view']);
							}
						} else {
							this.apiService.PLACED_ORDERS().subscribe(res => {
								if (res.status) {
									let ord_list = res.orders.order_list;
									console.log('ord_list2-----------------------', ord_list)
									if (ord_list.length) {
										if (this.take_aways) {
											this.router.navigate(['/myorder']);
										}
										else {
											this.router.navigate(['/order-status']);
										}

									} else {
										this.apiService.DINAMIC_LOGOUT(userData).subscribe(result => {

											//this.socket.disconnect();
											let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
											if (this.take_aways) {
												this.socket.emit('close_take_away', localStorage.getItem("pos_order_id"));
											}
											else {
												this.socket.emit('leave_table', restaurant_det.table_id);
											}
											localStorage.clear();
											sessionStorage.clear();
											this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');

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
					console.log("restaurant_det logout........", restaurant_det)
					if (this.take_aways) {
						this.socket.emit('close_take_away', localStorage.getItem("pos_order_id"));
					}
					else {
						this.socket.emit('leave_table', restaurant_det.table_id);
					}
					this.userService.user_name = "";
					localStorage.clear();
					sessionStorage.clear();
					this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');
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
	closeModal1(modalName) {
		modalName.hide();
		this.router.navigate(['/']);
	}

	forgotRequest() {
		this.forgotForm.submit = true;
		this.apiService.FORGOT_PWD_REQUEST(this.forgotForm).subscribe(result => {
			this.forgotForm.submit = false;
			if (result.status) {
				this.forgotForm.success_msg = "Email sent successfully";
			}
			else {
				this.forgotForm.error_msg = result.message;
				console.log('response', result);
			}
		});
	}

	addUserMobile(askmobilemodal, otpModal) {
		// console.log("mobile number", this.mobile_num);
		this.social_data['mobile'] = this.mobile_num;
		let userData = this.social_data;
		console.log('user social login details....', userData);
		console.log("social data...", userData);
		//	console.log('social login.....', result);

		let userDetails = JSON.parse(localStorage.getItem("user_details"))
		console.log("userDetails.............", userDetails)
		//	this.user_name = userDetails.name;
		//this.photo_url = userDetails.photo_url;
		//this.ngOnInit();
		// Save Social Login User.....
		let sendUserData = {
			'name': userData.name,
			'surname': '',
			'mobile': userData.mobile,
			'email': userData.email,
			'password': '13579',
			'email_confirmed': true,
		}

		this.userService.SAVE_SOCIAL_USER(sendUserData).then((userResp: any) => {
			console.log('userResp1....', userResp);
			// this.timeLeft = 60;
			// this.timeLeftString = '00 : 60';
			//this.startTimer();
			this.customer_id = userResp.customer_id;
		})

		askmobilemodal.hide();
		this.mobileShow = false;
		this.otpForm.otp = "";
		this.sendOTP = true;
		otpModal.show();
		// if (this.page_redirect) {
		// 	console.log("his.page_redirect.........", this.page_redirect)
		// 	this.router.navigate([this.page_redirect]);
		// }

		// else if (this.selected_quick_option) {
		// 	console.log("this.selected_quick_option", this.selected_quick_option)
		// 	this.onServiceConfirm(this.selected_quick_option);
		// }




	}
	changeMobile() {
		this.mobileShow = true
		//this.mobile_num = this.otpMobile;
	}
	cancelMobile() {
		this.mobileShow = false
		// this.mobile_num="+91 "+this.otpMobile;
	}
	social_resend_otp() {
		let userData = this.social_data;
		console.log('user social login details....', userData);
		console.log("social data...", userData);
		//	console.log('social login.....', result);		
		let userDetails = JSON.parse(localStorage.getItem("user_details"))
		console.log("userDetails.............", userDetails)
		//	this.user_name = userDetails.name;
		//this.photo_url = userDetails.photo_url;
		//this.ngOnInit();
		// Save Social Login User.....

		let sendUserData = {
			'name': userData.name,
			'surname': '',
			'mobile': userData.mobile,
			'email': userData.email,
			'password': '13579',
			'email_confirmed': true,

		}
		this.userService.SAVE_SOCIAL_USER(sendUserData).then((userResp: any) => {
			this.sendOTP = true;
			this.resendOTP = false;
			console.log('userResp....', userResp);
			this.timeLeft = 60;
			this.timeLeftString = '00 : 60';
			this.startTimer();
			this.customer_id = userResp.customer_id;
		})


	}

	goToOrderStatus() {
		this.router.navigate(['/order-status']);
		localStorage.setItem("viewStatus", "awaiting")
	}
	sectionList(x, modalName) {
		this.loaderStatus = true;
		localStorage.setItem('selected_section_name', x._id);
		//this.router.navigate(['/menu/categories/tag']);
		this.popupBanner = {};
		console.log("section data.........", x)
		this.router.navigate(['/menu/sections']);


	}

	categoryList(x) {
		this.loaderStatus = true;
		localStorage.setItem('selected_tag_name', x._id);
		localStorage.setItem('selected_tag_header', x.header);

		this.router.navigate(['/menu/categories']);
	}
	popup_linked_category(id) {

		localStorage.setItem('selected_tag_name', id);
		let data = {};
		let t = this.restaurant_details.menu_category.filter((j) => {
			if (j._id === id) {
				j.popup = true;
				data = j;
			}
		});
		let category = data;
		localStorage.setItem('selected_category', JSON.stringify(category));
		this.router.navigate(['/menu/items'])
	}
	exitConfirm(modalName) {
		modalName.show();
	}
	exitHome(modalName) {
		modalName.hide();
		let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
		if (restaurant_det.order_type === 'in_house') {
			this.socket.emit('leave_table', restaurant_det.table_id);
		}
		else {
			this.socket.emit('close_take_away', localStorage.getItem('pos_order_id'));
		}
		// this.socket.emit('leave_valet', '123456'); 
		localStorage.clear();
		sessionStorage.clear();
		this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');
		this.router.navigate(['/']);
	}
	// ngAfterViewInit(){
	//   if ('serviceWorker' in navigator) {
	//     window.addEventListener('load', function() {
	//       navigator.serviceWorker.register('src/service-worker.js');
	//     });
	//   }
	// }

	// testCallback(){
	//   this.loadScript('assets/js/testScript.js', function(){
	//     newFunction();
	//   })
	// }

	// loadScript(src, callback) {
	//   let script = document.createElement('script');
	//   script.src = src;

	//   script.onload = () => callback(script);

	//   document.head.append(script);
	// }

	testCallback() {

		// this.loadScript('assets/js/testScript.js')
		// .finally( () => console.log('promise is ready....'))
		// .then( result => {
		//   console.log('result.....', result);
		// })

		let urls = [
			'https://api.github.com/users/iliakan',
			'https://api.github.com/users/remy',
			'https://api.github.com/users/jeresig'
		];
		let req = urls.map(url => fetch(url));
		console.log('req....', req);

		Promise.all(req)
			.then(response => {
				// console.log('promise response.....', response);
				return response;
			})
			.then(res => {
				console.log('*', res);
				Promise.all(res.map(r => r.json()))
			})
			.then(user => {
				console.log('users....', user);
			})
	}

	loadScript(src) {
		return new Promise((resolve, reject) => {
			let script = document.createElement('script');
			script.src = src;

			script.onload = () => resolve(script);

			document.head.append(script);
		})

	}

	payU() {
		let data = {
			key: 'mmTCUHt9',
			salt: 'cLT82exxoF',
			txnid: 'order_123456',
			// hash: 'defdfaadgerhetiwerer',
			amount: '100',
			firstname: 'Hariharamoorthi',
			email: 'azurehari@gmail.com',
			// phone: '6111111111',
			productinfo: 'Bag',
			udf5: 'BOLT_KIT_NODE_JS'
			// surl : 'https://sucess-url.in',
			// furl: 'https://fail-url.in',
			// mode:'dropout'// non-mandatory for Customized Response Handling
		}

		let hash = sha512.sha512.create();
		let text = data.key + '|' + data.txnid + '|' + data.amount + '|' + data.productinfo + '|' + data.firstname + '|' + data.email + '|||||' + data.udf5 + '||||||' + data.salt;

		hash.update(text);
		let hashVal = hash.hex();
		let hashValStr = JSON.stringify(hashVal);

		let requesData = {
			key: 'mmTCUHt9',
			salt: 'cLT82exxoF',
			txnid: 'order_123456',
			hash: hashVal,
			amount: '100',
			firstname: 'Hariharamoorthi',
			email: 'azurehari@gmail.com',
			phone: '9080304864',
			productinfo: 'Bag',
			udf5: 'BOLT_KIT_NODE_JS',
			surl: 'http://localhost:4200/home',
			furl: 'http://localhost:4200/home',
			// mode:'dropout'// non-mandatory for Customized Response Handling
		}

		let Handler = {

			responseHandler: function (BOLT) {
				// your payment response Code goes here, BOLT is the response object
				console.log('response....', BOLT);
			},
			catchException: function (BOLT) {
				// the code you use to handle the integration errors goes here
				console.log('response....', BOLT);
			}
		}

		bolt.launch(requesData, Handler);

	}

	payUBiz() {

		let data = {
			key: 'mmTCUHt9',
			salt: 'cLT82exxoF',
			txnid: 'order_123456',
			// hash: 'defdfaadgerhetiwerer',
			amount: '10',
			firstname: 'Hariharamoorthi',
			lastname: 'S',
			email: 'azurehari@gmail.com',
			phone: '9080304864',
			productinfo: 'Bag',
			udf5: 'BOLT_KIT_NODE_JS'
			// surl : 'https://sucess-url.in',
			// furl: 'https://fail-url.in',
			// mode:'dropout'// non-mandatory for Customized Response Handling
		}

		let hash = sha512.sha512.create();
		let text = data.key + '|' + data.txnid + '|' + data.amount + '|' + data.productinfo + '|' + data.firstname + '|' + data.email + '|||||' + data.udf5 + '||||||' + data.salt;

		hash.update(text);
		let hashVal = hash.hex();


		let requesData = {
			key: 'mmTCUHt9',
			salt: 'cLT82exxoF',
			txnid: 'order_123456',
			hash: hashVal,
			amount: '10',
			firstname: 'Hariharamoorthi',
			lastname: 'S',
			email: 'azurehari@gmail.com',
			phone: '9080304864',
			productinfo: 'Bag',
			udf5: 'BOLT_KIT_NODE_JS',
			surl: 'http://localhost:4200/home',
			furl: 'http://localhost:4200/categories'
			// mode:'dropout'// non-mandatory for Customized Response Handling
		}

		this.apiService.PAYUBIZ_PAYMENT_REQUEST(requesData).subscribe(result => {
			console.log('response....', result);
		})

	}
	deleteCookies() {
		var allCookies = document.cookie.split(';');

		// The "expire" attribute of every cookie is  
		// Set to "Thu, 01 Jan 1970 00:00:00 GMT" 
		for (var i = 0; i < allCookies.length; i++)
			document.cookie = allCookies[i] + "=;expires="
				+ new Date(0).toUTCString();

		console.log(document.cookie);

	}


	//Valet


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


}
