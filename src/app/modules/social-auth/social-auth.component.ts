import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../_services/api.service';

@Component({
	selector: 'app-social-auth',
	templateUrl: './social-auth.component.html',
	styleUrls: ['./social-auth.component.css']
})
export class SocialAuthComponent implements OnInit {

	google_api_code: any;
	google_api_scope: any;

	constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService) { }

	ngOnInit() {
		this.route.queryParams.subscribe((params: Params) => {
			this.google_api_code = params['code'];
			this.google_api_scope = params['scope'];

			let oAuth = {
				"_events": {},
				"_eventsCount": 0,
				"transporter": {},
				"credentials": {},
				"certificateCache": {},
				"certificateExpiry": null,
				"certificateCacheFormat": "PEM",
				"refreshTokenPromises": {},
				"_clientId": "94459536193-f5inpoca49ka15f2fnl3df77u2ki45ms.apps.googleusercontent.com",
				"_clientSecret": "41hfLZy2gp3AdkqKRPbWwPlf",
				"redirectUri": "http://localhost:4200/social/authentication",
				"eagerRefreshThresholdMillis": 300000
			}

			// googleoAuthValidation
			this.apiService.GET_GOOGLE_ACCESS_TOKEN({ code: this.google_api_code, oAuth: oAuth }).subscribe(result => {
				console.log("result.....", result);
				// window.close();
			})

		});
	}

}
