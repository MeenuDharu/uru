import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Result } from '@zxing/library';
import { Router } from '@angular/router';
import { ZXingScannerComponent } from '../../../modules/zxing-scanner/zxing-scanner.module';
import { Socket } from 'ngx-socket-io';
// import { ZXingScannerComponent } from '../../zxing-scanner/zxing-scanner.component';

// import { detect } from 'detect-browser'
// const browser = detect();
import { DeviceDetectorService } from 'ngx-device-detector';
import { UserService } from 'src/app/_services/user.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-android',
	templateUrl: './android.component.html',
	styleUrls: ['./android.component.css']
})
export class AndroidComponent implements OnInit {
	@ViewChild('openModal1', { static: true }) openModal1: ElementRef;
	@ViewChild('scanner', { static: true })
	scanner: ZXingScannerComponent;
	scannerEnabled: boolean;
	hasDevices: boolean;
	hasPermission: boolean;
	qrResult: Result;
	availableDevices: MediaDeviceInfo[];
	currentDevice: MediaDeviceInfo = null;
	browser_name: string;
	deviceInfo = null;
	enable: boolean = false;
	errmsg: any;
	constructor(private router: Router, private deviceService: DeviceDetectorService, private socket: Socket, public userService: UserService, private cookieService: CookieService) { }

	ngOnInit() {
		//  console.log("errmsg",localStorage.getItem('errmsg'))
		if (localStorage.getItem('errmsg')) {
			console.log("errmsg", localStorage.getItem('errmsg'))
			let openModal1: HTMLElement = this.openModal1.nativeElement as HTMLElement;
			openModal1.click();
			this.errmsg = localStorage.getItem('errmsg');
		}

		if (JSON.parse(localStorage.getItem('restaurant_details'))) {
			this.userService.restaurant_gst = JSON.parse(localStorage.getItem('restaurant_details')).gst;
			this.userService.restuarant_taxes = JSON.parse(localStorage.getItem('restaurant_details')).restaurant_tax;
		}

		if (JSON.parse(localStorage.getItem('user_details'))) {
			console.log('yes...');			
			this.router.navigate(['/home']);

		} else {
			localStorage.clear();
			sessionStorage.clear();
			//this.socket.disconnect();
			this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');

			this.deviceInfo = this.deviceService.getDeviceInfo();
			this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
				console.log("MediaDeviceInfo android");
				this.scannerEnabled = true;
				this.hasDevices = true;

				this.availableDevices = devices;
				console.log(this.availableDevices);
				for (const device of devices) {
					if (/back|rear|environment/gi.test(device.label)) {
						// this.scanner.torch = true;
						this.scanner.changeDevice(device);
						this.currentDevice = device;
						break;
					}
				}


			});

			this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => this.availableDevices = devices);
			this.scanner.hasDevices.subscribe((has: boolean) => {
				console.log("has..................", has)
				this.hasDevices = has;

			});
			this.scanner.scanComplete.subscribe((result: Result) => {
				this.qrResult = result;
				this.hasDevices = false;
				this.scannerEnabled = false;
			});
			this.scanner.permissionResponse.subscribe((perm: boolean) => this.hasPermission = perm);
		}

	}

	handleQrCodeResult(resultString: string) {
		let res = resultString.split("#");
		if (res[1] && res[1] != '') this.router.navigate([res[1]]);
		else document.getElementById("openModal").click();
	}

}