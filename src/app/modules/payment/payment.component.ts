import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../_services/api.service';
import { UserService } from '../../_services/user.service';
import { SnackbarService } from '../../_services/snackbar.service';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
declare var Instamojo: any;

@Component({
	selector: 'app-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

	payment: any;
	loaderStatus: boolean;

	constructor(private activeRoute: ActivatedRoute, private apiService: ApiService, private userService: UserService, public snackBar: SnackbarService, private router: Router,private browserService:UserBrowserService) { }

	ngOnInit() {

		this.loaderStatus = true;
		let userDetails = JSON.parse(localStorage.getItem("user_details"));
		//this.razorpayOptions.prefill = { "name": userDetails.name, "email": userDetails.email, "contact": userDetails.mobile };
		this.activeRoute.queryParams.subscribe((params: Params) => {
			console.log("payment params....", params);
			let sendData = {
				id: params.payment_id
				};

			console.log("Data......", sendData);

			this.apiService.GET_PAYMENT(sendData).subscribe(result => {
				console.log("Get Payment Details................", result)
				if(result.status)
				{

					if (result.data.payment_status == "success") {
						
						let ord_type = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
						// if (ord_type == 'in_house') {
						// 	//need to update the bills
						// //	console.log('table payment successfull....');
						// 	//Instamojo.close();
						// 	this.router.navigate(['/bill/confirm']);
						// } 
						//else {

						
							
								let type_id;
								let order_type;
								if(ord_type === 'in_house')
								{
								type_id = JSON.parse(localStorage.getItem('restaurant_details')).order_type.table_id;
								order_type =ord_type
								}
								else
								{
									type_id = localStorage.getItem("pos_order_id");
									order_type =ord_type
								}
						
								if (ord_type == 'in_house') {
								//	this.router.navigate(['/bill/confirm']);
	
								//console.log("method of payment...................",this.payment)
								let sendData = {								
									"bill_details": {
										'bill_id': result.data.bill_id, 
										'status': 'paid', 
										'tender_type': result.data.payment_details.method
									},
									order_type: order_type,
									type_id : type_id		
								}
								
								console.log("payment Send Data", sendData)
								
								this.apiService.SAVE_PAYMENT_DETAILS(sendData).subscribe(result => {
									console.log("SAVE_PAYMENT_DETAILS .....", result);
									if(result.status)
									{
										this.router.navigate(['/bill/confirm']);
									}
								})

	
								}
								else
								{
									let orderData = {
										"user_id": JSON.parse(localStorage.getItem('user_details')).user_id,
										"order_details": {
											"order_type": JSON.parse(localStorage.getItem('restaurant_details')).order_type,
											"item_details": JSON.parse(localStorage.getItem('cart')),
											"order_id": result.data.payment_request_id
										},
										"payment_details": result.data.payment_details,
										"user_name": JSON.parse(localStorage.getItem('user_details')).dinamic_user_name
		
									};
									console.log("order data take away ..........", orderData)
									console.log("order_id...................", params.order_id)
									
									this.apiService.CONFIRM_ORDER(orderData).subscribe(result => {
										console.log("payment result...................", result)
									if (result.status) {
										this.snackBar.OPEN('Your order has been placed.', 'Close');
										localStorage.setItem('order_status', 'raised');
										if (orderData.order_details.order_type == 'in_house') {
											this.router.navigate(['/bill/confirm']);
										} else {
											localStorage.setItem('payment_status', 'paid');
										}
	
										localStorage.removeItem('cart');
										// this.router.navigate(['/home']);
										//Instamojo.close();
	
										this.router.navigate(['/myorder']);
									}
									else {
										console.log('response', result);
									}
								});
	
								}
							//  JSON.stringify(this.payment);

						//}
					} else {
						let ord_type = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
			
							let payment_det = {
								user_id: JSON.parse(localStorage.getItem('user_details')).user_id,
								order_id: result.data.order_id,
								//payment_request_id: sendData.payment_request_id,
								payment_status: 'failure',
								payment_details: result.data.payment_details
							}

							this.apiService.SAVE_PAYMENT(payment_det).subscribe(result => {
								console.log("payment response.....", result);
							})
							if (ord_type == 'in_house') {
								this.router.navigate(['/bill/confirm']);	
							}
							else
							{
								this.router.navigate(['/cart/list']);
							}

							
						//}
					}
				

				}
			})
				
					//console.log("payment details.................",this.payment)
				
		});
	}

}
