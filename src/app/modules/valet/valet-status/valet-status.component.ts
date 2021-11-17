import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CountdownComponent } from 'ngx-countdown';
import { CommonService } from 'src/app/_services/common.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
import { UserService } from 'src/app/_services/user.service';
import { element } from 'protractor';
import { LoadscriptService } from 'src/app/_services/loadscript.service';
import { Socket } from 'ngx-socket-io';
import { Location, PlatformLocation } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { UserBrowserService } from 'src/app/_services/user-browser.service';
@Component({
	selector: 'app-valet-status',
	templateUrl: './valet-status.component.html',
	styleUrls: ['./valet-status.component.css']
})
export class ValetStatusComponent implements OnInit {
	config: any = {};
	delayTime: any = '5';
	delayTime_p: any = '5';
	serial_number: any;
	progressValue: any;
	progressPerc: any;
	showFetchingDetails: any;
	resultString: any;
	confirm_click: boolean = false;
	valet_id: any;
	valet_details: any;
	social_data: any;
	re_request: boolean = false;
	socialLogo: boolean = false;
	sendOTP: boolean = true;
	mobileShow: boolean = false;
	resendOTP: boolean = false;
	modalLogo: boolean = false;
	mobile_num: any;
	isReadonly: boolean = false; mobile: any;
	enterEmailField: boolean = true;
	enterNameField: boolean = true;
	enterSurNameField: boolean = false;
	enterPasswordField: boolean = false;
	confirmPasswordField: boolean = false;
	enterMobileField: boolean = false;
	enterOtpField: boolean = false;
	pleasewait: boolean = false;
	passwordMismatch: boolean = false;
	customer_id: any;
	photo_url: string;
	take_aways: boolean = false;
	loaderStatus: boolean = false;
	mob_num_exist: boolean = false;
	interval: any;
	user_name: any;
	signupForm: any = {}; otpForm: any = {}; loginForm: any = {}; forgotForm: any = {};
	restaurantDetails: any = JSON.parse(localStorage.getItem('restaurant_details'));
	@ViewChild('cd', { static: false }) private countdown: CountdownComponent;
	@ViewChild('closeValett', { static: true }) closeValett: ElementRef;
	@ViewChild('openValetOpenModal', { static: true }) openValetOpenModal: ElementRef;
	// @ViewChild('closeValet',  { static: true }) closeValet: ElementRef;
	@ViewChild('openValetStatusOpenModal', { static: true }) openValetStatusOpenModal: ElementRef;
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));

	@HostListener('window:popstate', ['$event'])
	onPopState(event) {
		console.log('Back button pressed');
		this._location.go('/bill/confirm')
	}

	constructor(
		public commonService: CommonService, 
		private router: Router, 
		private apiService: ApiService, 
		private loadScript: LoadscriptService, 
		private socket: Socket, 
		public userService: UserService, 
		private socialAuthService: AuthService, 
		private _location: Location,
		public browserService: UserBrowserService
		) { }

	ngOnInit() {
		this.confirm_click = true;
		this.re_request = false;
		this.loadScript.load('material-icons').then(data => {
			console.log('font awesome reference added....');
		}).catch(error => console.log('err...', error));

		console.log("status...........", this.confirm_click)
		console.log("valet detail ID ....", this.commonService.valet_details)
		//if (JSON.parse(localStorage.getItem('user_details'))) {
		let a = JSON.parse(localStorage.getItem('user_details'));
		let sendData = {
			//dinamic_user_id:a.dinamic_user_id,
			valet_id: localStorage.getItem("valet_access"),
			access_code: localStorage.getItem("access_code"),
			pos_branch_id: this.restaurantDetails.branch_id
		}
		this.apiService.GET_VALET_DETAILS_STATUS(sendData).subscribe(result => {
			console.log('valet result....', result);

			let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
			if (result.status) {
				this.valet_details = result.data;
				this.commonService.valet_details = result.data;
				this.resultString = result.data.serial_number;


				let data = {
					"vehicle_details": {
						"branch_id": restaurant_details.branch_id,
						"valet_id": this.commonService.valet_details._id,
						"serial_number": result.data.serial_number
					}
				}

				let user_details = JSON.parse(localStorage.getItem('user_details'));
				//this.commonService.valetStatus = 'awaiting';  
				if (result.data.valet_status === 'vehicle_parked') {
					this.re_request = true;

					let data = {
						vehicle_details: {
							_id: this.commonService.valet_details.pos_valet_id,
							serial_number: this.commonService.valet_details.serial_number,
							valet_id: this.commonService.valet_details._id,
							branch_id: restaurant_details.branch_id,
							delivery_time: Date.now(),
							action: 're_request',
							requested_delay: Number(this.delayTime),
							user_details: {
								name: user_details.name,
								contact_number: user_details.mobile,
								email: user_details.email
							}
						}

					}
					localStorage.setItem('valet_details', JSON.stringify(data));

				}
				else {
					this.re_request = false;
				}
				console.log("request status........", this.re_request)
				localStorage.setItem('valet_status', this.commonService.valetStatus);
				console.log("join_valet valet status............")
				this.socket.emit("join_valet", data);
				//  this.router.navigate(['/valet/status']);

			}
			else {
				this.router.navigate(['/']);

			}
		})
		//}

	}



	cancelValet() {
		// this.router.navigate(['/bill/confirm']);
		this.router.navigate(['/home']);
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
		let openValetStatusModal: HTMLElement = this.openValetStatusOpenModal.nativeElement as HTMLElement;
		openValetStatusModal.click();
	}

	backToMenu() {
		// localStorage.removeItem('re_request');
		this.router.navigate(['/home']);
	}

	requestAgain() {
		let valet_details = JSON.parse(localStorage.getItem('valet_details'));

		this.serial_number = this.commonService.valet_details.serial_number
		this.delayTime = '5';
		this.openPop();
	}

	radioChange(event) {
		console.log('delay time....', event);
	}

	contactManager() {
		// console.log('contact manager....');
	}

	vehicleReq() {
		let a = localStorage.getItem('re_request');
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
		let a = localStorage.getItem('re_request');
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

	onConfirm() {
		let valet_details = JSON.parse(localStorage.getItem('valet_details'));
		console.log("valet Details............", valet_details)
		let serial_no = this.commonService.valet_details.serial_number;
		let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
		let user_details = JSON.parse(localStorage.getItem('user_details'));

		let data = {
			vehicle_details: {
				_id: valet_details.vehicle_details._id,
				serial_number: serial_no,
				valet_id: valet_details.vehicle_details.valet_id,
				branch_id: restaurant_details.branch_id,
				delivery_time: Date.now(),
				action: 're_request',
				requested_delay: Number(this.delayTime),
				user_details: {
					name: user_details.name,
					contact_number: user_details.mobile,
					email: user_details.email
				}
			}

		}

		console.log('re-request data.....', data);

		this.apiService.VALET_CONFIRM(data).subscribe(result => {
			console.log('re Request result....', result);
			if (result.status) {
				localStorage.setItem('reRequest', '1');
				// this.closeValet();
				//valetOpenModal.hide();
				this.apiService.GET_BILL().subscribe(result => {
					console.log('oms bills.....', result);
					if (result.status) {
						this.router.navigate(['/bill/confirm'])
					}
					else {
						this.router.navigate(['/home'])
					}
				})
				let data1 = {
					_id: valet_details.vehicle_details._id,
					serial_number: serial_no,
					valet_id: valet_details.vehicle_details.valet_id,
					branch_id: restaurant_details.branch_id,
					delivery_time: Date.now(),
					action: 're_request',
					requested_delay: Number(this.delayTime),
					user_details: {
						name: user_details.name,
						contact_number: user_details.mobile,
						email: user_details.email,
						dinamic_user_id: user_details.dinamic_user_id
					}
				}
				localStorage.setItem('valet_details', JSON.stringify(data1));

				this.commonService.valetStatus = 'awaiting';
				localStorage.setItem('valet_status', this.commonService.valetStatus);
			}
		}, error => {
			console.log('errors.....', error);
		});


	}

	onConfirm1(newUserModal) {
		this.loaderStatus = true;
		this.socialLogo = true;
		this.userService.continueBtn = false;
		this.userService.loginSocialDisable = true;
		this.mobile_num = "";
		console.log("confirm1")
		this.confirm_click = true;
		let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
		let user_details = JSON.parse(localStorage.getItem('user_details'));

		console.log("user_details........", user_details)
		//valetStatusModal.show();
		if (user_details) {
			this.commonService.valetStatus = 'awaiting';
			newUserModal.hide();
			localStorage.setItem('valet_status........', this.commonService.valetStatus);
			console.log(this.commonService.valet_details._id)
			let data = {
				"vehicle_details": {
					"branch_id": restaurant_details.branch_id,
					"valet_id": localStorage.getItem("valet_access"),
					"serial_number": this.resultString,
					"requested_delay": Number(this.delayTime),
					// "delivery_time": "Thu Feb 06 2020 14:19:27 GMT+0530 (India Standard Time)",
					"delivery_time": Date.now(),
					"user_details": {
						"name": user_details.name,
						"contact_number": user_details.mobile,
						"email": user_details.email,
						"dinamic_user_id": user_details.dinamic_user_id
					}
				}
			}
			console.log("Valet data..........", data);
			this.apiService.VALET_CONFIRM(data).subscribe(result => {
				console.log('valet result1....', result);
				if (result.status) {
					localStorage.setItem('valet_details', JSON.stringify(result.data));
					this.apiService.UPDATE_VALET_STATUS({
						valet_id: this.commonService.valet_details._id, valet_status: 'awaiting', type: 'new', pos_valet_id: result.data._id, user_details: {
							"name": user_details.name,
							"contact_number": user_details.mobile, "email": user_details.email, dinamic_user_id: user_details.dinamic_user_id
						}
					}).subscribe(result => {
						console.log('result valet2..........', result);
						this.apiService.GET_BILL().subscribe(result => {
							console.log('oms bills.....', result);
							if (result.status) {
								this.router.navigate(['/bill/confirm'])
							}
							else {
								this.userService.showExit = false;
								this.router.navigate(['/home'])
							}
						})
						//  
					})
				}
			});

		}
		else {
			this.loaderStatus = false;
			newUserModal.show();
		}
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
				let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;

				console.log('order type...', orderType);

				if (orderType == 'in_house') {
					this.apiService.CONFIRMED_ORDERS().subscribe(result => {
						let order_list = result.orders.order_list;
						if (order_list.length) {
							this.router.navigate(['/bill/view'])

						}
						else {
							this.onConfirm1(newOTPModal)
						}

					})
				}
				//   if (this.selected_quick_option.name == 'bill')
				// 	  this.router.navigate(['/bill/view']);
				//   else if (this.selected_quick_option)
				// 	  this.onServiceConfirm(this.selected_quick_option);
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
				this.loaderStatus = true;
				// if (userData.user_type === 'existing_user') {
					let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;

					if (orderType == 'in_house') {
						this.apiService.CONFIRMED_ORDERS().subscribe(result => {
							// let order_list = result.orders.order_list;
							console.log("result of confirm orders............", result)

							// this.onConfirm1(newOTPModal)

							if (result.status != 0) {
								let order_list = result.orders.order_list;
								if (result.orders && result.orders.order_list && result.orders.order_list.length) {
									this.router.navigate(['/bill/view'])
								}
								else {
									this.onConfirm1(newOTPModal)
								}
							}
							else {
								this.onConfirm1(newOTPModal)
							}
							//   if (order_list.length) {
							// 	  this.router.navigate(['/bill/view'])

							//   }
							//   else{
							// 	  this.onConfirm1(newOTPModal)
							//   }

						})
					}
				// }

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
				count: 0
			}
			this.userService.SAVE_SOCIAL_USER(sendUserData).then((result: any) => {
				console.log('userResp1....', result);
				if (result.status) {
					this.customer_id = result.customer_id;
					// this.timeLeft = 60;
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

	// userEmailCheck(modalName) {
	// 	this.passwordMismatch = true;
	// 	if (this.loginForm.name) {
	// 		this.enterEmailField = false;
	// 		this.enterOtpField = false;
	// 		this.enterNameField = true;
	// 		this.enterPasswordField = true;
	// 		this.confirmPasswordField = true;
	// 		this.mob_num_exist = false;

	// 		if (this.loginForm.password !== this.loginForm.confirm_password) {
	// 			console.log("Mismatch password....");
	// 			this.passwordMismatch = true;
	// 			this.userService.pass_error = "Password Mismatch"

	// 		} else {
	// 			this.userService.pass_error = ""
	// 			this.passwordMismatch = false;
	// 			this.loaderStatus = true;

	// 			let newSignupForm = {
	// 				'email': this.loginForm.username,
	// 				'name': this.loginForm.name,
	// 				'surname': this.loginForm.surname,
	// 				'mobile': this.mobile_num,
	// 				'password': this.loginForm.password,
	// 				'confirm_password': this.loginForm.confirm_password,
	// 				"company_id": this.restaurant_details.company_id,
	// 				"branch": { "branch_id": this.restaurant_details.branch_id, count: 0 },
	// 				"smsType": environment.smsType
	// 			}

	// 			console.log("Signup Details...", newSignupForm)

	// 			this.apiService.DINAMIC_SIGNUP(newSignupForm).subscribe(result => {
	// 				console.log("signup result Data.........", result)
	// 				if (result.status) {
	// 					this.loaderStatus = false;
	// 					this.customer_id = result.customer_id;
	// 					this.user_name = result.name;
	// 					let sendData = {
	// 						"user": this.customer_id,
	// 						"company_id": this.restaurant_details.company_id,
	// 						"branch_id": this.restaurant_details.branch_id,
	// 						"userBaseURL": environment.userBaseURL
	// 					}
	// 					this.apiService.SEND_CONFIRM_EMAIL_LINK(sendData).subscribe(result => {
	// 						console.log("mail result...", result);
	// 						if (result.status) {
	// 							this.loaderStatus = false;

	// 						}
	// 						else {
	// 							this.loaderStatus = false;
	// 						}

	// 					})

	// 					this.enterPasswordField = false;
	// 					this.confirmPasswordField = false;
	// 					this.enterNameField = false;
	// 					this.mob_num_exist = false;
	// 					this.enterOtpField = true;
	// 				}
	// 				else {
	// 					console.log('response', result);
	// 					this.loaderStatus = false;
	// 					this.loginForm.error_msg = result.message;
	// 					this.signupForm.error_msg = result.message;
	// 				}
	// 			});

	// 		}

	// 	}
	// }

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

	userOtpValidate(modalName) {
		console.log("validate initiated...", this.customer_id)
		this.loaderStatus = true;
		if (this.otpForm.otp !== '') {
			this.userService.SIGNUP_OTP_VALIDATE({ customer_id: this.customer_id, otp: String(this.otpForm.otp) }).then((result: any) => {
				console.log("OTP Result.....", result)
				if (result.status) {
					this.onConfirm1(modalName);
				}
				else {
					this.loaderStatus = false;
					this.otpForm.error_msg = result.message;
					console.log("error OTP")
				};
			});
		}

	}

}
