import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../_services/api.service';
import { LoadscriptService } from 'src/app/_services/loadscript.service';
import {DeviceDetectorService} from 'ngx-device-detector';
@Component({
	selector: 'app-pwd-recovery',
	templateUrl: './pwd-recovery.component.html',
	styleUrls: ['./pwd-recovery.component.css']
})
export class PwdRecoveryComponent implements OnInit {

	pwdForm: any = {}; loaderStatus: boolean; cp_hide: boolean;
	p_hide: boolean; recoveryStatus: boolean; responseData: string;
	showLengthValidationMsg: boolean;
	deviceData:any;
	isChrome:boolean = false;
	constructor(private activeRoute: ActivatedRoute, private router: Router, private apiService: ApiService,
		private ldScript: LoadscriptService,private deviceService: DeviceDetectorService) { }

	ngOnInit() {
		this.deviceData = this.deviceService.getDeviceInfo();
		if(this.deviceData.browser === 'Chrome')
		{
			this.isChrome = true;
		}
		else
		{
			this.isChrome = false;
		}

		this.ldScript.load('font-awesome', 'material-icons').then(data => {
			console.log('font awesome reference added....');
		}).catch(error => console.log('err...', error));

		this.showLengthValidationMsg = false;
		this.activeRoute.params.subscribe((params: Params) => {
			this.p_hide = true;
			this.cp_hide = true;
			this.loaderStatus = true;
			this.recoveryStatus = false;
			if (params.token && params.token != '') {
				this.apiService.VALIDATE_FORGOT_REQUEST({ temp_token: params.token }).subscribe(result => {
					this.loaderStatus = false;
					this.recoveryStatus = result.status;
					this.responseData = result.message;
				});
			}
			else {
				this.recoveryStatus = false;
				this.responseData = "Invalid Recovery Link";
			}
		});
	}

	onPwdUpdate(modalName) {
		let pwd_length = this.pwdForm.password.length;
		let c_pwd_length = this.pwdForm.confirm_password.length;
		console.log(pwd_length);
		console.log(c_pwd_length);

		if (pwd_length >= 6) {
			this.activeRoute.params.subscribe((params: Params) => {
				if (params.token && params.token != '') {
					this.pwdForm.submit = true;
					this.apiService.UPDATE_PWD({ temp_token: params.token, password: this.pwdForm.password }).subscribe(result => {
						this.pwdForm.submit = false;
						this.recoveryStatus = result.status;
						this.responseData = result.message;
						if (result.status) modalName.show();
						else console.log("response", result);
					});
				}
				else {
					this.recoveryStatus = false;
					this.responseData = "Invalid Recovery Link";
				}
			});
		} else {
			//this.pwdForm.error_msg = "password length should be greater than 6."
			this.showLengthValidationMsg = true;
		}

	}

	closeModal(modalName) {
		modalName.hide();
		window.close();
	}

}
