
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../_services/common.service';
import { ApiService } from '../../../_services/api.service';
import { environment } from '../../../../environments/environment';
import { Location } from '@angular/common'; // <--- Here
import { UserService } from 'src/app/_services/user.service';
import { Socket } from 'ngx-socket-io';
import { UserBrowserService } from 'src/app/_services/user-browser.service';


@Component({
	selector: 'app-valet-qr',
	templateUrl: './valet-qr.component.html',
	styleUrls: ['./valet-qr.component.css']
})
export class ValetQrComponent implements OnInit {
	valet_details: any;
	@ViewChild('openModal', { static: true }) openModal: ElementRef;
	constructor(private http: HttpClient, private location: Location, private router: Router, private socket: Socket, private route: ActivatedRoute, private apiService: ApiService, private commonService: CommonService, public userService: UserService,public browserService:UserBrowserService) { }

	ngOnInit() {
		this.route.params.subscribe((params: Params) => {
			// check access code
			// if(localStorage.getItem("access_code")) {
			//   if(localStorage.getItem("access_code")!=params['code']) {
			//     localStorage.clear();
			//     sessionStorage.clear();
			//   }
			// }
			// device details
			this.commonService.DEVICE_DETAILS();
			this.userService.restuarant_taxes = "";
			let user_details = JSON.parse(localStorage.getItem('user_details'));
			console.log("valet user_details.....................", user_details)
			let resultString = params['code'];
			let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));	
			let qr = { qr: resultString, userDetails: user_details, access_code:localStorage.getItem("access_code"), pos_branch_id:restaurant_details.branch_id };
			console.log("valet qr...........", qr)
			this.apiService.VALIDATE_QR_CODE(qr).subscribe(result => {
				console.log('result........................', result);
				if (result.status) {
					let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
					//if (result.data.branch_id == restaurant_details.branch_id) {
						// let openValetModal: HTMLElement = this.openValetOpenModal.nativeElement as HTMLElement;
						// openValetModal.click();   
						this.valet_details = result.data;
						this.commonService.valet_details = result.data; 
						localStorage.setItem("valet_access",this.commonService.valet_details._id)
						console.log("valet detail ID ....", this.commonService.valet_details._id)
						console.log("branch id --------", restaurant_details.branch_id)


					//}


					this.router.navigate(['/valet/status']);




				}
				else {
					console.log('response', result);
					let openModal: HTMLElement = this.openModal.nativeElement as HTMLElement;
					openModal.click();
				}
			});





		});
	}

	closeModal(modalName) {
		modalName.hide();
		this.router.navigate(['/']);
	}
}
