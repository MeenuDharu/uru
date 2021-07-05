import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuStorageService } from '../../../_services/menu-storage.service';

@Component({
	selector: 'app-item-customization',
	templateUrl: './item-customization.component.html',
	styleUrls: ['./item-customization.component.css']
})
export class ItemCustomizationComponent implements OnInit {

	item: any = {}
	addonList: any;
	special_request: string;
	cart: any;
	constructor(private router: Router, private menuStorageService: MenuStorageService) { }

	ngOnInit() {
		// menu item
		this.item = JSON.parse(localStorage.getItem('selected_item'));

		this.item.sold_price = this.item.selling_price;
		this.addonList = [];
		let addons = this.item.addons;
		for (let i = 0; i < addons.length; i++) {
			if (addons[i].type == 'either_or')
				this.onSelectOption(addons[i], addons[i].options[0]);
		}
	}

	onSelectOption(optionHeading, selectedOption) {
		let existStatus = false;
		if (optionHeading.type == 'either_or') {
			for (let i = 0; i < this.addonList.length; i++) {
				if (optionHeading._id == this.addonList[i].heading_id) {
					this.addonList.splice(i, 1);
				}
			}
		}
		else if (optionHeading.type == 'multiple') {
			for (let i = 0; i < this.addonList.length; i++) {
				if (selectedOption._id == this.addonList[i]._id) {
					this.addonList.splice(i, 1);
					existStatus = true;
				}
			}
		}

		if (!existStatus) {
			selectedOption.heading_id = optionHeading._id;
			selectedOption.heading = optionHeading.heading;
			this.addonList.push(selectedOption);
		}

		//sum
		this.item.sold_price = parseInt(this.item.selling_price);
		for (let i = 0; i < this.addonList.length; i++) {
			this.item.sold_price = this.item.sold_price + parseInt(this.addonList[i].price);
		}
	}

	onConfirm() {
		let category = JSON.parse(localStorage.getItem('selected_category'));
		let selectedItem = JSON.parse(localStorage.getItem('selected_item'));
		// CART
		let addonDetails = { addons: this.addonList, special_request: this.special_request };
		selectedItem.sold_price = this.item.sold_price;
		this.menuStorageService.ADD_NEW_ITEM_TO_CART(category, selectedItem, addonDetails);

		this.router.navigate(['/menu/items']);
	}

}
