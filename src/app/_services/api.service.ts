import { Observable } from "rxjs"
import { Injectable, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { resolve } from 'dns';
import { reject } from 'q';
import { Socket } from 'ngx-socket-io';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	loginErrMsg: any;
	tableName: string = 'yyy';	
    user_name:string;
	constructor(private http: HttpClient, private cookieService: CookieService, private socket: Socket, private router: Router) { }
	// DiNAMIC Scan
	ACCESS_CODE_DETAILS(x) { return this.http.post<any>(environment.ws_url + '/user/scan/web/restaurant_details', x); }
	// DiNAMIC Auth
	DINAMIC_SIGNUP(x) { return this.http.post<any>(environment.ws_url + '/user/auth/signup', x); }
	SAVE_PAYMENT(x) {
		console.log("payment details api service...", x);
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.post<any>(environment.ws_url + '/user/bill/payment_details', x, httpOptions);
	}
	GET_PAYMENT(x) {
		console.log("payment details api service...", x);
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.post<any>(environment.ws_url + '/user/bill/get_payment_details', x, httpOptions);
	}
	SEND_CONFIRM_EMAIL_LINK(x) {
		console.log("SEND_CONFIRM_EMAIL_LINK...", x);
		return this.http.post<any>(environment.ws_url + '/user/auth/email_confirmation', x);
	}
	LOGIN_WITH_GOOGLE_SOCIAL(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/loginWithGoogle', x);
	}
	GET_GOOGLE_ACCESS_TOKEN(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/googleoAuthValidation', x);
	}
	RAZOR_WEBHOOK(x) {
		let restaurant_det  = JSON.parse(localStorage.getItem('restaurant_details'));
		return this.http.post<any>(environment.ws_url + '/user/auth/otp_expired'+ '/user/auth/razorpay_webhook/'+x.branch_id, x);
		
	}
	OTP_EXPIRATION(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/otp_expired', x);
	}
	RESEND_OTP(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/resend_otp', x);
	}
	SEND_OTP(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/send_otp', x);
	}
	MOB_OTP_VALIDATE(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/mob_otp_validate', x);
	}
	CHECK_MOBILE_NUMBER_EXIST(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/check_mobile_number_exist', x);
	}
	CHECK_MOBILE_SOCIAL_LOGIN(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/check_mobile_social_login', x);
	}
	CHECK_MOBILE_LOGIN(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/check_mobile_login', x);
	}
	USER_EMAIL_CONFIRMED(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/user_email_confirmed', x);
	}
	FORGOT_PWD_REQUEST(x) { return this.http.post<any>(environment.ws_url + '/user/auth/forgot_request', x); }
	VALIDATE_FORGOT_REQUEST(x) { return this.http.post<any>(environment.ws_url + '/user/auth/validate_forgot_request', x); }
	UPDATE_PWD(x) { return this.http.post<any>(environment.ws_url + '/user/auth/update_pwd', x); }
	DINAMIC_OTP_VALIDATE(x): any {
		return new Promise((resolve, reject) => {
			this.http.post<any>(environment.ws_url + '/user/auth/otp_validate', x).subscribe((result) => {
				resolve(result)
			})
		})
	};
	CREATE_SOCIAL_LOGIN_USER(x): any {
		return new Promise((resolve, reject) => {
			this.http.post<any>(environment.ws_url + '/user/auth/save_social_user', x).subscribe((result) => {
				resolve(result);
			})
		})
	}
	
	UPDATE_EXISTING_USER(x): any {
		return new Promise((resolve, reject) => {
			this.http.post<any>(environment.ws_url + '/user/auth/update_existing_user', x).subscribe((result) => {
				resolve(result);
			})
		})
	}

	UPDATE_SOCIAL_LOGIN_USER(x): any {
		return new Promise((resolve, reject) => {
			this.http.post<any>(environment.ws_url + '/user/auth/update_social_user', x).subscribe((result) => {
				resolve(result);
			})
		})
	}
	
	DINAMIC_LOGIN(x): any {
		return new Promise((resolve, reject) => {
			this.http.post<any>(environment.ws_url + '/user/auth/login', x).subscribe((result) => {
				resolve(result)
			})
		})
	};
	DINAMIC_LOGIN_EMAIL(x): any {
		return new Promise((resolve, reject) => {
			this.http.post<any>(environment.ws_url + '/user/auth/login_email', x).subscribe((result) => {
				resolve(result)
			})
		})
	}
	SOCIALMOB_OTP_VALIDATE(x){ return this.http.post<any>(environment.ws_url + '/user/auth/social_otp_validate', x);}
	DINAMIC_LOGOUT(x) { return this.http.post<any>(environment.ws_url + '/user/auth/logout', x); }
	// DiNAMIC Session
	DINAMIC_ADD_SESSION(x): any {
		return new Promise((resolve, reject) => {
			this.http.post<any>(environment.ws_url + '/user/session/add', x).subscribe((result) => {
				resolve(result)
			})
		})
	};
	// DiNAMIC Bill
	DINAMIC_BILL_CONFIRM(x) {
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.post<any>(environment.ws_url + '/user/bill/confirm', x, httpOptions);
	}
	// DiNAMIC PAYMENT 
	CONFIRM_PAYMENT(x) {
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.post<any>(environment.ws_url + '/user/bill/proceedtopay', x, httpOptions);
	}
	//DiNAMIC PAYMENT STATUS
	GET_PAYMENT_REQUEST_STATUS(x) {
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.post<any>(environment.ws_url + '/user/bill/getpaymentrequeststatus', x, httpOptions);
	}


	// POS
	RESTAURANT_LOGIN(x): any {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		console.log("RESTAURANT_LOGIN posUrl................",posUrl)
		return new Promise((resolve, reject) => {
			this.http.post<any>(posUrl + '/auth/sociallogin', x).subscribe((result) => {
				console.log("api result.............", result)
				//this.user_name = result.userName;
				resolve(result)
			}, err => {
				// console.log("api er..........", err)
				//         if (err.status === 401) {
				//           console.log('error ------------', err);



				//           // let openModal: HTMLElement = this.openModal.nativeElement as HTMLElement;
				//           // openModal.click();
				//           document.getElementById("alertDetailsModal").click();
				//           this.loginErrMsg = err.error.error;
				//           this.tableName = err.error.table_name
				//           console.log(this.tableName)
				//           // alert('User already logged in another table');

				//          // let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
				//         //  this.socket.emit('leave_table', restaurant_det.table_id);
				//           localStorage.clear();
				//         //  localStorage.setItem("existingtableName",err.error.table_name);
				//           sessionStorage.clear();
				//           this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');
				//         }
				reject(err);

			})
		})
	};
	ITEM_LIST(x: any) {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')!).pos_base_url;
		let d = new Date();
		let year = d.getFullYear();
		let month = d.getMonth();
		let day = d.getDate();
		let hour = d.getHours();
		let minute = d.getMinutes();
		let second = d.getSeconds();
		let currentDate = new Date(Date.UTC(year, month, day, hour, minute, second)).getTime()
		return this.http.get<any>(posUrl + '/detail/items/' + x + '/' + currentDate);
		// return this.http.get<any>(posUrl+'/detail/items/'+x);
	}
	CONFIRM_ORDER(x) {
		console.log(x);
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.put<any>(posUrl + '/oms/orders', x, httpOptions);
	}
	PLACED_ORDERS() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		let restaurant_det  = JSON.parse(localStorage.getItem('restaurant_details'));
		let takeaway_orderid = localStorage.getItem('pos_order_id')
		if(restaurant_det.order_type === 'in_house')
		{return this.http.get<any>(posUrl + '/oms/orders/'+restaurant_det.table_id+'/placed', httpOptions);}
		else{return this.http.get<any>(posUrl + '/oms/orders/'+takeaway_orderid+'/placed', httpOptions);}		
	}

	CONFIRMED_ORDERS() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };	
		let restaurant_det  = JSON.parse(localStorage.getItem('restaurant_details'));
		let takeaway_orderid = localStorage.getItem('pos_order_id')	
		if(restaurant_det.order_type === 'in_house')
		{return this.http.get<any>(posUrl + '/oms/orders/'+restaurant_det.table_id+'/confirmed', httpOptions);}
		else{return this.http.get<any>(posUrl + '/oms/orders/'+takeaway_orderid+'/confirmed', httpOptions);}
	}

	GET_LIVE_ORDERS() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		let restaurant_det  = JSON.parse(localStorage.getItem('restaurant_details'));
		let takeaway_orderid = localStorage.getItem('pos_order_id')
		if(restaurant_det.order_type === 'in_house')
		{return this.http.get<any>(posUrl + '/oms/orders/'+restaurant_det.table_id, httpOptions);}
		else{return this.http.get<any>(posUrl + '/oms/orders/'+takeaway_orderid, httpOptions);}
	}
	GET_MY_LIVE_ORDERS() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.get<any>(posUrl + '/oms/myorders', httpOptions);
	}
	GET_ALL_MY_ORDERS() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.get<any>(posUrl + '/oms/myorders/all/0', httpOptions);
	}
	GET_OFFERS() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.get<any>(posUrl + '/management/offers', httpOptions);
	}
	GET_MY_ORDERS() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.get<any>(posUrl + '/history/myorders', httpOptions);
	}
	GET_LIVE_ORDERS_BY_ID(orderId) {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.get<any>(posUrl + '/oms/order/' + orderId, httpOptions);
	}
	GET_COMPLETED_ORDERS_BY_ID(orderId) {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.get<any>(posUrl + '/history/order/' + orderId, httpOptions);
	}
	GET_ORDER_ACCESS_TOKEN() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		// console.log("token.....", token);
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.get<any>(posUrl + '/management/token/regenerate/', httpOptions);
	}
	
	SERVICE_STATUS_REQUEST(x)
	{		
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;		
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };	
		console.log("x..............",x)
		return this.http.patch<any>(posUrl + '/oms/sc/',x, httpOptions);
	}

	GET_BILL() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;	
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };		
		let restaurant_det  = JSON.parse(localStorage.getItem('restaurant_details'));
		let takeaway_orderid = localStorage.getItem('pos_order_id')
		console.log("bill confirm table details..........", restaurant_det)
		if(restaurant_det.order_type === 'in_house')
		{return this.http.get<any>(posUrl + '/oms/bills/table/'+restaurant_det.table_id, httpOptions);}
		else{return this.http.get<any>(posUrl + '/oms/bills/takeaway/'+localStorage.getItem('pos_order_id'), httpOptions);}
		
	}
	SAVE_PAYMENT_DETAILS(x) {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.patch<any>(posUrl + '/oms/bills/',x, httpOptions);
	}
	USER_FEEDBACK(x) {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.put<any>(posUrl + '/oms/feedback', x, httpOptions);
	}
	CONFIRM_SERVICE(x) {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.put<any>(posUrl + '/oms/services', x, httpOptions);
	}
	GET_USER_FEEDBACK() {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.get<any>(posUrl + '/oms/feedback', httpOptions);
	}
	GET_GOOGLE_CONTACT() {
		// https://people.googleapis.com/v1/contactGroups:batchGet?maxMembers=1000&resourceNames=contactGroups%2FmyContacts&fields=responses&key={YOUR_API_KEY}
		// return this.http.get<any>('https://people.googleapis.com/v1/people/me?personFields=phoneNumbers&fields=phoneNumbers&key=AIzaSyBejjMCc8Odhtye5ynfK5OYYhrtiGsr_Ow')    
	}
	GET_RAZOR_ORDER(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/razor_order_api', x);
	}

	BRANCH_CATEGORIES(x) {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + localStorage.getItem('token');
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.get<any>(posUrl + '/management/branch_categories/' + x, httpOptions);
	}

	PAYUBIZ_PAYMENT_REQUEST(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/payu_api', x);
		// https://sandboxsecure.payu.in/_payment
		// https://test.payu.in/_payment
	}

	VALET_CONFIRM(x) {
		let posUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url;
		let token = 'Bearer ' + JSON.parse(localStorage.getItem('user_details')).token;
		let httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': token }) };
		return this.http.put<any>(posUrl + '/valet/vehicles', x, httpOptions);
	}
	// VALIDATE_QR_CODE

	VALIDATE_QR_CODE(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/validate_qr', x);
	}
	CANCEL_VALET(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/cancel_valet', x);
	}

	UPDATE_VALET_STATUS(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/update_valet_status', x);
	}
	UPDATE_VALET_DELIVERY(x)
	{
		return this.http.post<any>(environment.ws_url + '/user/auth/update_valet_delivery', x);	
	}
	GET_VALET_DETAILS(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/get_valet_details', x);
	}
	GET_VALET_DETAILS_STATUS(x) {
		return this.http.post<any>(environment.ws_url + '/user/auth/get_valet_details_STATUS', x);
	}
	PAYMENT_GATEWAY_DETAILS(x)
	{
		return this.http.post<any>(environment.ws_url + '/user/auth/payment_gateway_details', x);
	}

}