import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_services/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
@Component({
  selector: 'app-live-order',
  templateUrl: './live-order.component.html',
  styleUrls: ['./live-order.component.css']
})
export class LiveOrderComponent implements OnInit {
	
	loaderStatus: boolean;
	item_list: any = []; orderTotal: number;
	confirmed_order_list: any = [];
	placed_order_list: any = [];
	fin_cost: any = 0;
	order_status:any;
	fin_cost_placed: any = 0;
	grand_total:any = 0;
	total_order_list: any = {
		bill_cost: 0,
		current_user: '',
		item_list: [],
		user_id: '',
		user_name: ''
	};
	constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, public userService: UserService, private browserService:UserBrowserService) { }

	ngOnInit() {
		this.loaderStatus=true;
		this.route.params.subscribe((params: Params) => {
			this.apiService.GET_LIVE_ORDERS_BY_ID(params['id']).subscribe(result => {

				console.log("Order......", result.order);
				this.loaderStatus=false;
				this.order_status = result.order.order_status
				this.item_list = result.order.order_list[0].item_details;
				this.grand_total = result.order.grand_total;

			})

		})

	}

}