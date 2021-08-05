import { Component, OnInit, Injectable, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { ApiService } from '../../_services/api.service';
import { SnackbarService } from '../../_services/snackbar.service';
import { MenuStorageService } from '../../_services/menu-storage.service';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import {DeviceDetectorService} from 'ngx-device-detector';
// import { Razorpay } from 'https://checkout.razorpay.com/v1/checkout.js';
import { WindowRef } from '../../_services/winref.service';
import { LoadscriptService } from 'src/app/_services/loadscript.service';
import { environment } from '../../../environments/environment';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
import { Location,PlatformLocation  } from '@angular/common';


import * as _ from "lodash";
declare var Razorpay: any;
declare var Instamojo: any;
declare let $: any;
import { Socket } from 'ngx-socket-io';


@Component({
	selector: 'app-cart',
	templateUrl: './cart.component.html',
	styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
	public layout: any = 'alphanumeric';
	razorpayOptions: any ;
	serviceStatus:any ;
	rzp:any;
	@ViewChild('openModal', { static: true }) openModal: ElementRef;
	@ViewChild('confirmModal', { static: true }) confirmModal: ElementRef;
	@ViewChild('triggerModal', { static: true }) triggerModal: ElementRef;
	@ViewChild('triggerCustomization', { static: true }) triggerCustomization: ElementRef;
	@ViewChild('closeCustomization', { static: true }) closeCustomization: ElementRef;
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	pageType: string = ''; cart: any = [];
	showlabel: boolean = true;
	paymentFailed: boolean;
	order_id: string;
	resendOTP:boolean = false;
	sendOTP:boolean = true;	
	photo_url:string;
	cartItems; cartTotal; tax; cartIncTax; cartTax: any;
	userDetails: any; customer_id: any;
	signupForm: any = {}; otpForm: any = {}; loginForm: any = {}; forgotForm: any = {};
	lp_hide: boolean; sp_hide: boolean;
	show_cust_popup: boolean;
	item: any = {};
	cartItemDetails: any;
	itemRepeatFooter: boolean;
	special_request: string;
	item_cost_flag: Number = 0;
	addonList: any;
	menu_items: any = [];
	enterEmailField: boolean = true;
	enterNameField: boolean = true;
	enterSurNameField: boolean = false;
	enterPasswordField: boolean = false;
	confirmPasswordField: boolean = false;
	enterMobileField: boolean = false;
	enterOtpField: boolean = false;
	pleasewait: boolean = false;
	illchoose: boolean = false;
	passwordMismatch: boolean = false;
	interval: any;
	timeLeft: number = 30;
	timeLeftString: String = '00 : 30';
	mob_num_exist: boolean = false;
	exist_email: String = '';
	social_data: any;
	mobile_num: any;
	razor_var: any;
	REQUEST_URL: any;
	showAddToOrder: boolean = false;
	hideConfirmOrder: boolean = true;
	showYesBtn: boolean = true;
	take_aways: boolean = false;
	awaitingcontent: any;
	index: any;
	payment_url: any;
	otpMobile: any
	mobileShow: boolean = false;
	deviceData:any;
	isChrome:boolean = false;
	loaderStatus:boolean;
	payOnlineStatus:boolean;
	socialLogo:boolean = false;
	keyId:string;
	modalLogo:boolean = false;
	isReadonly:boolean = false;
	user_name:any;
	constructor(private router: Router, private winRef: WindowRef, private route: ActivatedRoute, public userService: UserService,
		private socialAuthService: AuthService, private apiService: ApiService, public snackBar: SnackbarService, private menuStorageService: MenuStorageService,
		private loadScript: LoadscriptService, private socket: Socket, private deviceService: DeviceDetectorService, private browserService :UserBrowserService, private location: PlatformLocation) { 
			location.onPopState(() => {
				console.log("category back...............")
				this.router.navigate(['/menu/items']);
			});	
		}
		restaurantDetails:any = JSON.parse(localStorage.getItem('restaurant_details'));
		customer_editable_sc:any = this.restaurantDetails.customer_editable_sc;
	ngOnInit() {
		//this.hideConfirmOrder = true;
		if(JSON.parse(localStorage.getItem('user_details')))
				{
					this.userDetails = JSON.parse(localStorage.getItem('user_details'));
					
				}

		
		this.deviceData = this.deviceService.getDeviceInfo();
		
		if(this.deviceData.browser === 'Chrome')
		{
		this.isChrome = true;
		}
		else
		{
		this.isChrome = false;
		}
		
		let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'))
		if (restaurant_details.order_type == 'take_aways') {
			this.take_aways = true;
			this.serviceStatus = false;
		}
		else {
			this.take_aways = false;
			this.serviceStatus = true;
		}
		

		this.loadScript.load('font-awesome', 'material-icons').then(data => {
			console.log('font awesome reference added....');
		}).catch(error => console.log('err...', error));

		this.sp_hide = true;
		this.paymentFailed = false;
		this.show_cust_popup = false;
		this.itemRepeatFooter = false;
		// this.triggerModal.nativeElement.click();
		// console.log(JSON.parse(localStorage.getItem('user_details')));
		this.apiService.PAYMENT_GATEWAY_DETAILS({access_code: localStorage.getItem('access_code')}).subscribe(result => {
		console.log("Payment Dtails..................", result);
		if(result.data.status === 'active')
		{
			console.log("payment..................")
			this.payOnlineStatus = true;
			this.keyId = result.key_id;
			this.razorpayOptions = {
				"key": this.keyId,
				"name": "DiNAMIC",
				"description": "Restaurant Application",
				"modal": { "ondismiss": () => { } }
				}
				
					
				
		}
		else
		{
			this.payOnlineStatus = false;
		}
		});
	
	
		this.cart = JSON.parse(localStorage.getItem('cart'));
		if (!this.cart) { this.cart = []; }
		let cartDetails = this.userService.CART_DETAILS();
		console.log("cart Details......................", cartDetails)


		// this.tax = Math.round(cartDetails.cart_total * (this.userService.restaurant_gst/100));
		this.tax =  cartDetails.tax;			
		this.cartItems = cartDetails.cart_items;
		this.cartTotal = cartDetails.cart_total;
		this.cartTax = cartDetails.tax;
		this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
		this.showlabel = true;

		console.log("service charge..............", restaurant_details.service_charge)
		if (restaurant_details.service_charge != '0') {
			
			let service_charge = Number(restaurant_details.service_charge) / 100
			console.log("service charge1..............", cartDetails.cart_total)
			this.userService.service_charge = (service_charge * cartDetails.cart_total);
			console.log("service Charge...........................", this.userService.service_charge)
		}
		else {
			this.userService.service_charge = 0;
		}


		//  console.log('cart details....', cart details....);

		// let newtax= this.taxcalc(this.cart);
		//console.log("newtax......................",newtax)
		// if(localStorage.getItem('payment_status') == 'raised'){
		//   // this.paymentFailed = true;
		//   this.triggerModal.nativeElement.click();
		//   localStorage.removeItem('payment_status');
		// }

		let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;

		if (orderType == 'in_house') {

			if (this.userDetails) {
				// this.dynamicAssetLoader.load('font-awesome', 'google-font').then(data => {
				// }).catch(error => console.log("err", error));
				this.apiService.PLACED_ORDERS().subscribe(result => {
					console.log("placed orders....", result);
					
					if (result.status) {
						if (result.orders.order_list.length) {
							this.userService.order_number = result.orders.order_number;
							// console.log("orders found....");           
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
						let check_currentuser_ordered = bills.filter(ss => ss.orderer_name != this.userDetails.name);
						console.log('bills....', check_currentuser_ordered);

						if (check_currentuser_ordered.length) {
							this.userService.showOrderNow = true;
							//this.snackBar.BILLSETTLEMENTINPROGRESS('Bill settlement in progress.', 'OKAY');
							this.router.navigate(['bill/confirm']);
						} else {
							this.userService.showOrderNow = false;
						}
					} else {
						this.userService.showOrderNow = false;
					}
				})
			} else {
				this.userService.placed_order_status = false;
			}
			
		} else {
			this.loadScript.load('instamojo').then(data => {
				console.log('instamojo reference added....');
			}).catch(error => console.log('err...', error));
			this.userService.placed_order_status = false;
			
		}


		// alert modal
		this.route.params.subscribe((params: Params) => {
			if (params['type'] == 'bill') {
				this.pageType = 'bill';
				this.userService.CART_LENGTH().then(result => {
					if (result) {
						let openModal: HTMLElement = this.openModal.nativeElement as HTMLElement;
						openModal.click();
					}
				});
			}
		});
		console.log("loader Status..........", this.hideConfirmOrder)

		
		//this.loaderStatus = false;
		this.hideConfirmOrder = false;
	
	}

   loaderTrueStatus()
   {
	   this.loaderStatus = true;	  
	   console.log("loader true................")
   }
   loaderFalseStatus(x,y)
   {
	   if(x===y)
	   {
		this.hideConfirmOrder = false;
		//this.loaderStatus = false;
		console.log(x,"-------------",y)
	   }
	 
	   console.log("loader false................")
   }
	ngAfterViewInit() {
		// this.triggerModal.nativeElement.click();
		
		if (localStorage.getItem('payment_status') == 'raised') {
			// this.paymentFailed = true;
			// JSON.parse(localStorage.getItem('restaurant_details')).order_type
			if (this.userDetails) {
				if (JSON.parse(localStorage.getItem('restaurant_details')).order_type == 'in_house') {

				} else {
					this.triggerModal.nativeElement.click();
				}
			}
			localStorage.removeItem('payment_status');
		}
	}



	payWithCash(modalname, paymentModal) {
		this.otpForm.error_msg = "";
		paymentModal.hide();
		modalname.show();
		this.mobileShow = false;
		let userDetails = JSON.parse(localStorage.getItem('user_details'))
		this.otpMobile = userDetails.mobile;
		this.mobile_num = userDetails.mobile;
		console.log(this.otpMobile)

	}

	changeMobile() {
		this.mobileShow = true
		//this.mobile_num = this.otpMobile;
	}
	cancelMobile() {
		this.mobileShow = false
		// this.mobile_num="+91 "+this.otpMobile;
	}
	checkValue(event: any){
		this.cart = JSON.parse(localStorage.getItem('cart'));
		if (!this.cart) { this.cart = []; }
		let cartDetails = this.userService.CART_DETAILS();
		console.log("cart Details......................", cartDetails);
		// this.tax = Math.round(cartDetails.cart_total * (this.userService.restaurant_gst/100));
		this.tax =  cartDetails.tax;			
		this.cartItems = cartDetails.cart_items;
		this.cartTotal = cartDetails.cart_total;
		this.cartTax = cartDetails.tax;
		this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
		this.showlabel = true;

		console.log(event);
		console.log(event.target.checked)
		if(event.target.checked)
		{
	this.serviceStatus =  true;
	console.log("service charge..............", this.restaurantDetails.service_charge)
	if (this.restaurantDetails.service_charge != '0') {
		
		let service_charge = Number(this.restaurantDetails.service_charge) / 100
		console.log("service charge1..............", cartDetails.cart_total)
		this.userService.service_charge = (service_charge * cartDetails.cart_total);
		console.log("service Charge...........................", this.userService.service_charge)
	}
	else {
		this.userService.service_charge = 0;
	}


		}
		else
		{
		  this.serviceStatus = false;
		  if (this.restaurantDetails.service_charge != '0') {
		
			let service_charge = Number(this.restaurantDetails.service_charge) / 100
			console.log("service charge1..............", cartDetails.cart_total)
			this.userService.service_charge = 0;
			console.log("service Charge...........................", this.userService.service_charge)
		}
		else {
			this.userService.service_charge = 0;
		}
		}
	
	 }

	payOnline() {
		this.userDetails = JSON.parse(localStorage.getItem('user_details'));
		let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'))
		console.log("service charge..............", restaurant_details.service_charge);
		this.cart = JSON.parse(localStorage.getItem('cart'));
		if (!this.cart) { this.cart = []; }
		let cartDetails = this.userService.CART_DETAILS();
		console.log("cart Details......................", cartDetails);
		// this.tax = Math.round(cartDetails.cart_total * (this.userService.restaurant_gst/100));
		this.tax =  cartDetails.tax;			
		this.cartItems = cartDetails.cart_items;
		this.cartTotal = cartDetails.cart_total;
		this.cartTax = cartDetails.tax;
		this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
		this.showlabel = true;

		if (restaurant_details.service_charge != '0') {
			let service_charge = Number(restaurant_details.service_charge) / 100
			console.log("service charge1..............", cartDetails.cart_total)
			this.userService.service_charge = (service_charge * cartDetails.cart_total);
			console.log("service Charge...........................", this.userService.service_charge)
		}
		else {
			this.userService.service_charge = 0;
		}

		console.log("payonline", this.userDetails);		
		console.log("take_away3 userservice......................");
	    let order_id;
		if (localStorage.getItem('order_again')) {
			//console.log("new pos id")
			let orderId = this.orderIdGenerator();
			console.log("order id...", orderId);
			this.socket.emit('take_away', orderId);
			console.log("order again......................")
			localStorage.setItem("pos_order_id", orderId);
			order_id = orderId;
		}	
		else
		{
			order_id = localStorage.getItem('pos_order_id');
			this.socket.emit('take_away', localStorage.getItem('pos_order_id'));
		}
	
		let orderData = {
			"order_details": {
				"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
				"item_details": JSON.parse(localStorage.getItem('cart')),
			},
			"cart_total":   Math.round(this.cartTotal + this.cartTax + this.userService.service_charge ),
			"email": this.userDetails.email,
			"name": this.userDetails.dinamic_user_name,
			"mobile": this.userDetails.mobile,
			"bill_id":  order_id,
			"order_number": order_id
		};
		console.log("orderdata.........", orderData);
		console.log('orderData ------------', orderData.order_details);
	
		localStorage.setItem('order_again', 'new');
		this.apiService.CONFIRM_PAYMENT(orderData).subscribe(result => {
			console.log("payment result...........", result)
			if(result.status)
			{
				// let storeOrderId = result.data.order_id;
				let razoypayOrderId = result.data.razorpay_response.id;
				// razorpay response handler
				this.razorpayOptions.handler = (response) => {
					let paymentId = response.razorpay_payment_id;					
					window.location.href = environment.paymentLink+"checkout/payment-confirm?payment_request_id="+paymentId+"&order_id="+orderData.bill_id+"&order_number="+orderData.order_number;				

				};
				this.razorpayOptions.order_id = razoypayOrderId;
				// open razorpay modal
				this.rzp = new this.winRef.nativeWindow.Razorpay(this.razorpayOptions);
                this.rzp.open();
			//	new this.winRef.nativeWindow.Razorpay(this.razorpayOptions).open();
			}
			
			// if (result.status) {
			// 	//Generate order id here for every order , get and set the token for POS...
			// 	//set the token - localstorage(user_details).token

			// 	this.apiService.GET_ORDER_ACCESS_TOKEN().subscribe(result => {
			// 		if (result.status) {
			// 			console.log("New Token.....", result.token);
			// 			let new_obj = JSON.parse(localStorage.getItem('user_details'));
			// 			new_obj.token = result.token;
			// 			localStorage.setItem('user_details', JSON.stringify(new_obj));
			// 		}
			// 	})

			// 	localStorage.setItem('current_user_order_id', '<To be Generated>');

			// 	localStorage.setItem('payment_status', 'raised');
			// 	// this.router.navigate([result.data.payment_url]);
			// 	// window.open(result.data.payment_url, "_self");
			// 	this.payment_url = result.data.payment_url
			// 	console.log("url....", this.payment_url)
			// 	window.open(this.payment_url, "_self");
			// 	//   Instamojo.open(result.data.payment_url); 

			// } else {
			// 	console.log('response', result);
			// }

		})

	}	


	onAddItem(index) {
		this.cart[index].quantity = this.cart[index].quantity + 1;
		localStorage.setItem('cart', JSON.stringify(this.cart));
		let cartDetails = this.userService.CART_DETAILS();
		this.tax =  cartDetails.tax;			
		this.cartItems = cartDetails.cart_items;
		this.cartTotal = cartDetails.cart_total;
		this.cartTax = cartDetails.tax;
		this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
	}



	scrollModalTop() {
		setTimeout(() => {
		  $('.modal-body').each(function(index, element) {
			let className = 'modal-body'+(index+1);
			element.classList.add(className);
			$("."+className).scrollTop(0);
		  });
		}, 500);
	  }

	viewCustomizations(x, customizationmodal, cartId) {
		this.showAddToOrder = true;
		this.scrollModalTop();
		console.log("view customization ----------------- x", x);
		console.log("cart ID ----------------- ", cartId);

		this.item_cost_flag = 0;
		this.illchoose = false;
		this.addonList = x.applied_addons;

		this.apiService.ITEM_LIST(x.category_id).subscribe(result => {
			console.log("Result---------------", result);
			if (result.status) {
				let itemList = result.item_list;

				this.menu_items = [];
				let cart = JSON.parse(localStorage.getItem('cart'));
				console.log("cart------------", cart)
				if (!cart) { cart = []; }
				let cartIndex = cart.findIndex(obj => obj.cart_id == cartId);
				if (cartIndex != -1) {
					console.log("cartindex.........", cartIndex)
					//cart[cartIndex].addons = x.applied_addons;
				}

				for (let i = 0; i < itemList.length; i++) {
					itemList[i].ordered_qty = cart[cartIndex].quantity;
					this.menu_items.push(itemList[i]);
				}

				this.item_cost_flag = x.sold_price ? x.sold_price : x.selling_price;

				itemList.forEach(element => {
					// this.item_cost_flag = element.sold_price ? element.sold_price : element.selling_price;         
					if (element._id == x.item_id) {
						console.log("element.....", x)
						element.requests = x.requests;
						element.cart_id = cartId;
						element.sold_price = x.sold_price ? x.sold_price : x.selling_price;
						this.special_request = x.requests;
						element.addons.forEach(ele => {
							ele.options.forEach(elem => {

								x.applied_addons.forEach(applied_elem => {
									if (applied_elem._id == elem._id) {
										elem.selected = true;
									}
								});

							});

						});

						this.item = element;
					}
				});

				console.log("Item to be viewed....", this.item)

				this.triggerCustomization.nativeElement.click();
				this.scrollModalTop();

			} else {
				console.log('response', result);
			}
		})
	}

	countItemInCart(cart, itemId) {
		let count = 0;
		for (let i = 0; i < cart.length; i++) {
			if (itemId == cart[i].item_id)
				count += cart[i].quantity;
		}
		return count;
	}

	onRemoveItem(index) {
		if (this.cart[index].quantity > 1)
			this.cart[index].quantity = this.cart[index].quantity - 1;
		else
			this.cart.splice(index, 1);
		localStorage.setItem('cart', JSON.stringify(this.cart));
		if (!this.cart.length && this.pageType == 'bill')
			this.router.navigate(['/bill/view']);
		let cartDetails = this.userService.CART_DETAILS();
		this.tax =  cartDetails.tax;			
				this.cartItems = cartDetails.cart_items;
				this.cartTotal = cartDetails.cart_total;
				this.cartTax = cartDetails.tax;
				this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
	}

	// socialSignIn(modalName, socialPlatform: string,askmobilemodal) {
	//   let socialPlatformProvider;
	//   if(socialPlatform == "facebook") {
	//     socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
	//   }
	//   else if(socialPlatform == "google") {
	//     socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
	//   }

	//   this.socialAuthService.signIn(socialPlatformProvider).then((userData: any) => {

	//     this.social_data = userData;
	//     modalName.hide();
	//     askmobilemodal.show();

	//     // this.userService.SOCIAL_APP_LOGIN(userData).then((result: any) => {
	//     //   if(result.status) {
	//     //     this.userDetails = localStorage.getItem('user_details');
	//     //     modalName.hide();
	//     //     this.onConfirm();
	//     //   }
	//     //   else this.signupForm.error_msg = result.message;
	//     // });
	//   });
	// }

	// socialSignIn(modalName, socialPlatform: string, askmobilemodal, triggerModal) {
	// 	this.hideConfirmOrder = true;
	// 	this.userService.usableLink = true;
	// 	let socialPlatformProvider;
	// 	if (socialPlatform == "facebook") {
	// 		socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
	// 		// modalName.hide();  
	// 	}
	// 	else if (socialPlatform == "google") {
	// 		socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
	// 		//   
	// 	}

	// 	this.socialAuthService.signIn(socialPlatformProvider).then((userData: any) => {
	// 		// this.hideConfirmOrder = true;
	// 		console.log("social data...", userData);

	// 		let sendData = {
	// 			email: userData.email
	// 		}
	// 		this.apiService.CHECK_MOBILE_SOCIAL_LOGIN(sendData).subscribe(result => {
	// 			modalName.hide();
	// 			if (result.status) {
					
	// 				console.log("1...............")
	// 				this.social_data = userData;
	// 				this.social_data['mobile'] = result.mobile;
	// 				this.userService.SOCIAL_APP_LOGIN(userData).then((result: any) => {
	// 					if (result.status) {
	// 						this.userDetails = localStorage.getItem('user_details');
	// 						console.log("2...............")
	// 						this.apiService.GET_BILL().subscribe(result => {
	// 							console.log('oms bills.....', result);
	// 							if (result.status) {
	// 								let bills = result.bills.bills;
	// 								console.log("3...............")
	// 								console.log("billl ..................")
	// 								let check_currentuser_ordered = bills.filter(ss => ss.orderer_name != userData.name);
	// 								console.log('bills....', check_currentuser_ordered);

	// 								if (check_currentuser_ordered.length) {
	// 									console.log("4...............")
	// 									this.userService.showOrderNow = true;
	// 									// this.snackBar.BILLSETTLEMENTINPROGRESS('Bill settlement in progress.', 'OKAY');
	// 									console.log("inside login............", this.take_aways);
	// 									if (this.take_aways) {										
	// 										this.hideConfirmOrder = false;							
	// 										document.getElementById("paymentModal").click();
	// 									}
	// 									else {
	// 										this.router.navigate(['bill/confirm']);
	// 									}
	// 								  } 
	// 								else {
	// 									console.log("5...............")
	// 									this.userService.showOrderNow = false;
	// 									askmobilemodal.hide();
	// 									// this.onConfirm(); 
	// 									this.onConfirmInsta(modalName, triggerModal);
	// 								}
	// 							} else {
	// 								console.log("6...............")
	// 								this.userService.showOrderNow = false;
	// 								askmobilemodal.hide();
	// 								// this.onConfirm(); 
	// 								if (this.take_aways) {
	// 									this.hideConfirmOrder = false;
	// 									document.getElementById("paymentModal").click();
	// 								}
	// 								else {
	// 									this.onConfirm()
	// 								}
	// 								// this.onConfirmInsta(modalName, triggerModal);
	// 							}
	// 						})
	// 						console.log("7...............")

	// 					}
	// 					else this.signupForm.error_msg = result.message;
	// 				});
				
	// 			} else {
	// 				console.log("8...............");
	// 				this.hideConfirmOrder = false;
	// 				this.social_data = userData;
	// 				modalName.hide();
	// 				askmobilemodal.show();
	// 			}
	// 		})

	// 	}, err => {
	// 		this.loaderStatus = false;
	// 		this.hideConfirmOrder = false;
	// 		console.log("Google err1............", err);
	// 		this.userService.usableLink= true;
			
	// 	});

	// }


	closeLogin() {
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

	goBack(m1,m2)
	{
		if(this.enterEmailField)
		{
		m1.hide();
		this.closeLogin()
		m2.show()
		}
		else if(this.enterNameField && this.enterPasswordField && this.confirmPasswordField)
		{
		this.enterEmailField = true;
		this.enterOtpField = false;
		this.enterNameField = true;
		this.enterPasswordField = false;
		this.confirmPasswordField = false;
		this.pleasewait = false;
		this.loginForm.confirm_password = "";
		this.loginForm.password=""
		this.mob_num_exist = false
		}
		
		
					
				
	}

	userRegister(closeModal, openModal) {
		this.signupForm.submit = true;
		this.apiService.DINAMIC_SIGNUP(this.signupForm).subscribe(result => {
			if (result.status) {
				this.customer_id = result.customer_id;
				closeModal.hide();
				openModal.show();
			}
			else {
				console.log('response', result);
				this.signupForm.submit = false;
				this.signupForm.error_msg = result.message;
			}
		});

	}

	userOtpValidate(modalName, confirmModal) {
		this.loaderStatus = true;
		this.userService.SIGNUP_OTP_VALIDATE({ customer_id: this.customer_id, otp: this.otpForm.otp }).then((result: any) => {
			if (result.status) {
				this.userDetails = localStorage.getItem('user_details');
				modalName.hide();
				//confirmModal.show();
				 this.onConfirm();
			}
			else{
				this.otpForm.error_msg = result.message;
				this.loaderStatus = false;
			   }
		});
	}

	userLogin(modalName) {
		this.userService.LOGIN(this.loginForm).then((result: any) => {
			console.log('user login....', result);
			if (result.status) {
				this.userDetails = JSON.parse(localStorage.getItem('user_details'));
				modalName.hide();
				this.onConfirm();
			}
			else this.loginForm.error_msg = result.message;
		});
	}

	addNewItemCustomization() {
		let category = this.item.category_id;
		let selectedItem = this.item;

		let flag = {
			_id: category
		}
		console.log("this item...", this.item)

		// CART
		let addonDetails = { addons: this.addonList, special_request: this.special_request };
		selectedItem.sold_price = this.item.sold_price;

		let itemObject = this.itemExistInCartByItemId(selectedItem._id, this.addonList);
		console.log("itemObject confirm----------", itemObject);

		if (itemObject) {

			if (this.special_request === "") {
				console.log("onconfirm cartid--------------", itemObject.item.cart_id)
				this.menuStorageService.REPEAT_ITEM_IN_CART(itemObject.item.cart_id);

				let cartDetails = this.userService.CART_DETAILS();
				this.tax =  cartDetails.tax;			
				this.cartItems = cartDetails.cart_items;
				this.cartTotal = cartDetails.cart_total;
				this.cartTax = cartDetails.tax;
				this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
				console.log("repeat cart-----", this.cartItems)
				//  this.menu_items.forEach(element => {
				//    if (element.cart_id == selectedItem.cart_id) {
				//      element.ordered_qty++;
				//    }
				//  });
				this.cart = JSON.parse(localStorage.getItem('cart'));
				this.closeCustomization.nativeElement.click();
			}
			else {
				this.addNewItemInCart(flag, selectedItem, addonDetails)
			}


		}
		else {
			this.addNewItemInCart(flag, selectedItem, addonDetails)
		}

	}



	addNewItemInCart(flag, selectedItem, addonDetails) {

		this.menuStorageService.ADD_NEW_ITEM_TO_CART(flag, selectedItem, addonDetails).then(res => {
			console.log("flag-----------", flag);
			console.log("selectedItem-----------", selectedItem);
			console.log("addonDetails-----------", addonDetails);
			console.log("customization Add to order...................", res);

			if (res) {
				let selectedItem = JSON.parse(localStorage.getItem('selected_item'));
				console.log("Add to order..........", selectedItem)
				let cartDetails = this.userService.CART_DETAILS();
				console.log("cartDetails 691............... ", cartDetails)
				this.cartItems = cartDetails.cart_items;
				this.cartTotal = cartDetails.cart_total;
				this.tax = Math.round(cartDetails.cart_total * (this.userService.restaurant_gst / 100));
				this.cartIncTax = this.cartTotal + cartDetails.tax;			
				this.cartTax = cartDetails.tax;				
				
				// this.router.navigate(['/menu/items']);
				this.closeCustomization.nativeElement.click();

				this.cart = JSON.parse(localStorage.getItem('cart'));
				console.log("cart....", this.cart)

				this.menu_items.forEach(element => {
					if (element._id == selectedItem._id) {
						element.ordered_qty++;
					}
				});
			} else {
				console.log("asdfg");
			}

		})
	}




	addItemToCart(item, cartId) {
		// console.log("dummy....",item);
		this.special_request = "";
		console.log("cartid..........", cartId)
		console.log("Add to Item..........", item)
		this.apiService.ITEM_LIST(item.category_id).subscribe(result => {
			console.log("Add to Item result ..........", result)
			if (result.status) {
				let itemList = result.item_list;

				itemList.forEach(element => {

					// console.log("gggwbreg.....", element)
					if (element._id == item.item_id) {
						let x = element;
						element.requests = item.requests;
						element.cart_id = cartId;
						this.special_request = item.requests;
						element.addons.forEach(ele => {
							ele.options.forEach(elem => {
								item.applied_addons.forEach(applied_elem => {
									if (applied_elem._id == elem._id) {
										elem.selected = true;
									}
								});

							});

						});

						console.log("cart ID--------------------------------", element.cart_id)
						this.item = element;
						console.log("item...................................", this.item)

						if (this.item['addons'].length || this.item.requests != '') {
							localStorage.setItem('selected_item', JSON.stringify(this.item));

							if (this.cartItems > 0) {
								console.log("condition 1");
								console.log("element._id++++++++++++++++++", element._id)
								let itemObject = this.itemExistInCart(cartId);
								console.log("itemObject.............", itemObject);
								if (itemObject) {
									this.cartItemDetails = itemObject.item;
									this.itemRepeatFooter = true;
									document.querySelector("body").classList.add("customize-fade");
									document.querySelector("#cartarea").classList.add("pointer-none")
									document.querySelector("#nav-fade").classList.add("nav-fade");
									document.querySelector("#cart-summary").classList.add("section-fade");

								}

								this.item = element;
								console.log(this.item);
								this.item_cost_flag = this.item.selling_price;
								this.item.sold_price = this.item.selling_price;
								this.addonList = [];
								let addons = this.item.addons;
								this.show_cust_popup = true;
								for (let i = 0; i < addons.length; i++) {
									if (addons[i].type == 'exclusive')
										this.onSelectOption(addons[i], addons[i].options[0], i);
								}
								this.show_cust_popup = true;




							}
							else {
								console.log("condition 2");
								this.item = element;
								this.item_cost_flag = this.item.selling_price;
								this.item.sold_price = this.item.selling_price;
								this.addonList = [];
								let addons = this.item.addons;
								this.show_cust_popup = true;
								for (let i = 0; i < addons.length; i++) {
									if (addons[i].type == 'exclusive')
										this.onSelectOption(addons[i], addons[i].options[0], i);
								}

							}
						}
						else {
							this.item_cost_flag = element.selling_price;
							x.sold_price = element.selling_price;
							localStorage.setItem('selected_item', JSON.stringify(element));
							if (this.cartItems > 0) {

								console.log("condition 3");

								let itemObject = this.itemExistInCart(cartId);
								console.log("item object --------------------", itemObject);
								if (itemObject) {
									this.cartItemDetails = itemObject.item;
									this.itemRepeatFooter = false;
									this.showAddToOrder = false;
									this.onRepeatLastItem(cartId);
								}


								this.item = element;
								this.item.sold_price = this.item.selling_price;
								this.addonList = [];
								let addons = this.item.addons;
								this.show_cust_popup = true;
								for (let i = 0; i < addons.length; i++) {
									if (addons[i].type == 'exclusive')
										this.onSelectOption(addons[i], addons[i].options[0], i);
								}

								this.show_cust_popup = true;


							} else {
								console.log("condition 4");
								this.item = element;
								this.item.sold_price = this.item.selling_price;
								this.addonList = [];
								let addons = this.item.addons;
								this.show_cust_popup = true;
								for (let i = 0; i < addons.length; i++) {
									if (addons[i].type == 'exclusive')
										this.onSelectOption(addons[i], addons[i].options[0], i);
								}

								this.show_cust_popup = true;

							}

						}

					}
				});


			}

		});
	}

	removeItemFromCart(item, cartId) {
		let cart_det = JSON.parse(localStorage.getItem('cart'));

		let chosen_cart_item = cart_det.filter(dd => dd.cart_id == cartId);
		if (chosen_cart_item.length) {
			console.log("chosen item...", chosen_cart_item);
			if (chosen_cart_item[0].quantity > 1) {
				chosen_cart_item[0].quantity--;
				cart_det.filter(aa => aa.cart_id == cartId).map(bb => {
					bb = chosen_cart_item;
				})
			}
			else if (chosen_cart_item[0].quantity == 1) {
				// const index = orders.findIndex(order => order.food_id === food.id);
				// orders.splice(index, 1);
				let index = cart_det.findIndex(ff => ff.cart_id == cartId);
				cart_det.splice(index, 1);
			}

			localStorage.setItem('cart', JSON.stringify(cart_det));
			this.cart = JSON.parse(localStorage.getItem('cart'));

			let cartDetails = this.userService.CART_DETAILS();

			this.tax =  cartDetails.tax;			
			this.cartItems = cartDetails.cart_items;
			this.cartTotal = cartDetails.cart_total;
			this.cartTax = cartDetails.tax;
			this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
			console.log("service charge remove..............", this.restaurantDetails.service_charge)
		if (this.restaurantDetails.service_charge != '0') {
			
			let service_charge = Number(this.restaurantDetails.service_charge) / 100
			console.log("service charge1..............", cartDetails.cart_total)
			this.userService.service_charge = (service_charge * cartDetails.cart_total);
			console.log("service Charge...........................", this.userService.service_charge)
		}
		else {
			this.userService.service_charge = 0;
		}
			
		}
	}

	onRepeatLastItem(obj) {

		let selectedItem = JSON.parse(localStorage.getItem('selected_item'));
		console.log("selectedItem-----------------------------", selectedItem)
		this.menuStorageService.REPEAT_ITEM_IN_CART(obj);
		//this.itemRepeatFooter = true;

		// document.querySelector("body").classList.remove("customize-fade");
		// document.querySelector("#nav-fade").classList.remove("nav-fade");
		// document.querySelector("#cartarea").classList.remove("pointer-none");
		// document.querySelector("#cart-summary").classList.remove("section-fade");
		// console.log(document.querySelector("#slide-bot"))
		// if(document.querySelector("#slide-bot")){
		//   document.querySelector("#slide-bot").classList.remove("slide-in-bottom");    
		//   document.querySelector("#slide-bot").classList.add("slide-out-bottom");
		//   setTimeout(()=>{ this.itemRepeatFooter=false; }, 250);
		// }


		console.log("menu item...........", this.menu_items);
		console.log("selected item..........", selectedItem);

		let cartDetails = this.userService.CART_DETAILS();


		/** tax calc */

		this.tax =  cartDetails.tax;			
		this.cartItems = cartDetails.cart_items;
		this.cartTotal = cartDetails.cart_total;
		this.cartTax = cartDetails.tax;
		this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
		//this.tax = Math.round(cartDetails.cart_total * (this.userService.restaurant_gst/100));
	
		console.log("service charge remove..............", this.restaurantDetails.service_charge)
		if (this.restaurantDetails.service_charge != '0') {
			
			let service_charge = Number(this.restaurantDetails.service_charge) / 100
			console.log("service charge1..............", cartDetails.cart_total)
			this.userService.service_charge = (service_charge * cartDetails.cart_total);
			console.log("service Charge...........................", this.userService.service_charge)
		}
		else {
			this.userService.service_charge = 0;
		}
		
		this.cart = JSON.parse(localStorage.getItem('cart'));
		console.log()
		this.menu_items.forEach(element => {
			if (element.cart_id == selectedItem.cart_id) {
				element.ordered_qty++;
			}
		});
		// this.ngOnInit();
		if (document.body.classList.contains('customize-fade')) {
			this.closeitemreapter();
		}
	}

	iwillchoose() {
		this.special_request = "";
		this.item = JSON.parse(localStorage.getItem('selected_item'));
		this.item.sold_price = this.item.selling_price;
		this.illchoose = true;
		console.log()
		console.log('addons.....', this.item.addons);
		if (this.item.addons.length == 0) {
			this.showAddToOrder = true;
		}

		this.item.addons.forEach(element => {
			if (element.type != 'mandatory') {
				if (element.limit > 1) {
					element.options.forEach((element, optionInd) => {
						delete element.selected;
					});
				} else {
					element.options.forEach((element, optionInd) => {
						if (optionInd == 0) {
							element.selected = true;
						} else {
							delete element.selected;
						}
					});
				}
			} else {
				element.options.forEach((element, optionInd) => {
					delete element.selected;
				});
			}

		});

		this.addonList = [];
		let addons = this.item.addons;
		if (addons.length || this.special_request == '') {
			this.show_cust_popup = true;
			this.triggerCustomization.nativeElement.click();
			this.scrollModalTop();
		} else {
			this.show_cust_popup = false;
			// this.triggerCustomization.nativeElement.click();
			this.addNewItemCustomization();
		}

		for (let i = 0; i < addons.length; i++) {
			if (addons[i].type == 'exclusive')
				this.onSelectOption(addons[i], addons[i].options[0], i);

			// if(addons[i].type == 'mandatory'){
			//   if(addons[i].limit == 1){
			//     this.onSelectOption(addons[i], addons[i].options[0], i);
			//   }        
			// }
		}

		let limited_addons = addons.filter(gg => gg.type == 'limited');
		if (limited_addons.length) {
			if (addons.length == limited_addons.length) {
				this.showAddToOrder = true;
			}
		}

		let multiple_addons = addons.filter(gg => gg.type == 'multiple');
		if (multiple_addons.length) {
			if (addons.length == multiple_addons.length) {
				this.showAddToOrder = true;
			}
		}

		let limited_addons_e = addons.filter(gg => (gg.type == 'limited' || gg.type == 'exclusive'));
		if (limited_addons_e.length) {
			if (addons.length == limited_addons_e.length) {
				this.showAddToOrder = true;
			}
		}

		let multiple_addons_e = addons.filter(gg => (gg.type == 'multiple' || gg.type == 'exclusive'));
		if (multiple_addons_e.length) {
			if (addons.length == multiple_addons_e.length) {
				this.showAddToOrder = true;
			}
		}


		let lim_multiple_addon = addons.filter(gg => (gg.type == 'limited' || gg.type == 'multiple'));
		console.log('lim_multiple_addon..', lim_multiple_addon);
		if (lim_multiple_addon.length) {
			if (addons.length == lim_multiple_addon.length) {
				this.showAddToOrder = true;
			}
		}

		this.itemRepeatFooter = true;
		document.querySelector("body").classList.remove("customize-fade");
		document.querySelector("#cartarea").classList.remove("pointer-none");
		document.querySelector("#nav-fade").classList.remove("nav-fade");
		document.querySelector("#cart-summary").classList.remove("section-fade");
		document.querySelector("#slide-bot").classList.remove("slide-in-bottom");
		document.querySelector("#slide-bot").classList.add("slide-out-bottom");
		setTimeout(() => { this.itemRepeatFooter = false; }, 250);
	}





	itemExistInCart(cartId) {
		let cart = JSON.parse(localStorage.getItem('cart'));
		console.log("cart----------------", cart)
		let revCart = cart.reverse();
		for (let i = 0; i < revCart.length; i++) {
			if (cartId == revCart[i].cart_id) {
				return { item: revCart[i] };
			}
		}
	}





	removeobjprop(addon) {
		let newAddonarr = addon;
		newAddonarr = newAddonarr.filter(function (addon) {
			delete addon.selected;
			return true;
		});
		console.log("newarray----------------", newAddonarr);
		return newAddonarr;
	}

	sortArrayObj(val) {
		const newArray = _.sortBy(val, o => o.name);
		return newArray
	}

	itemExistInCartByItemId(itemId, addon) {
		let cart = JSON.parse(localStorage.getItem('cart'));
		console.log("cart----------------", cart);
		let newAddon = this.removeobjprop(addon)
		let a = this.sortArrayObj(newAddon);
		console.log("a----------------", a);

		let revCart = cart.reverse();
		for (let i = 0; i < revCart.length; i++) {

			if (itemId == revCart[i].item_id) {

				let b = this.sortArrayObj(revCart[i].applied_addons);
				console.log("b----------------", b, " ", _.isEqual(a, b));
				if (_.isEqual(a, b)) {
					return { item: revCart[i] };
				}

			}
		}
	}






	onConfirm() {
		console.log("Confirm")
		// this.hideConfirmOrder = true;
		this.userDetails = JSON.parse(localStorage.getItem('user_details'));
		let serviceTax = 0;		
		let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));

		let scharge = restaurant_details.service_tax;
		let  service_per;
		if (this.serviceStatus) {					
			let service_charge = Number(restaurant_details.service_charge) / 100;
			service_per = restaurant_details.service_charge;
			console.log("service charge1..............", this.cartTotal)
			serviceTax = (service_charge * this.cartTotal);

		}
		else {
			serviceTax = 0;
		    service_per = 0
		}

		let orderData = {
			"order_details": {
				"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
				"item_details": JSON.parse(localStorage.getItem('cart')),
				"is_applied_service_charge":this.serviceStatus,
				"service_charge_percentage":service_per
			},
			"cart_total": this.cartTotal + serviceTax,
			"email": this.userDetails.email,
			"name": this.userDetails.name,
			"mobile": this.userDetails.mobile,
			"phone": this.userDetails.mobile,
			"buyer_name": this.userDetails.name,
			"serviceStatus":this.serviceStatus
		};

		console.log("confirm order in onconfirm", orderData)
		if (orderData.order_details.order_type == 'in_house') {

			this.apiService.CONFIRM_ORDER(orderData).subscribe(result => {
				// this.hideConfirmOrder = false;
				if (result.status) {
					this.snackBar.OPEN('Your order has been placed.', 'Close');
					localStorage.setItem('order_status', 'raised');
					// localStorage.setItem('payment_status', 'paid');
					localStorage.setItem('payment_status', 'raised');
					localStorage.removeItem('cart');
					this.router.navigate(['/order-status']);
				}
				else {
					this.hideConfirmOrder = false;
					console.log('response', result);
				}
			});

		} else {
			// console.log(orderData)
			this.apiService.CONFIRM_PAYMENT(orderData).subscribe(result => {
				console.log(result, "------------ orderdatra.......", orderData)
				if (result.status) {

					//Generate order id here for every order , get and set the token for POS...
					//set the token - localstorage(user_details).token
					this.apiService.GET_ORDER_ACCESS_TOKEN().subscribe(result => {
						if (result.status) {
							console.log("New Token.....", result.token);
							let new_obj = JSON.parse(localStorage.getItem('user_details'));
							new_obj.token = result.token;
							localStorage.setItem('user_details', JSON.stringify(new_obj));
						}
					})

					localStorage.setItem('current_user_order_id', '<To be Generated>');

					localStorage.setItem('payment_status', 'raised');
					// this.router.navigate([result.data.payment_url]);
					// window.open(result.data.payment_url, "_self");
					this.payment_url = result.data.payment_url
					console.log("url....", this.payment_url)
					if (this.take_aways) {
						document.getElementById("paymentModal").click();
					}


				} else {
					console.log('response', result);
				}

			})

		}

	}

	onConfirmInsta(confirmModal, triggerModal) {	
		this.loaderStatus = true;
		this.userDetails = JSON.parse(localStorage.getItem('user_details'));
		let serviceTax = 0;		
		let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
        let service_per;
		if (this.serviceStatus) {					
			let service_charge = Number(restaurant_details.service_charge) / 100
			console.log("service charge1..............", this.cartTotal)
			serviceTax = (service_charge * this.cartTotal);
			service_per = restaurant_details.service_charge;
		}
		else {
			serviceTax = 0;
			service_per = 0;
		}

		console.log("cart Total..........", this.cartTotal,"serviceTax.......",serviceTax);
		let orderData = {
			"order_details": {
				"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
				"item_details": JSON.parse(localStorage.getItem('cart')),				
				"is_applied_service_charge":this.serviceStatus,
				"service_charge_percentage":service_per
			},
			"cart_total": this.cartTotal + serviceTax,
			"email": this.userDetails.email,
			"name": this.userDetails.name,
			"mobile": this.userDetails.mobile,
			"phone": this.userDetails.mobile,
			"buyer_name": this.userDetails.name,
			"serviceStatus":this.serviceStatus
		};
		console.log("order Data...................", orderData)

		this.showYesBtn = false;

		if (orderData.order_details.order_type == 'in_house') {
			this.take_aways = false;
			this.apiService.GET_BILL().subscribe(result => {
				console.log('oms bills.....', result);
				if (result.status) {
					this.loaderStatus = false;
					this.hideConfirmOrder = false;
					let bills = result.bills.bills;
					let check_currentuser_ordered = bills.filter(ss => ss.orderer_name != this.userDetails.name);
					console.log('bills....', check_currentuser_ordered);
					if (check_currentuser_ordered.length) {
						this.userService.showOrderNow = true;
						confirmModal.hide();
						// this.snackBar.BILLSETTLEMENTINPROGRESS('Bill settlement in progress.', 'OKAY');
						this.router.navigate(['bill/confirm']);
					} else {
						this.userService.showOrderNow = false;
						
						this.apiService.CONFIRM_ORDER(orderData).subscribe(result => {
							if (result.status) {
								this.loaderStatus = false;
								this.snackBar.OPEN('Your order has been placed.', 'Close');
								localStorage.setItem('order_status', 'raised');
								// localStorage.setItem('payment_status', 'paid');
								localStorage.setItem('payment_status', 'raised');
								localStorage.removeItem('cart');
								this.router.navigate(['/order-status']);
							}
							else {
								console.log('response', result);
							}
						});

					}
				} else {
					this.hideConfirmOrder = false;
					this.userService.showOrderNow = false;
					this.apiService.CONFIRM_ORDER(orderData).subscribe(result => {
						if (result.status) {
							this.snackBar.OPEN('Your order has been placed.', 'Close');
							localStorage.setItem('order_status', 'raised');
							// localStorage.setItem('payment_status', 'paid');
							localStorage.setItem('payment_status', 'raised');
							localStorage.removeItem('cart');
							this.router.navigate(['/order-status']);
						}
						else {
							console.log('response', result);
						}
					});
				}
			})

		} 
		else {		
			this.take_aways = true;
			this.apiService.CONFIRM_PAYMENT(orderData).subscribe(result => {
				this.hideConfirmOrder = false;
				if (result.status) {
					//Generate order id here for every order , get and set the token for POS...
					//set the token - localstorage(user_details).token
					this.apiService.GET_ORDER_ACCESS_TOKEN().subscribe(result => {
						if (result.status) {
							console.log("New Token.....", result.token);
							let new_obj = JSON.parse(localStorage.getItem('user_details'));
							new_obj.token = result.token;
							localStorage.setItem('user_details', JSON.stringify(new_obj));
						}
					})

					localStorage.setItem('current_user_order_id', '<To be Generated>');

					localStorage.setItem('payment_status', 'raised');
					// this.router.navigate([result.data.payment_url]);
					// window.open(result.data.payment_url, "_self");
					// this.REQUEST_URL = result.data.payment_url;
					Instamojo.configure({
						handlers: {
							onClose: () => {
								console.log('modal closed');
								confirmModal.hide();
								this.hideConfirmOrder = false;
								//  triggerModal.show();
								//  localStorage.removeItem('payment_status');                   
							},
							onFailure: function () {
								console.log("payment failed");
							}
						}
					});
					Instamojo.open(result.data.payment_url);

				} else {
					console.log('response', result);
				}

			})
		}
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

	hideLabel() {
		this.showlabel = false;
	}

	showLabel() {
		// console.log("hgjherjhgbjebgjhreb");    
		this.showlabel = true;
		this.enterEmailField = true;
		this.enterNameField = true;
		this.enterSurNameField = false;
		this.enterPasswordField = false;
		this.confirmPasswordField = false;
		this.loginForm = {};
	}


	// startTimer() {
	// 	this.interval = setInterval(() => {
	// 		if (this.timeLeft > 0) {
	// 			this.timeLeft--;
	// 			if (this.timeLeft < 10) {
	// 				this.timeLeftString = '00 : 0' + this.timeLeft;
	// 			} else {
	// 				this.timeLeftString = '00 : ' + this.timeLeft;
	// 			}

	// 		} else {
	// 			this.timeLeftString = '00 : 00';
	// 			if (this.timeLeft == 0) {
	// 				this.apiService.OTP_EXPIRATION({ customer_id: this.customer_id }).subscribe(result => {
	// 					// console.log("OTP Expiration....", result);
	// 					clearInterval(this.interval);
	// 				})
	// 			}

	// 		}
	// 	}, 1000)
	// }

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
		this.userDetails = JSON.parse(localStorage.getItem('user_details'));
		console.log("resend_otp.........",this.mobile_num);	
		this.apiService.RESEND_OTP({ email: this.userDetails.email, mobile: this.mobile_num }).subscribe(result => {
			console.log("Resend OTP...", result);
			this.timeLeft = 30;
			this.timeLeftString = '00 : 30';

			this.startTimer();
		})
	}

	send_otp(modal1, modal2) {
		this.userService.disableBtn = true;
		this.otpForm.otp  = "";
		this.mobileShow = false;
		console.log("send_otp Form............",this.mobile_num)	
		//modal2.show();
		//modal1.hide();
		this.timeLeft = 30;
		this.timeLeftString = '00 : 30';
		this.startTimer();

		this.userDetails = JSON.parse(localStorage.getItem('user_details'));		
		this.apiService.SEND_OTP({ email: this.userDetails.email, mobile: this.mobile_num }).subscribe(result => {
			console.log("send OTP...", result);
			this.userService.disableBtn = false;
			if (result.status)
				modal2.show();
			modal1.hide();
			this.timeLeft = 30;
			this.timeLeftString = '00 : 30';
			this.startTimer();
		})
	}

	mob_otp_validate(modal) {
		this.userDetails = JSON.parse(localStorage.getItem('user_details'));
		let restaurant_details= JSON.parse(localStorage.getItem('restaurant_details'));
		this.cart = JSON.parse(localStorage.getItem('cart'));
		if (!this.cart) { this.cart = []; }
		let cartDetails = this.userService.CART_DETAILS();
		console.log("cart Details......................", cartDetails);
		// this.tax = Math.round(cartDetails.cart_total * (this.userService.restaurant_gst/100));
		this.tax =  cartDetails.tax;			
		this.cartItems = cartDetails.cart_items;
		this.cartTotal = cartDetails.cart_total;
		this.cartTax = cartDetails.tax;
		this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
		this.showlabel = true;
		this.apiService.MOB_OTP_VALIDATE({ email: this.userDetails.email, otp: this.otpForm.otp }).subscribe((result: any) => {
			console.log(result)
			if (result.status) {
				this.userDetails = localStorage.getItem('user_details');
				let order_id;
				if (localStorage.getItem('order_again')) {
					//console.log("new pos id")
					let orderId = this.orderIdGenerator();
					console.log("order id...", orderId);
					this.socket.emit('take_away', orderId);
					console.log("order again......................")
					localStorage.setItem("pos_order_id", orderId);
		            order_id = orderId;
		
				}	
				else
				{
					order_id = localStorage.getItem('pos_order_id');
					this.socket.emit('take_away', localStorage.getItem('pos_order_id'));
				}

				let orderData = {
					"user_id": JSON.parse(localStorage.getItem('user_details')).user_id,
					"order_details": {
						"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
						"item_details": JSON.parse(localStorage.getItem('cart')),
						"cart_total": Math.round(this.cartIncTax + (this.cartTotal * (restaurant_details.service_tax / 100))),
						"order_id": order_id
					},
					
					"user_name": JSON.parse(localStorage.getItem('user_details')).dinamic_user_name

				};
				console.log("order data take away ..........", orderData)
				console.log("order_id...................",order_id)
				localStorage.setItem('order_again', 'new');
				this.apiService.CONFIRM_ORDER(orderData).subscribe(result => {
					console.log("payment result...................", result)
				if (result.status) {
					this.snackBar.OPEN('Your order has been placed.', 'Close');
					localStorage.setItem('order_status', 'raised');
					if (orderData.order_details.order_type == 'in_house') {
						this.router.navigate(['/bill/confirm']);
					} else {
						localStorage.setItem('payment_status', 'paid');
						localStorage.removeItem('cart');
						let payment_det = {
							user_id: JSON.parse(localStorage.getItem('user_details')).dinamic_user_id,
							order_id: order_id,
							order_number:order_id,							
							payment_status: 'success',
							"payment_details": {status:'captured', mode : 'cash'} ,
							user_name: JSON.parse(localStorage.getItem('user_details')).dinamic_user_name
						}
						this.apiService.SAVE_PAYMENT(payment_det).subscribe(result => {						
							if(result)
							{
								this.apiService.GET_ALL_MY_ORDERS().subscribe(result => {
									console.log("All my orders1.....", result);
										if (result.orders) {										
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
	
								
									this.router.navigate(['/myorder']);
							}
						});
						
					}

					
				}
				else {
					console.log('response', result);
				}
			});


				modal.hide();
				this.router.navigate(['/myorder']);
			}
			else 
			{
			this.otpForm.otp = "";
			this.otpForm.error_msg = result.message;}
		});
	}
	orderIdGenerator() {
		// var S4 = function () {
		// 	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		// };
		// return (S4() + S4() + S4() + S4());

		let now = new Date();
		let timestamp = now.getFullYear().toString(); // 2011
		timestamp += (now.getMonth() < 9 ? '0' : '') + now.getMonth().toString(); // JS months are 0-based, so +1 and pad with 0's
		timestamp += (now.getDate() < 10 ? '0' : '') + now.getDate().toString(); // pad with a 0
		timestamp += (now.getHours() < 10 ? '0' : '') + now.getHours().toString(); // pad with a 0
		timestamp += (now.getMinutes() < 10 ? '0' : '') + now.getMinutes().toString(); // pad with a 0
		timestamp += (now.getSeconds() < 10 ? '0' : '') + now.getSeconds().toString(); // pad with a 0
		timestamp += (now.getMilliseconds() < 10 ? '0' : '') + now.getMilliseconds().toString(); // pad with a 0
		// ... etc... with .getHours(), getMinutes(), getSeconds(), getMilliseconds()
		console.log('time stamp ---------', `HD${timestamp}`);
		return `TA${timestamp}`;
	}

	updateItemCustomization() {

		let category = this.item.category_id;
		let selectedItem = this.item;

		console.log('this item.....', this.special_request);

		// CART
		let addonDetails = { addons: this.addonList, special_request: this.special_request };
		selectedItem.sold_price = this.item.sold_price ? this.item.sold_price : this.item.selling_price;
		console.log("inside onconfirm----------", addonDetails);


		this.menuStorageService.UPDATE_ITEM_IN_CART(category, selectedItem, addonDetails).then(res => {
			console.log("res...............", res);
			// this.closeCustomization.nativeElement.click();
			if (res) {
				// let selectedItem = JSON.parse(localStorage.getItem('selected_item'));     

				let cartDetails = this.userService.CART_DETAILS();
				this.cartItems = cartDetails.cart_items;

				// console.log("selected item check....", this.cartItems)
				this.cart = JSON.parse(localStorage.getItem('cart'));


				
				this.tax =  cartDetails.tax;			
				this.cartItems = cartDetails.cart_items;
				this.cartTotal = cartDetails.cart_total;
				this.cartTax = cartDetails.tax;
				this.cartIncTax = cartDetails.cart_total + cartDetails.tax;
				// this.router.navigate(['/menu/items']);
				this.closeCustomization.nativeElement.click();

				this.menu_items.forEach(element => {
					if (element._id == selectedItem._id) {
						element.ordered_qty++;
					}
				});
			} else {
				console.log("asdfg");
			}

		})
	}

	cancelCust(modalName) {
		this.special_request = "";
		this.showAddToOrder = false;
		this.closeCustomization.nativeElement.click();
		this.ngOnInit();
	}

	arr_diff(a1, a2) {

		var a = [], diff = [];

		for (var i = 0; i < a1.length; i++) {
			a[a1[i]] = true;
		}

		for (var i = 0; i < a2.length; i++) {
			if (a[a2[i]]) {
				delete a[a2[i]];
			} else {
				a[a2[i]] = true;
			}
		}

		for (var k in a) {
			diff.push(+k);
		}

		return diff;
	}

	onSelectOption(optionHeading, selectedOption, addonIndex) {
		console.log('optionHeading.....', optionHeading)
		let limit_array = [];
		if (optionHeading.limit > 1) {
			for (let h = 0; h < optionHeading.options.length; h++) {
				limit_array.push(h);
			}
		}

		let existStatus = false;
		if (optionHeading.type == 'exclusive') {
			for (let i = 0; i < this.addonList.length; i++) {
				if (optionHeading._id == this.addonList[i].heading_id) {
					this.addonList.splice(i, 1);
				}
			}
		}
		else if (optionHeading.type == 'multiple') {
			for (let i = 0; i < this.addonList.length; i++) {
				if (selectedOption._id == this.addonList[i]._id) {
					this.addonList.splice(i, 1);
					existStatus = true;
				}
			}
		} else if (optionHeading.type == 'mandatory') {

			for (let i = 0; i < this.addonList.length; i++) {
				if (selectedOption._id == this.addonList[i]._id) {
					this.addonList.splice(i, 1);
					existStatus = true;
				}
			}

		} else if (optionHeading.type == 'limited') {
			if (optionHeading.limit == 1) {
				for (let i = 0; i < this.addonList.length; i++) {
					if (optionHeading._id == this.addonList[i].heading_id) {
						this.addonList.splice(i, 1);
					}
				}
			} else {
				for (let i = 0; i < this.addonList.length; i++) {
					if (selectedOption._id == this.addonList[i]._id) {
						this.addonList.splice(i, 1);
						existStatus = true;
					}
				}

			}
		}

		if (!existStatus) {
			selectedOption.heading_id = optionHeading._id;
			selectedOption.heading = optionHeading.heading;
			this.addonList.push(selectedOption);
		}


		if (optionHeading.type == 'limited') {
			if (optionHeading.limit > 1) {
				let options_index = [];
				for (let i = 0; i < this.addonList.length; i++) {
					for (let g = 0; g < optionHeading.options.length; g++) {
						if (this.addonList[i]._id == optionHeading.options[g]._id) {
							options_index.push(g);
						}
					}
				}
				let arr_diff = this.arr_diff(options_index, limit_array);

				if (options_index.length == optionHeading.limit) {
					for (let f = 0; f < arr_diff.length; f++) {
						let id = 'limit_' + addonIndex + '_' + arr_diff[f];
						let el = document.getElementById(id);
						el.setAttribute('style', 'opacity:.5;pointer-events:none');
					}
				}
				else {
					// enable options           
					for (let f = 0; f < optionHeading.options.length; f++) {
						let id = 'limit_' + addonIndex + '_' + f;
						let el = document.getElementById(id);
						el.removeAttribute('style');
					}
				}

			}
		}

		console.log('chosen addons...', this.addonList);
		if (this.item.addons.length) {
			let mand_and_lim_addons = this.item.addons.filter(xx => xx.type == 'mandatory'); // only mandatory addons  
			console.log('mand_and_lim_addons....', mand_and_lim_addons)
			let addon_flag = [];
			if (mand_and_lim_addons.length) {

				if (this.addonList.length) {
					for (let p = 0; p < mand_and_lim_addons.length; p++) {
						let selected_an = []
						for (let q = 0; q < mand_and_lim_addons[p].options.length; q++) {

								this.addonList.filter(tt => {
									if (tt._id == mand_and_lim_addons[p].options[q]._id) {
										selected_an.push(tt);
									}
								});

						}
						// console.log('##########', selected_an) 
						if (selected_an.length) {
							if (selected_an.length == mand_and_lim_addons[p].limit) {
								addon_flag.push('Yes');
							} else if (selected_an.length > mand_and_lim_addons[p].limit) {
								addon_flag.push('Yes');
							} else {
								// push no to array
								addon_flag.push('No');
							}
						}
						else {
							// push no to array
							addon_flag.push('No');
						}

					}
					console.log('.....', addon_flag)
					if (addon_flag.length == mand_and_lim_addons.length) {
						let check_all_addons = addon_flag.filter(ss => ss == 'No');

						if (check_all_addons.length) {
							// hide add to order
							this.showAddToOrder = false;
						} else {
							// show add to order
							this.showAddToOrder = true;
						}
					} else if (addon_flag.length > mand_and_lim_addons.length) {
						this.showAddToOrder = true;
					}
					else {
						// hide add to order
						this.showAddToOrder = false;
					}
				} else {
					this.showAddToOrder = false;
				}
			}
		} else {
			this.showAddToOrder = true;
		}

		//sum
		this.item.sold_price = parseInt(this.item.selling_price);
		for (let i = 0; i < this.addonList.length; i++) {
			this.item.sold_price = this.item.sold_price + parseInt(this.addonList[i].price);
		}
		this.item_cost_flag = this.item.sold_price;
	}
	onConfirmPassVal(event)
	{
	
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
		console.log(this.loginForm)
		console.log(this.loginForm)
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
				if(environment.password === false)
				{
					this.loginForm.password = '123456'
					this.loginForm.confirm_password = '123456'
				}
				
				let newSignupForm = {
					'email': this.loginForm.username,
					'name': this.loginForm.name,
					'surname': this.loginForm.surname,
					'mobile': this.loginForm.mobile,
					'password': this.loginForm.password,
					'confirm_password': this.loginForm.confirm_password,
					"company_id":this.restaurant_details.company_id,
					"branch":{"branch_id":this.restaurant_details.branch_id, count:0},
					"smsType":environment.smsType,
					'smsUrl' : environment.smsUrl
				}

				console.log("Signup Details...", newSignupForm)

				this.apiService.DINAMIC_SIGNUP(newSignupForm).subscribe(result => {
					//  this.signupForm.submit = false;
					if (result.status) {
					//	this.pleasewait = false;
						this.loaderStatus = false;
						this.customer_id = result.customer_id;
						this.user_name =  result.name; 
						let sendData = {
							"user": this.customer_id,
							"company_id":this.restaurant_details.company_id,
							"branch_id":this.restaurant_details.branch_id,
							"userBaseURL":environment.userBaseURL
						}
						this.apiService.SEND_CONFIRM_EMAIL_LINK(sendData).subscribe(result => {
							console.log("mail result...", result);
							if(result.status)
							{
								this.loaderStatus = false;

							}
							else
							{
								this.loaderStatus = false;
							}
				
						})
					
						this.enterPasswordField = false;
						this.confirmPasswordField = false;
						this.enterNameField = false;	
						this.mob_num_exist = false;
						this.enterOtpField = true;
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
					this.userDetails = JSON.parse(localStorage.getItem('user_details'));
					modalName.hide();
					// confirmModal.show();
					this.onConfirm();       
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
			this.loginForm.name = "";
			this.loginForm.password = "";

	
}

	}

	// addUserMobile(askmobilemodal) {
	// 	this.social_data['mobile'] = this.mobile_num;
	// 	let userData = this.social_data;

	// 	this.userService.SOCIAL_APP_LOGIN(userData).then((result: any) => {
	// 		if (result.status) {
	// 			this.userDetails = JSON.parse(localStorage.getItem('user_details'));
	// 			askmobilemodal.hide();
	// 			this.onConfirm();
	// 		}
	// 		else this.signupForm.error_msg = result.message;
	// 	});
	// }



	addUserMobile(askmobilemodal,otpModal) {
		// console.log("mobile number", this.mobile_num);
				this.social_data['mobile'] = this.mobile_num;
				let userData = this.social_data;
				console.log('user social login details....', userData);
				console.log("social data...", userData);
			
				// let userDetails = JSON.parse(localStorage.getItem("user_details"))
				// console.log("userDetails.............", userDetails)
		
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
					this.timeLeft = 30;
					this.timeLeftString = '00 : 30';
					this.startTimer();
					this.customer_id=userResp.customer_id;
				})
				
			
			
				this.otpForm.otp = "";
				this.mobileShow = false;
				this.sendOTP = true;
				askmobilemodal.hide();
				otpModal.show();
			
	}



	social_mob_otp_validate(otpModal,confirmModal)
	{
		this.sendOTP = false;
		this.apiService.SOCIALMOB_OTP_VALIDATE({ customer_id: this.customer_id, otp: this.otpForm.otp }).subscribe((result: any) => {
			console.log("result", result);
			
			if(result.status)
			{		
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
							if(result.status)
							{
								this.userDetails = JSON.parse(localStorage.getItem('user_details'));
								otpModal.hide();
								confirmModal.show();
								//this.onConfirm();
							}
							else
							{
								this.sendOTP = true;
								this.resendOTP = true;
							}
						})
						otpModal.hide();
					
					}
					else this.signupForm.error_msg = result.message;
				});
			}
			else
			{

				this.otpForm.error_msg = result.message;
				this.sendOTP = true;
				this.resendOTP = true;
			}
		})
	}

	social_resend_otp()
	{
		let userData = this.social_data;
		console.log('user social login details....', userData);
		console.log("social data...", userData);
		this.userService.disableBtn = true;	
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
					this.timeLeft = 30;
					this.timeLeftString = '00 : 30';
					this.startTimer();
					this.customer_id=userResp.customer_id;
				})
			

	}

	paywithrazor(event) {
		this.apiService.GET_RAZOR_ORDER({ value: 'razor' }).subscribe(result => {
			console.log("result....", result);
			if (result.status) {
				// do stuff
				this.razor_var = result.data;
				// razorpay.once('ready', function(response) {
				//   console.log(response.methods);   
				// })
			}
		})
	}

	razor_submit_standard_checkout(event, confirmModal, paymentFailedModal) {

		this.apiService.GET_RAZOR_ORDER({ value: 'razor' }).subscribe(result => {
			console.log("result....", result);
			if (result.status) {
				// do stuff
				this.razor_var = result.data;

				var options = {
					"key": "rzp_test_YVnEmKmFThGxFC", // Enter the Key ID generated from the Dashboard
					"amount": "1000", // INR 299.35
					"name": "Acme Corp",
					"description": "Razorpay DiNAMIC",
					// "image": "http://localhost:4200/assets/images/Dinamic_Logo.png",
					"image": "https://dinamic.io/upgrade/assets/images/Dinamic_Logo.png",
					"order_id": this.razor_var.id,
					"handler": function (response) {
						console.log(response);
						confirmModal.hide();
					},
					"prefill": {
						"name": "Hariharamoorthi",
						"email": "azurehari@gmail.com",
						"mobile": '9677838548'
					},
					"notes": {
						"address": "note value"
					},
					"theme": {
						"color": "#212121"
					},
					"modal": {
						// "ondismiss": this.closeRazor(confirmModal)
						"ondismiss": function () {
							console.log("Checkout form closed");
							CartComponent.prototype.closeRazor(confirmModal, paymentFailedModal);
							// confirmModal.hide();
							// paymentFailedModal.show();
						}
					}
				};


				var rzp1 = new this.winRef.nativeWindow.Razorpay(options);
				rzp1.open();
			}
		})

	}

	closeRazor(confirmModal, paymentFailedModal) {
		console.log("ondismiss");
		confirmModal.hide();
		paymentFailedModal.show();

	}

	resetRazor() {
		console.log("razor");
		this.router.navigate(['/cart/list']);
	}

	razor_submit_custom_checkout(event) {
		// console.log(event);
		var data = {
			amount: 1000, // in currency subunits. Here 1000 = 1000 paise, which equals to ₹10
			currency: "INR",// Default is INR. We support more than 90 currencies.
			email: 'azurehari@gmail.com',
			contact: '9677838548',
			notes: {
				address: 'Ground Floor, SJR Cyber, Laskar Hosur Road, Bengaluru',
			},
			order_id: this.razor_var.id,
			method: 'card',
			'card[name]': 'Gaurav Kumar',
			'card[number]': '4111111111111111',
			'card[cvv]': '566',
			'card[expiry_month]': '10',
			'card[expiry_year]': '20'
			// method: 'netbanking',        
			// method specific fields
			// bank: 'HDFC'
		};

		// razorpay.createPayment(data);

		// razorpay.on('payment.success', function(resp) {
		//   console.log("payment id",resp.razorpay_payment_id),
		//   console.log("order id",resp.razorpay_order_id),
		//   console.log("razor signature",resp.razorpay_signature)
		// }); // will pass payment ID, order ID, and Razorpay signature to success handler.   

		// razorpay.on('payment.error', function(resp){
		//   console.log(resp.error.description)
		// }); // will pass error object to error handler
	}

	goToOrderStatus() {
		this.router.navigate(['/order-status']);
	}

	closeitemreapter() {
		this.itemRepeatFooter = true;
		console.log('qwerty....', document.querySelector("#slide-bot"))
		document.querySelector("#slide-bot").classList.remove("slide-in-bottom");
		document.querySelector("#slide-bot").classList.add("slide-out-bottom");
		setTimeout(() => { this.itemRepeatFooter = false; }, 250);

		document.querySelector("body").classList.remove("customize-fade");
		document.querySelector("#cartarea").classList.remove("pointer-none");
		document.querySelector("#nav-fade").classList.remove("nav-fade");
		document.querySelector("#cart-summary").classList.remove("section-fade");


	}


	onKeyPress(event: any) {
		// this.values = event.target.value;
		this.otpForm.error_msg = "";
		this.userService.error_msg = "";
		console.log(event.target.value.length)

	 };

	 OnKeyDown(element)
	 {
   //  console.log(element.target.value.length)
	 }
	
	 onKeyUp(element){	
		let length = element.target.value.length ; //this will have the length of the text entered in the input box
		//console.log(element.target.value.length);
		this.userService.continueBtn = false;
		this.userService.loginSocialDisable = true;
			
		if(length === 10)
		{
			
			let sendData =
			{
				mobile : element.target.value,
				type:'checkmobile',
				company_id:this.restaurant_details.company_id,
				branch_id:this.restaurant_details.branch_id,
				user_type:'existing_user'
			}
			this.isReadonly = true;
			console.log("keyup data..........",sendData);
			this.apiService.CHECK_MOBILE_LOGIN(sendData).subscribe(result => {
			console.log("result Mobile..............", result);		
				if(result.data && result.data.activation === true)
				{
					this.userService.loginDetails = result.data;
					this.isReadonly = false;
					this.customer_id = result.data._id;
					this.userService.continueBtn = true;					
				}
				else{
					this.userService.loginSocialDisable = false;
					this.isReadonly = false;
				}

			})
		}
		else
		{
			this.userService.loginSocialDisable = true	
		}
	  }


	  continueSignin(newUserModal,newOTPModal)
	  {
		// newUSerModal.hide() ;
		// newOTPModal.show();
	//	this.social_data['mobile'] = this.mobile_num;
	
		let userData = this.social_data;	
				let sendUserData = {				
					'mobile': this.mobile_num,
					'customer_id' : this.customer_id,
					'otp_status':'sent',
					'user_type':'existing_user',
					'type':'sentotp',
					'company_id':this.restaurant_details.company_id,
					'branch_id':this.restaurant_details.branch_id,
					'smsType':environment.smsType,	
					'smsUrl' : environment.smsUrl
				}	

				this.userService.UPDATE_USER(sendUserData).then((userResp: any) => {
					console.log('userResp1....', userResp);
					// this.timeLeft = 30;
					// this.timeLeftString = '00 : 30';
					// this.startTimer();
					this.customer_id=userResp.customer_id;
				})
			
				newUserModal.hide();
				this.mobileShow = false;				
				this.otpForm.otp = "";
				this.sendOTP = true;
				newOTPModal.show();


	  }
	  
	  signinVerify(newOTPModal)
	  {
		this.loaderStatus = true;
		console.log("otp value.........", this.otpForm.otp)
		let sendUserData = {				
			'mobile': this.mobile_num,
			'customer_id' : this.customer_id,
			'otp_status':'verified',
			'type':'otpverify',
			'otp': String(this.otpForm.otp),
			'company_id':this.restaurant_details.company_id,
			'branch_id':this.restaurant_details.branch_id,	

									
		}	
		console.log("senddata............",sendUserData );
		this.apiService.UPDATE_EXISTING_USER(sendUserData).then(result => {
			console.log('SAVE_SOCIAL_USER....', result);
			console.log("result", result);			
			if(result.status)
			{
				if(result.data.user_id)
				{
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
			   else
			   {
				let userData = {
					id: result.data._id,
					social_unique_id: result.data._id,
					name: result.data.name,
					email: result.data.email,
					mobile: result.data.mobile,	
					email_confirmed: result.data.email_confirmed,			
					provider: 'Dinamic',					
					user_type: result.data.user_type,
					status:result.status
				}
				console.log("true1..........", userData)
				this.email_login_user(userData, newOTPModal);
			   }
				
				
			}
			else
			{

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

	  email_login_user(userData, newOTPModal)
	  {
		this.userService.LOGIN(userData).then((result: any) => {
			console.log('user login....', result);
			if (result.status) {
				this.userDetails = JSON.parse(localStorage.getItem('user_details'));
				newOTPModal.hide();
				//this.loaderStatus = false;				
				this.onConfirm();
			}
			
			else{
				this.loaderStatus = false;
				this.hideConfirmOrder = false;
				this.loginForm.error_msg = result.message;
			} 
		});
	  }

	  social_login_user(userData, newOTPModal)
	  {
		this.hideConfirmOrder = true;
		this.userService.SOCIAL_APP_LOGIN(userData).then((result: any) => {
			
			if (result.status) {
				this.userService.user_name =userData.name;
			    this.photo_url =  userData.photoUrl;
				   newOTPModal.hide();
				   this.loaderStatus = false;
				   if(userData.user_type === 'existing_user')
				   {
					this.apiService.GET_BILL().subscribe(result => {
						console.log('oms bills.....', result);
						if (result.status) {						
							this.ngOnInit();
							let bills = result.bills.bills;
							let check_currentuser_ordered = bills.filter(ss => ss.orderer_name === userData.name);
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
									//askmobilemodal.hide();
									// this.onConfirm(); 
									if (this.take_aways) {
										this.hideConfirmOrder = false;
										document.getElementById("paymentModal").click();
									}
									else {
										this.onConfirm()
									}
						}
					})
				   }
				   else{
					if (this.take_aways) {
						this.hideConfirmOrder = false;
						document.getElementById("paymentModal").click();
					}
					else {
						this.onConfirm()
					} 
				   }
				
			}
			else this.signupForm.error_msg = result.message;
		});
	  }

	  socialSignIn(modalName, socialPlatform: string, otpModal) {
		let socialPlatformProvider;
		this.hideConfirmOrder = true;
	
		this.userService.usableLink = false;
		if (socialPlatform == "facebook") {
			console.log("success2............")
			socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;

		}
		else if (socialPlatform == "google") {
			socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
			console.log("success1............")
			if(socialPlatformProvider)
		{
			console.log("success............")
		}
		else
		{
			console.log("false............")
		}

		}

		console.log("HAndle socialPlatformProvider............", socialPlatformProvider)
		if(socialPlatformProvider)
		{
			console.log("success............")
		}
		else
		{
			console.log("false............")
		}

		this.socialAuthService.signIn(socialPlatformProvider).then((userData: any) => {
			console.log("social data...", userData);

			let sendData = {
				email: userData.email
			}
	        this.social_data = userData;
			
			this.userService.usableLink = true;
			// this.apiService.CHECK_MOBILE_SOCIAL_LOGIN(sendData).subscribe(result => {
			// 	console.log("result Login................", result)
			// 	if (result.status === true && result.data.activation === true) {
			// 		this.social_data = userData;							
			// 	    this.userService.error_msg = result.message;

			// 	} else {
			// 	//	this.social_data = userData;
				  
					console.log("ask_mobile Data", this.social_data)
					modalName.hide();
					
					this.social_data['mobile'] = this.mobile_num;
          
					console.log('user social login details....', this.social_data);
					console.log("social data...", userData);		
					let sendUserData = {
					user_id: userData.id,
					social_unique_id:userData.id,
					name: userData.name,
					email: userData.email,
					mobile: userData.mobile,
					email_confirmed: true,
					photo_url:userData.photoUrl,
					third_party_provider: userData.provider,
					'password': '13579',
					social_user:this.social_data,
					company_id:this.restaurant_details.company_id,
					branch:{branch_id:this.restaurant_details.branch_id, count:0},
					user_type:'new_user',
					smsType:environment.smsType,
					smsUrl : environment.smsUrl,
					count:0													
					}
				this.userService.SAVE_SOCIAL_USER(sendUserData).then((result: any) => {
					console.log('userResp1....', result);
					if(result.status)
					{		
						this.customer_id = result.customer_id;				
						this.timeLeft = 30;
						this.userService.loginDetails = result.data;
						modalName.hide();
						this.mobileShow = false;
						this.otpForm.otp = "";
						this.sendOTP = true;
						this.hideConfirmOrder = false;
						otpModal.show();
					}
					else
					{
						this.loaderStatus = false
						this.hideConfirmOrder = false;	
					}
				})
			// 	}
			// }, err => {
			// 	console.log("Google err............", err)
			// })
		}, err => {
			this.hideConfirmOrder = false;	
			console.log("Google err1............", err);
			this.userService.usableLink= true;
		});

	}
	OTPCloseModal(modalName)
	{
	   modalName.hide();
	   this.loaderStatus = false;
	   this.hideConfirmOrder = false;
	}

}
