import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from './../../_services/common.service';

import { detect } from 'detect-browser'
import { LoadscriptService } from 'src/app/_services/loadscript.service';







const browser = detect();


@Component({
	selector: 'app-valet',
	templateUrl: './valet.component.html',
	styleUrls: ['./valet.component.css']
})
export class ValetComponent implements OnInit {

	browser_name: string;

	constructor(private router: Router, private commonService: CommonService, private loadScript: LoadscriptService) { }

	ngOnInit() {
		// handle the case where we don't detect the browser
		if (browser) {
			this.browser_name = browser.name;
			// console.log(browser.name);
			// console.log(navigator.userAgent);
			// console.log(browser.version);
			// console.log(browser.os);
		}

		// console.log(localStorage.getItem('user_details'));
		if (JSON.parse(localStorage.getItem('user_details'))) {
			console.log('yes...');
			this.router.navigate(['/home']);
		}
		else {
			let iOS = ["iPad", "iPhone", "iPod", "iPod touch"].indexOf(navigator.platform) >= 0;
			// console.log(navigator.userAgent);
			if (iOS) {
				this.loadScript.load('grid', 'version', 'detector', 'formatinf', 'errorlevel', 'bitmat', 'datablock', 'bmparser', 'datamask', 'rsdecoder', 'gf256poly', 'gf256', 'decoder', 'qrcode', 'findpat', 'alignpat', 'databr').then(data => {
					console.log('instamojo reference added....');
				}).catch(error => console.log('err...', error));

				let version = this.commonService.iOSversion();
				if (version[0] < 11) {
					this.router.navigate(['/ios']);
				}
				else {
					if (this.browser_name == 'chrome') {
						this.router.navigate(['/ios']);
					} else {
						this.router.navigate(['/valet-android']);
					}
				};
			}
			else {
				this.router.navigate(['/valet-android']);
			}
		}
	}

}
