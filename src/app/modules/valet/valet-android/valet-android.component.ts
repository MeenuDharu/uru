import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '../../../modules/zxing-scanner/zxing-scanner.module';
// import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { ApiService } from 'src/app/_services/api.service';
import { CommonService } from 'src/app/_services/common.service';
import { LoadscriptService } from 'src/app/_services/loadscript.service';

@Component({
	selector: 'app-valet-android',
	templateUrl: './valet-android.component.html',
	styleUrls: ['./valet-android.component.css']
})
export class ValetAndroidComponent implements OnInit {

	@ViewChild('openModal', { static: true }) openModal: ElementRef;
	@ViewChild('openValetOpenModal', { static: true }) openValetOpenModal: ElementRef;
	@ViewChild('closeValett', { static: true }) closeValett: ElementRef;
	@ViewChild('scanner', { static: true })
	scanner: ZXingScannerComponent;
	hasDevices: boolean;
	hasPermission: boolean;
	qrResult: Result;
	availableDevices: MediaDeviceInfo[];
	currentDevice: MediaDeviceInfo = null;
	resultString: any;
	delayTime: any = "5";
	valet_details: any;
	confirm_click: boolean = true;
	showFetchingDetails: boolean = false;
	loaderStatus:boolean = false;
	constructor(private router: Router, private socket: Socket, private apiService: ApiService, public commonService: CommonService, private loadScript: LoadscriptService) { }

	ngOnInit() {
		this.loaderStatus = false;
		this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
			console.log("MediaDeviceInfo Valet");
			// console.log(MediaDeviceInfo);
			this.availableDevices = devices;
			// selects the devices's back camera by default
			for (const device of devices) {
				if (/back|rear|environment/gi.test(device.label)) {
					this.scanner.changeDevice(device);
					this.currentDevice = device;
					break;
				}
			}
		});

		this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => this.availableDevices = devices);
		this.scanner.hasDevices.subscribe((has: boolean) => this.hasDevices = has);
		this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);
		this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);


		this.loadScript.load('material-icons').then(data => {
			console.log('font awesome reference added....');
		}).catch(error => console.log('err...', error));
	}

	handleQrCodeResult(resultString: string) {
	    console.log('valet result string........................', resultString);
		this.showFetchingDetails = true;
		this.loaderStatus = true;
		let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));	
		let user_details = JSON.parse(localStorage.getItem('user_details'));
		let qr = { qr: resultString, userDetails: user_details, access_code:localStorage.getItem("access_code"), pos_branch_id:restaurant_details.branch_id };

		this.apiService.VALIDATE_QR_CODE(qr).subscribe(result => {
			console.log('result....', result);
			if (result.status) {
				this.showFetchingDetails = false;
						
					//this.router.navigate(['/valet/status']);
					// let openValetModal: HTMLElement = this.openValetOpenModal.nativeElement as HTMLElement;
					// openValetModal.click();   
					this.valet_details = result.data;
					this.commonService.valet_details = result.data;
					localStorage.setItem("valet_access",this.commonService.valet_details._id)
					this.router.navigate(['/valet/status']);			

			}
			else {
				this.loaderStatus = false;
				let openModal: HTMLElement = this.openModal.nativeElement as HTMLElement;
				openModal.click();

			}
		});

	}

	openPop(valetOpenModal) {
		let user_details = JSON.parse(localStorage.getItem('user_details'));
		let qr = { qr: '123456', userDetails: user_details };
		this.apiService.VALIDATE_QR_CODE(qr).subscribe(result => {
			console.log('result....', result);
			if (result.status) {
				this.valet_details = result.data;
				this.commonService.valet_details = result.data;

				let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
				this.resultString = result.data.serial_number;
				let data = {
					"vehicle_details": {
						"branch_id": restaurant_details.branch_id,
						"valet_id": this.commonService.valet_details._id,
						"serial_number": this.resultString
					}
				}


				this.commonService.valetStatus = 'awaiting';

				localStorage.setItem('valet_status', this.commonService.valetStatus);
				console.log("join_valet valet android............")
				this.socket.emit("join_valet", data);
				let openValetModal: HTMLElement = this.openValetOpenModal.nativeElement as HTMLElement;
				openValetModal.click();
			} else {
				let openModal: HTMLElement = this.openModal.nativeElement as HTMLElement;
				openModal.click();
			}
		})

	}

	cancelValet() {
		// console.log('reset DB...', this.valet_details);
		this.confirm_click = true;
		if (this.valet_details) {
			this.apiService.CANCEL_VALET({ _id: this.valet_details._id }).subscribe(result => {
				console.log('result....', result);
				this.valet_details = undefined;
				this.commonService.valet_details = undefined;
			})
		}

	}

	closeValet() {
		// console.log('result string...');
		this.confirm_click = true;
		let closeValett: HTMLElement = this.closeValett.nativeElement as HTMLElement;
		closeValett.click();
	}

	onConfirm() {
		this.confirm_click = false;
		let restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
		let user_details = JSON.parse(localStorage.getItem('user_details'));

		this.commonService.valetStatus = 'awaiting';

		localStorage.setItem('valet_status', this.commonService.valetStatus);

		let data = {
			"vehicle_details": {
				"branch_id": restaurant_details.branch_id,
				"valet_id": this.commonService.valet_details._id,
				"serial_number": this.resultString,
				"requested_delay": Number(this.delayTime),
				// "delivery_time": "Thu Feb 06 2020 14:19:27 GMT+0530 (India Standard Time)",
				"delivery_time": Date.now(),
				"user_details": {
					"name": user_details.name,
					"contact_number": user_details.mobile,
					"email": user_details.email
				}
			}
		}

		this.apiService.VALET_CONFIRM(data).subscribe(result => {
			// console.log('result....', result);
			if (result.status) {
				localStorage.setItem('valet_details', JSON.stringify(result.data));
				this.router.navigate(['/valet/status']);

				this.apiService.UPDATE_VALET_STATUS({ valet_id: this.commonService.valet_details._id, valet_status: 'awaiting' }).subscribe(result => {
					console.log('result.....', result);
				})
			}
		});

	}
	radioChange(event) {
		// console.log('delay time....', event);
	}

	setPlusFive() {
		let d = this.plusDate(new Date(), 5);
		let c = this.setDelivery(d);
		return c;
	}
	setPlusTen() {
		let d = this.plusDate(new Date(), 10);
		let c = this.setDelivery(d);
		return c;
	}
	setPlusFifteen() {
		let d = this.plusDate(new Date(), 15);
		let c = this.setDelivery(d);
		return c;
	}
	setPlusTwenty() {
		let d = this.plusDate(new Date(), 20);
		let c = this.setDelivery(d);
		return c;
	}

	setDelivery(date) {
		let d = date;
		let hours = d.getHours();
		let minutes = d.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		let hrs = hours % 12;
		let a = hrs ? hrs : 12; // the hour '0' should be '12'
		let mins = minutes < 10 ? '0' + minutes : String(minutes);
		var strTime = a + ':' + mins + ' ' + ampm;
		return strTime;

	}

	plusDate(dt, minutes) {
		return new Date(dt.getTime() + minutes * 60000);
	}

}
