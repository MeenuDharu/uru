import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import { ApiService } from '../../../_services/api.service';
import { SnackbarService } from '../../../_services/snackbar.service';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { send } from 'q';
import { Socket } from 'ngx-socket-io';
import { LoadscriptService } from 'src/app/_services/loadscript.service';
import { environment } from '../../../../environments/environment';
import { Location, PlatformLocation } from '@angular/common';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
import { CookieService } from 'ngx-cookie-service';
const FileSaver = require('file-saver');

@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {

	isSticky: boolean = false;
	@HostListener('window:scroll', ['$event'])
	checkScroll() {
		this.isSticky = window.pageYOffset >= 10;
	}

	optionCheck: string; waterType: string;
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	menu_categories: any = []; quick_options: any = []; selected_quick_option: any = null;
	//baseUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url + '/';
	baseUrl = environment.img_url;
	signupForm: any = {}; otpForm: any = {}; loginForm: any = {}; forgotForm: any = {};
	lp_hide: boolean; sp_hide: boolean;
	cartItems: Number = 0;
	restaurantDetails: any = JSON.parse(localStorage.getItem('restaurant_details'));
	customer_id: any;
	photo_url: string;
	user_name: any;
	enterEmailField: boolean = true;
	enterNameField: boolean = true;
	enterSurNameField: boolean = false;
	enterPasswordField: boolean = false;
	confirmPasswordField: boolean = false;
	enterMobileField: boolean = false;
	enterOtpField: boolean = false;
	pleasewait: boolean = false;
	passwordMismatch: boolean = false;
	interval: any;
	timeLeft: number = 30;
	timeLeftString: String = '00 : 30';
	mob_num_exist: boolean = false;
	exist_email: String = '';
	social_data: any;
	mobile_num: any;
	order_number: any;
	awaitingcontent: any;
	index: any;
	take_aways: boolean = false;
	order_status: boolean;
	loaderStatus: boolean = true;
	disableBtn: boolean = false;
	tag: any;
	tagHead: any;
	socialLogo: boolean = false;
	sendOTP: boolean = true;
	mobileShow: boolean = false;
	resendOTP: boolean = false;
	modalLogo: boolean = false;
	isReadonly: boolean = false;
	no_category_message: any;
	sectionTag: string;
	page_redirect: string;
	orderTypeFlag: string;
	deviceStringCat: string;
	deviceStringLogo: string;
	deviceStringItem: string;
	alterUrl: any;

	@HostListener('window:popstate', ['$event'])
	onPopState(event) {
		console.log('Back button pressed');
		this._location.go('/home')
	}
	constructor(private socket: Socket, private router: Router, public userService: UserService, private socialAuthService: AuthService, private apiService: ApiService, private snackBar: SnackbarService,
		private ldScript: LoadscriptService, private _location: Location, location: PlatformLocation, private browserService: UserBrowserService, private cookieService: CookieService) {

	}






	// @HostListener('window:scroll', ['$event']) // for window scroll events
	// onScroll(event) {
	//   console.log(window.scrollX);  
	//   console.log(window.scrollY);    
	// } 

	// @ViewChild('scroll', { static: true, read: ElementRef }) public scroll: ElementRef<any>;

	ngOnInit() {

		// this._location.subscribe(x => {console.log(x); this._location.go('/home')});
		this.ldScript.load('font-awesome', 'material-icons').then(data => {
			console.log('font awesome reference added....');
		}).catch(error => console.log('err...', error));

		if (this.browserService.isChrome) {
			this.alterUrl = 'assets/images/Dinamic_Logo.webp'
		}
		else {
			this.alterUrl = 'assets/images/Dinamic_Logo.png'
		}

		this.sp_hide = true;
		this.optionCheck = 'Room Temp';
		this.waterType = 'Regular';
		this.userService.cust = false;

		this.tag = localStorage.getItem('selected_tag_name');
		this.tagHead = localStorage.getItem('selected_tag_header');

		this.sectionTag = localStorage.getItem('selected_section_name');
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

					if (result.branch_details[0].departments) {
						var departments = result.branch_details[0].departments.sort((a, b) => {
							return a.department_order - b.department_order;
						});
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

		console.log("categories.....................", this.restaurantDetails.menu_category)
		console.log("tag.............", this.tag)
		if (this.restaurantDetails.isDepartment) {

			this.restaurantDetails.menu_category.filter((i) => {

				let t1 = i.associated_dept_sections.filter((j) => {
					console.log("dept sections.....", j);

					if (j._id === this.sectionTag && j.selected === true) {
						console.log("menu sections...........", j.menu_sections)
						let t = j.menu_sections.filter((k) => k._id === this.tag && k.selected === true);
						if (t.length) {
							this.menu_categories.push(i)
							return i;
						}
					}

				});


			});

		}
		else {

			if (this.tag === 'all') {
				this.menu_categories = this.restaurantDetails.menu_category;
			}
			else {


				this.restaurant_details.menu_category.filter((item) => {
					// console.log("Items.......", item)
					let menu_items = item.associated_dept_sections.filter((menu) => {
						// console.log('type of tax.value  --------',menu);								
						let t = menu.menu_sections.filter((j) => j._id === this.tag && j.selected === true);
						if (t.length) {
							this.menu_categories.push(item)
							return item;
						}

					})

				})

			}
		}


		if (this.menu_categories === 0) {
			this.no_category_message = 'No items found in this category';
		}

		console.log('categories..............', this.menu_categories);
		this.quick_options = this.restaurantDetails.quick_options;
		console.log("this.quick_options", this.quick_options)
		this.selected_quick_option = null;
		//cart
		let cartDetails = this.userService.CART_DETAILS();
		this.cartItems = cartDetails.cart_items;
		// document.querySelector('.modal-backdrop.in')
		if (document.querySelector('.modal-backdrop')) {
			document.querySelector('.modal-backdrop').classList.remove('modal-backdrop');
			document.querySelector('body').classList.remove('modal-open');
			// document.querySelector('body').classList.remove('.modal-open');
			// document.body.classList.remove('.modal-open');  
		}

		let userDetails = JSON.parse(localStorage.getItem('user_details'));

		if (userDetails) {
			let dummy = {
				"vehicle_details": {
					"branch_id": "5befbfac2b814422a23360ab",
					"valet_id": "valet_1",
					"serial_number": "123456"
				}
			}
			console.log("join_valet category......................")
			this.socket.emit('join_valet', dummy);
		}

		let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;

		if (orderType == 'in_house') {
			this.take_aways = false;
			if (userDetails) {
				this.apiService.CONFIRMED_ORDERS().subscribe(result => {
					// console.log('confirmed orders....', result);
				})




				this.apiService.PLACED_ORDERS().subscribe(result => {
					// console.log("placed orders....", result);
					if (result.status) {
						if (result.orders.order_list.length) {

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
					// console.log('oms bills.....', result);
					if (result.status) {

						let bills = result.bills.bills;
						let check_currentuser_ordered = bills.filter(ss => ss.orderer_name != userDetails.name);
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
			this.take_aways = true;
			this.userService.placed_order_status = false;
		}
		console.log("loader status............", this.loaderStatus)

		setTimeout(() => { this.loaderStatus = false; }, 500);
	}

	ngAfterViewInit() {
		let catInd = localStorage.getItem('catIndex');
		console.log("catInx...............", catInd)
		if (catInd) {
			if (Number(catInd) > 0) {
				let ids = Number(catInd) - 1;
				let idscr = 'scrollTo' + ids;
				let scr_element = document.getElementById(idscr);
				scr_element.scrollIntoView();
			}
			// {behavior: "smooth", block: "start", inline: "nearest"}
		}
	}
	newCategory() {
		this.restaurantDetails.menu_category.filter((i) => {


			let t1 = i.associated_dept_sections.filter((j) => j.header === this.tag);
			let t = i.associated_menu_sections.filter((j) => j.name === this.tag);
			if (t.length) {
				this.menu_categories.push(i)
				return i;
			}

		});
	}
	onQuickOption(x) {
		this.selected_quick_option = x;
		localStorage.setItem("selected_quick_option", JSON.stringify(this.selected_quick_option));
		if (x.name == "water") {
			document.getElementById("open-water-option").click();
		}
		else {
			if (x.name == "call waiter") this.selected_quick_option.body_content = "Require assistance?";
			else this.selected_quick_option.body_content = "Need a refill?";
			document.getElementById("open-quick-option").click();
		}
	}

	onViewBill(userModal) {
		if (localStorage.getItem('user_details'))
			this.router.navigate(['/bill/view']);
		else {
			this.selected_quick_option = { name: "bill" };
			localStorage.setItem("selected_quick_option", JSON.stringify(this.selected_quick_option));
			userModal.show();
		}
	}



	viewOrder() {

		this.loaderStatus = true;
		this.router.navigate(['/cart/list']);
	}

	onServiceCall(userModal, serviceModal) {
		this.disableBtn = true;
		if (localStorage.getItem('user_details')) {
			this.onServiceConfirm(this.selected_quick_option).then((result: any) => {
				console.log('response', result);
				if (result) {
					serviceModal.hide();
					this.disableBtn = false;
					this.snackBar.OPEN('Your service call has been placed.', 'Close');
				}
				else { console.log('response', result.response); }
			});
			//serviceModal.hide();
			//this.disableBtn = false;			
			this.socialLogo = false;
		}
		else {
			serviceModal.hide();
			this.userService.continueBtn = false;
			this.userService.loginSocialDisable = true;
			this.isReadonly = false;
			this.disableBtn = false;
			this.socialLogo = true;

			userModal.show();
		}
	}

	onServiceConfirm(selectedQuickOption) {
		return new Promise((resolve, reject) => {
			let sendData = null;
			let type_id;
			let order_type;
			if (this.restaurantDetails.order_type === 'in_house') {
				type_id = this.restaurantDetails.table_id;
				order_type = this.restaurantDetails.order_type
			}
			else {
				type_id = localStorage.getItem("pos_order_id");
				order_type = this.restaurantDetails.order_type;
			}


			if (selectedQuickOption.name == 'water') {
				console.log(this.waterType)
				if (this.waterType == 'Bottled') {
					sendData = {
						services: [{
							service_id: selectedQuickOption._id,
							name: "Bottled water (" + this.optionCheck + ")",
							quantity: 1,
							free_service: false,
							price: selectedQuickOption.service_cost[0].price,
							called_on: "12/02/2015",

						}],
						order_type: order_type,
						type_id: type_id
					};
				}
				else {
					sendData = {
						services: [{
							service_id: selectedQuickOption._id,
							name: "Regular water (" + this.optionCheck + ")",
							quantity: 1,
							free_service: true,
							called_on: "12/02/2015"
						}],
						order_type: order_type,
						type_id: type_id
					};
				}
			}
			else {
				sendData = {
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
			}
			console.log(sendData)
			// service api
			this.apiService.CONFIRM_SERVICE(sendData).subscribe(result => {
				console.log("service call..........", result)
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

	// socialSignIn(modalName, socialPlatform: string, askmobilemodal) {
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
	//     //     modalName.hide();
	//     //     if(this.selected_quick_option.name=='bill')
	//     //      this.router.navigate(['/bill/view']);
	//     //     else if(this.selected_quick_option)
	//     //      this.onServiceConfirm(this.selected_quick_option);
	//     //   }
	//     //   else this.signupForm.error_msg = result.message;
	//     // });
	//   });
	// }

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

	userOtpValidate(modalName) {
		this.loaderStatus = true;
		this.userService.SIGNUP_OTP_VALIDATE({ customer_id: this.customer_id, otp: this.otpForm.otp }).then((result: any) => {
			if (result.status) {
				modalName.hide();
				this.loaderStatus = false;
				if (this.selected_quick_option.name == 'bill')
					this.router.navigate(['/bill/view']);
				else if (this.selected_quick_option)
					this.onServiceConfirm(this.selected_quick_option);
			}
			else {
				this.otpForm.error_msg = result.message;
				this.loaderStatus = false;
			}
		});
	}

	userLogin(modalName) {
		this.userService.LOGIN(this.loginForm).then((result: any) => {
			console.log('user login....', result);
			if (result.status) {
				modalName.hide();
				if (this.selected_quick_option.name == 'bill')
					this.router.navigate(['/bill/view']);
				else if (this.selected_quick_option)
					this.onServiceConfirm(this.selected_quick_option);
			}
			else this.loginForm.error_msg = result.message;
		});
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


			this.userService.pass_error = "";
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
				'mobile': this.loginForm.mobile,
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
					modalName.hide();
					if (this.selected_quick_option.name == 'bill')
						this.router.navigate(['/bill/view']);
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
			this.loginForm.name = "";
			this.loginForm.password = "";
		}

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

			} else {
				this.timeLeftString = '00 : 00';
				if (this.timeLeft == 0) {
					this.apiService.OTP_EXPIRATION({ customer_id: this.customer_id }).subscribe(result => {
						// console.log("OTP Expiration....", result);
						clearInterval(this.interval);
					})
				}

			}
		}, 1000)
	}

	resend_otp() {
		this.apiService.RESEND_OTP({ customer_id: this.customer_id, mobile: this.loginForm.mobile }).subscribe(result => {
			console.log("Resend OTP...", result);
			this.timeLeft = 30;
			this.timeLeftString = '00 : 30';

			this.startTimer();
		})
	}

	closeLogin() {
		this.enterEmailField = true;
		this.enterOtpField = true;
		this.enterNameField = false;
		this.enterMobileField = false;
		this.enterSurNameField = false;
		this.enterPasswordField = false;
		this.confirmPasswordField = false;
		this.pleasewait = false;
		this.loaderStatus = false;
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
		else if (this.enterNameField) {
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

	optionChange(x) {
		if (x == 'Warm') { this.waterType = 'Regular'; }
	}

	onItemPage(category, catIndex) {
		category.popup = false;
		console.log("catIndex....", catIndex);
		localStorage.removeItem("scroll_y_pos")
		this.router.navigate(['/menu/items']);
		localStorage.setItem('catIndex', catIndex);
		localStorage.setItem('selected_category', JSON.stringify(category));
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

	addUserMobile(askmobilemodal) {

		this.social_data['mobile'] = this.mobile_num;
		let userData = this.social_data;

		this.userService.SOCIAL_APP_LOGIN(userData).then((result: any) => {
			if (result.status) {
				askmobilemodal.hide();
				if (this.selected_quick_option.name == 'bill')
					this.router.navigate(['/bill/view']);
				else if (this.selected_quick_option)
					this.onServiceConfirm(this.selected_quick_option);
			}
			else this.signupForm.error_msg = result.message;
		});
	}
	goToOrderStatus() {
		this.router.navigate(['/order-status']);
		localStorage.setItem("viewStatus", "awaiting")
	}




	onKeyPress(event: any) {
		// this.values = event.target.value;
		this.otpForm.error_msg = "";
		this.userService.error_msg = "";
		console.log(event.target.value.length)

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
					this.userService.loginSocialDisable = false;
					this.isReadonly = false;
				}

			})
		}
		else {
			this.userService.loginSocialDisable = true
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
				newOTPModal.show() :
				this.signinVerify(newOTPModal);
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
			'otp': environment.smsApiStatus ? String(this.otpForm.otp) : '123456',
			'company_id': this.restaurant_details.company_id,
			'branch_id': this.restaurant_details.branch_id,


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
				if (this.selected_quick_option.name == 'bill')
					this.router.navigate(['/bill/view']);
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

			if (result.status) {
				this.userService.user_name = userData.name;
				this.photo_url = userData.photoUrl;
				newOTPModal.hide();
				this.loaderStatus = false;


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
				else (userData.user_type === 'existing_user')
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
							if (this.selected_quick_option.name == 'bill')
								this.router.navigate(['/bill/view']);
							else if (this.selected_quick_option)
								this.onServiceConfirm(this.selected_quick_option);

						}
					})
				}

			}
			else this.signupForm.error_msg = result.message;
		});
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
			//	this.social_data = userData;

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
				count: 0
			}
			this.userService.SAVE_SOCIAL_USER(sendUserData).then((result: any) => {
				console.log('userResp1....', result);
				if (result.status) {
					this.customer_id = result.customer_id;
					this.timeLeft = 30;
					this.userService.loginDetails = result.data;
					modalName.hide();
					this.mobileShow = false;
					this.otpForm.otp = "";
					this.sendOTP = true;
					this.loaderStatus = false;
					otpModal.show();
				}
				else {
					this.loaderStatus = false;
				}
			})
			// 	}
			// }, err => {
			// 	console.log("Google err............", err)
			// })
		}, err => {
			this.loaderStatus = true;
			console.log("Google err1............", err);
			this.userService.usableLink = true;
		});

	}

	OTPCloseModal(modalName) {
		modalName.hide();
		this.loaderStatus = false;
	}
	onOtherService(userModal, routingName) {
		// localStorage.setItem('close_tooltip','true');  
		console.log("show exist", this.userService.showExit)
		this.page_redirect = null;
		this.selected_quick_option = null;
		this.socialLogo = true;
		if (this.take_aways) {
			routingName = '/myorder';
		}
		else {
			routingName = '/bill/view';
		}

		console.log(routingName);
		console.log(this.orderTypeFlag);
		if (this.userService.showExit) {
			//console.log("valet")

			if (routingName == 'valet') {
				console.log("qwerty.....", localStorage.getItem('application_type'));
				if (localStorage.getItem('application_type') == 'ios') routingName = '/valet-ios';
				else routingName = '/valet-android';
			}

		}

		else {
			if (routingName == 'valet') {

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
									this.router.navigate(['/bill/view']);
								} else {
									// this.router.navigate(['/bill/confirm']);
									this.router.navigate(['/bill/view']);
								}

							} else {

								if (routingName == '/valet-android') {
									this.router.navigate(['/valet-android']);
								} else {
									// this.router.navigate(['/bill/confirm']);
									this.router.navigate(['/bill/view']);
								}

								// this.router.navigate(['/bill/view']);
							}

						} else {
							console.log('asdfg.....', routingName);
							if (routingName == '/valet-android') {
								this.router.navigate(['/valet-android']);
							} else {
								// this.router.navigate(['/bill/confirm']);
								this.router.navigate(['/bill/view']);
							}
							// this.router.navigate(['/bill/view']);
						}
					}
					else {
						//No orders found table
						console.log('asdfg.....', routingName);
						if (routingName == '/valet-android') {
							this.router.navigate(['/valet-android']);
						} else {
							// this.router.navigate(['/bill/confirm']);
							this.router.navigate(['/bill/view']);
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
				this.router.navigate(['/valet-android']);
			}
			else if (routingName === '/valet-ios') {
				this.router.navigate(['/valet-ios']);
			}
			else {
				this.page_redirect = routingName;
				this.mobile_num = "";
				this.userService.continueBtn = false;
				this.userService.loginSocialDisable = true;
				this.isReadonly = false;
				this.socialLogo = true;
				userModal.show();
			}

		}
	}
	downloadPdf(pdfUrl: string, pdfName: string) {
		//const pdfUrl = './assets/sample.pdf';
		//const pdfName = 'your_pdf_file';
		FileSaver.saveAs(pdfUrl, pdfName);
	}


}

