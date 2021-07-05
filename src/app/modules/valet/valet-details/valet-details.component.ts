import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../../_services/api.service';

@Component({
	selector: 'app-valet-details',
	templateUrl: './valet-details.component.html',
	styleUrls: ['./valet-details.component.css']
})
export class ValetDetailsComponent implements OnInit {

	time: string = "5";
	serial_number: string;
	constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

	ngOnInit() {
		this.route.params.subscribe((params: Params) => {
			console.log('params.....', params);
			this.serial_number = "158655";
			// let sendData = {
			//   token_id: params['id'],
			//   dinamic_details: JSON.parse(localStorage.getItem('dinamic_details'))
			// };
			// this.apiService.VALET_DETAILS(sendData).subscribe(result => {
			//   if(result.status) {
			//     localStorage.setItem('valet_details', JSON.stringify(result.valet_details));
			//     this.serial_number = result.valet_details.serial_number;
			//   }
			//   else {
			//     console.log('response', result);
			//   }
			// });
		});
	}

	onRequest() {
		console.log('time', this.time);
		this.router.navigate(['/valet/status']);
		// let sendData = {
		//   owner_name: JSON.parse(localStorage.getItem('user_details')).name,
		//   owner_email: JSON.parse(localStorage.getItem('user_details')).email,
		//   car_ready_on: this.time
		// };
		// this.apiService.VALET_REQUEST(sendData).subscribe(result => {
		//   if(result.status) {
		//     localStorage.setItem('valet_status', 'waiting');
		//     this.router.navigate(['/valet/status']);
		//   }
		//   else {
		//     console.log('response', result);
		//   }
		// });
	}

}