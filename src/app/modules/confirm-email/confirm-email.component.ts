import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../_services/api.service';

@Component({
	selector: 'app-confirm-email',
	templateUrl: './confirm-email.component.html',
	styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

	constructor(private activeRoute: ActivatedRoute, private router: Router, private apiService: ApiService) { }

	ngOnInit() {
		this.activeRoute.params.subscribe((params: Params) => {
			console.log("params...", params);

			this.apiService.USER_EMAIL_CONFIRMED({ userId: params.id }).subscribe(result => {
				console.log("user email confirmed...", result);
			})
		});
	}

}
