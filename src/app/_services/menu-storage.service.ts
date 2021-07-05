import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class MenuStorageService {

	constructor() { }

	// CART
	ADD_ITEM_TO_CART(category, menuItem, addonDetails) {
		let cartList = JSON.parse(localStorage.getItem('cart'));
		if (!cartList) { cartList = []; }
		let itemInCart = false;

		for (let i = 0; i < cartList.length; i++) {

			var objectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
				s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
			let id = objectId()
			console.log("Add Object Id...............", id);

			// var number = Math.random() // 0.9394456857981651
			// number.toString(36); // '0.xtis06h6'
			// var id = number.toString(36).substr(2, 9); // 'xtis06h6'

			cartList[i]._id = id;

			if (menuItem._id == cartList[i].item_id) {
				itemInCart = true;
				cartList[i].quantity = cartList[i].quantity + 1;
				localStorage.setItem('cart', JSON.stringify(cartList));
			}
		}

		if (!itemInCart) {
			this.ADD_NEW_ITEM_TO_CART(category, menuItem, addonDetails);
		}
	}

	ADD_NEW_ITEM_TO_CART(category, menuItem, addonDetails): Promise<any> {
		// console.log("category...", category);


		return new Promise((resolve, reject) => {
			let cartList = JSON.parse(localStorage.getItem('cart'));
			console.log("Inside add new item")

			if (!cartList) { console.log("qwerty"); cartList = []; }

			let submitForm: any = {};

			var objectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
				s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
			let id = objectId()
			console.log("Add Object Id...............", id);
			// var number = Math.random() // 0.9394456857981651
			// number.toString(36); // '0.xtis06h6'
			// var id = number.toString(36).substr(2, 9); // 'xtis06h6'



			submitForm.cart_id = id;
			submitForm.category_id = category._id;
			// submitForm.category_name = category.name;
			submitForm.item_id = menuItem._id;
			submitForm.name = menuItem.name;
			submitForm.food_type = menuItem.food_type;
			submitForm.selling_price = menuItem.selling_price;
			submitForm.tax_rates = menuItem.tax_rates;
			submitForm.sold_price = menuItem.sold_price;
			submitForm.assigned_printers = menuItem.assigned_printers;
			submitForm.quantity = 1;
			if (addonDetails) {
				submitForm.applied_addons = addonDetails.addons;
				submitForm.requests = addonDetails.special_request;
			}

			cartList.push(submitForm);
			localStorage.setItem('cart', JSON.stringify(cartList));
			console.log(".......", cartList)
			resolve(cartList);
		});

	}

	UPDATE_ITEM_IN_CART(category, menuItem, addonDetails): Promise<any> {

		return new Promise((resolve, reject) => {

			let cartList = JSON.parse(localStorage.getItem('cart'));

			cartList.filter(ss => ss.cart_id == menuItem.cart_id).map(
				dd => {

					// var number = Math.random() // 0.9394456857981651
					// number.toString(36); // '0.xtis06h6'
					// var id = number.toString(36).substr(2, 9); // 'xtis06h6'

					var objectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
						s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
					let id = objectId()
					console.log("Add Object Id...............", id);

					dd.cart_id = id;
					dd.category_id = menuItem.category_id;
					// submitForm.category_name = category.name;
					dd.item_id = menuItem._id;
					dd.name = menuItem.name;
					dd.food_type = menuItem.food_type;
					dd.selling_price = menuItem.selling_price;
					dd.sold_price = menuItem.sold_price;
					dd.quantity = menuItem.ordered_qty;
					if (addonDetails) {
						dd.applied_addons = addonDetails.addons;
						dd.requests = addonDetails.special_request;
					}
				}
			)

			localStorage.setItem('cart', JSON.stringify(cartList));

			resolve(cartList);

		});

	}

	REPEAT_ITEM_IN_CART(cartId) {
		let cartList = JSON.parse(localStorage.getItem('cart'));

		if (!cartList) { cartList = []; }

		if (cartList.length) {
			cartList.reverse();
			for (let i = 0; i < cartList.length; i++) {

				if (cartId == cartList[i].cart_id) {
					console.log("cartId..................", cartId)
					cartList[i].quantity = cartList[i].quantity + 1;

				}
			}
			localStorage.setItem('cart', JSON.stringify(cartList.reverse()));
		}
	}

	REPEAT_ITEM_IN_CART_ITEMID(itemId) {
		let cartList = JSON.parse(localStorage.getItem('cart'));
		if (!cartList) { cartList = []; }
		//console.log("cartList.length-------------------", cartList.length)
		if (cartList.length) {
			cartList.reverse();
			for (let i = 0; i < cartList.length; i++) {
				if (itemId == cartList[i].item_id) {
					console.log("cart list..........", cartList[i])
					console.log("cart quantity before -------------------", cartList[i].quantity)
					cartList[i].quantity = cartList[i].quantity + 1;
					console.log("cart quantity -------------------", cartList[i].quantity)

				}
			}
			localStorage.setItem('cart', JSON.stringify(cartList.reverse()));
		}
	}



	REMOVE_ITEM_FROM_CART(itemId) {
		let cartList = JSON.parse(localStorage.getItem('cart'));
		if (!cartList) { cartList = []; }

		if (cartList.length) {
			cartList.reverse();
			for (let i = 0; i < cartList.length; i++) {
				// var number = Math.random() // 0.9394456857981651
				// number.toString(36); // '0.xtis06h6'
				// var id = number.toString(36).substr(2, 9); // 'xtis06h6'
				var objectId = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) =>
					s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
				let id = objectId()
				console.log("Add Object Id...............", id);

				cartList[i]._id = id;

				if (itemId == cartList[i].item_id) {
					if (cartList[i].quantity > 1)
						cartList[i].quantity = cartList[i].quantity - 1;
					else
						cartList.splice(i, 1);
					break;
				}
			}
			localStorage.setItem('cart', JSON.stringify(cartList.reverse()));
		}
	}

}
