import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../_services/api.service';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Component({
	selector: 'app-offers',
	templateUrl: './offers.component.html',
	styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

	offers_list: any = [];
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	constructor(private apiService: ApiService, private socket: Socket, private router: Router) { }

	ngOnInit() {

		// let dummy = {
		//   "vehicle_details" : {
		//     "_id" : "5e39529742d7b61bdd99bf64",
		//     "branch_id": "5befbfac2b814422a23360ab",
		//     "valet_id" : "valet_3",
		//     "serial_number" : "000004",
		//     "action": "re_request",
		//     "requested_delay": 2,
		//     "delivery_time": "Tue Feb 04 2020 16:24:26 GMT+0530 (India Standard Time)",
		//     "user_details": {
		//       "name": "user4",
		//         "contact_number": "4444",
		//       "email": "u4@email.com"
		//     }
		//   }
		// }

		// this.socket.emit('update_valet', dummy);

		// this.apiService.GET_OFFERS().subscribe(result => {
		// 	console.log("offers....", result);
		// 	if (result.status) {
		// 		this.offers_list = result.offers;
		// 	}
		// })
	}
	offerDetail(x, y, z) {
		console.log("x......................", x)
		console.log("y......................", y)
		console.log("z......................", z)
		let data = {};
		localStorage.setItem('selected_section_name', x);
		localStorage.setItem('selected_tag_name', y);
		let t = this.restaurant_details.menu_category.filter((j) => {
			if (j._id === z) {
				//j.popup = true;
				data = j;
			}
		});

		let category = data;
		console.log("data......................", data)
		localStorage.setItem('selected_category', JSON.stringify(category));
		this.router.navigate(['/menu/items'])

		//{"imageUrl":"","status":"active","_id":"606170f03b03bd2afde8653b","name":"Say Cheers All Day | 2+1 on Select Premium Brands","associated_menu_sections":[],"associated_dept_sections":[{"selected":false,"_id":"602efd44c4516905817b4582","menu_sections":[{"selected":false,"_id":"606710ed8d7dcb1cfabb2859","header":"Uru Specials","name":"Uru Specials","section_order":1},{"selected":false,"_id":"606711128d7dcb1cfabb2861","header":"Uru Food","name":"Uru Food","section_order":2},{"selected":false,"_id":"6067113d8d7dcb1cfabb2869","header":"Black Olive Pizzeria","name":"Black Olive Pizzeria","section_order":3},{"selected":false,"_id":"606711598d7dcb1cfabb286e","header":"Under the Ficus | Breakfast & More","name":"Under the Ficus | Breakfast & More","section_order":4}],"header":"Order Food","name":"Order Food"},{"selected":true,"_id":"602efd4fc4516905817b4587","menu_sections":[{"selected":true,"_id":"6067117e8d7dcb1cfabb2873","header":"Uru Specials & Offers","name":"Uru Specials & Offers","section_order":1},{"selected":false,"_id":"606711998d7dcb1cfabb287f","header":"Cocktails & Shooters","name":"Cocktails & Shooters","section_order":2},{"selected":false,"_id":"606711ad8d7dcb1cfabb2884","header":"Straight Pours","name":"Straight Pours","section_order":3},{"selected":false,"_id":"606711d48d7dcb1cfabb2889","header":"Wines & Liqueurs","name":"Wines & Liqueurs","section_order":4},{"selected":false,"_id":"606711e58d7dcb1cfabb288e","header":"Gin Garden","name":"Gin Garden","section_order":5},{"selected":false,"_id":"606711f78d7dcb1cfabb2893","header":"Uru Brews","name":"Uru Brews","section_order":6},{"selected":false,"_id":"606712118d7dcb1cfabb2898","header":"Non Alcoholic Beverages","name":"Non Alcoholic Beverages","section_order":7}],"header":"Order Beverages","name":"Order Beverages"},{"selected":false,"_id":"6063715e3b03bd2afdea1298","menu_sections":[{"selected":false,"_id":"606713e58d7dcb1cfabd36f1","header":"Hot Beverages","name":"Hot Beverages","section_order":1},{"selected":false,"_id":"606713f38d7dcb1cfabd36f6","header":"Cold Beverages","name":"Cold Beverages","section_order":2}],"header":"Order Mannheim Coffee","name":"Order Mannheim Coffee"},{"selected":false,"_id":"6063f11e3b03bd2afdea21e2","menu_sections":[{"selected":false,"_id":"6067140e8d7dcb1cfabd36fb","header":"Celebration Cakes","name":"Celebration Cakes","section_order":1},{"selected":false,"_id":"6067141c8d7dcb1cfabd3700","header":"Celebration Packages","name":"Celebration Packages","section_order":2}],"header":"Celebrations at Uru","name":"Celebrations at Uru"},{"selected":false,"_id":"6063f13c3b03bd2afdea21ea","menu_sections":[{"selected":false,"_id":"606714428d7dcb1cfabd370a","header":"Coming Soon","name":"Coming Soon","section_order":1}],"header":"Work from Uru","name":"Work from Uru"},{"selected":false,"_id":"6063f14b3b03bd2afdea21ef","menu_sections":[{"selected":false,"_id":"606714328d7dcb1cfabd3705","header":"Coming Soon","name":"Coming Soon","section_order":1}],"header":"Uru Events","name":"Uru Events"}],"rank":57,"item_count":8,"popup":false}
	}

}
