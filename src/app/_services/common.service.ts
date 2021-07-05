import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	valetStatus: any;
	timerConfig: any;
	deliveryTime: any;
	valet_details: any;
	scroll_x_pos:number;
	scroll_y_pos:any;
	screen_height:number;
	screen_width:number

	constructor() { }

	DEVICE_DETAILS() {
		let iOS = ["iPad", "iPhone", "iPod", "iPod touch"].indexOf(navigator.platform) >= 0;
		
		if (iOS) {
			localStorage.setItem('device_type', 'ios');
			localStorage.setItem('ios_device', 'true');
			let version = this.iOSversion();
			if (version[0] < 11) localStorage.setItem('application_type', 'ios');
			else localStorage.setItem('application_type', 'android');
		}
		else {
			localStorage.setItem('device_type', 'windows');
			localStorage.setItem('application_type', 'android');
		}
	}

	iOSversion() {
		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			let v: any = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		}
	}

}
