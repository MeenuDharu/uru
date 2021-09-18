import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, PLATFORM_ID, HostListener } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { UserService } from '../../../_services/user.service';
import { ApiService } from '../../../_services/api.service';
import { MenuStorageService } from '../../../_services/menu-storage.service';
import { ConstantPool } from '@angular/compiler';
import { SharedAnimations } from 'src/app/_animations/shared-animations';
import { LoadscriptService } from 'src/app/_services/loadscript.service';
import { environment } from '../../../../environments/environment';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
import { CommonService } from 'src/app/_services/common.service';
import { Location, PlatformLocation } from '@angular/common';
import * as _ from "lodash";
declare let $: any;
import * as moment from 'moment';

@Component({
	selector: 'app-items',
	templateUrl: './items.component.html',
	styleUrls: ['./items.component.css'],
	animations: [SharedAnimations]
})
export class ItemsComponent implements OnInit {
	// @ViewChild("tref", {read: ElementRef}) tref: ElementRef;
	// @ViewChild('lazyImg', { static: true, read: ElementRef }) public lazyImg: ElementRef<any>;
	// @ViewChild('lazyImg',  { static: true })
	@ViewChild('txtArea', { static: true }) txtArea: ElementRef;
	@ViewChild('lazyImg', { static: true }) lazyImg: ElementRef;
	restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	deviceStringCat: string;
	deviceStringLogo: string;
	deviceStringItem: string;

	category: any; cart: any;
	menu_items: any = [];
	no_items: boolean = false;
	no_items_message: any;
	itemRepeatFooter: boolean;
	cartItemDetails: any;
	categoryFilter; item_search = null;
	show_cust_popup: boolean;
	dayCheck: any; vegCheck;
	cartItems: Number = 0;
	cartTotal;
	item_cost_flag: Number = 0;
	item: any = {}
	addonList: any;
	special_request: string;
	//baseUrl = JSON.parse(localStorage.getItem('dinamic_details')).pos_base_url + '/';
	baseUrl = environment.img_url;
	shimmerList: any = [{}, {}, {}, {}, {}, {}, {}];
	selectedAddon: any;
	showAddToOrder: boolean = true;
	showSearch: boolean = true;
	userDetails: any;
	showViewStatus: boolean = false;

	awaitingcontent: any;
	index: any;
	deviceData: any;
	isChrome: boolean = false;
	loaderStatus: boolean = false;

	@HostListener('window:scroll', ['$event'])
	@HostListener('window:resize', ['$event'])
	getWindowDetails() {
		this.CommonService.scroll_x_pos = window.pageXOffset;
		this.CommonService.scroll_y_pos = window.pageYOffset;
		this.CommonService.screen_height = window.innerHeight;
		this.CommonService.screen_width = window.innerWidth;
		//  localStorage.setItem("scroll_y_pos", this.CommonService.scroll_y_pos)
		//console.log("height...................", this.CommonService.scroll_y_pos);
		//console.log("height...................",)
	}

	constructor(private router: Router, public userService: UserService, private apiService: ApiService, private menuStorageService: MenuStorageService,
		private renderer: Renderer2, private loadScript: LoadscriptService, public browserService: UserBrowserService, public CommonService: CommonService, location: PlatformLocation, private _location: Location,) {
		this.getWindowDetails();
		// location.onPopState(() => {
		// 	console.log("category back...............")
		// 	this.router.navigate(['/menu/categories']);
		// });		



	}



	ngOnInit() {
		this.loaderStatus = true;
		// this._location.onUrlChange( (url: string, state: unknown) => {
		// 	console.log("Location changes to "+url);
		// 	console.log("location state...",state);
		//   })
		// this._location.subscribe(x => {console.log(x); this._location.go('/home')});
		this.getWindowDetails();
		if (localStorage.getItem("scroll_y_pos")) {
			let scrollPos = Number(localStorage.getItem("scroll_y_pos"))
			setTimeout(() => { window.scrollTo({ top: scrollPos, behavior: 'smooth' }); }, 500);
		}


		if (this.browserService.isMobile()) {
			this.deviceStringCat = 'small'
			this.deviceStringLogo = 'small';
			this.deviceStringItem = 'medium'
		}
		else if (this.browserService.isTablet()) {
			this.deviceStringCat = 'medium'
			this.deviceStringLogo = 'medium';
			this.deviceStringItem = 'medium'
		}
		else if (this.browserService.isDesktop()) {
			this.deviceStringCat = 'medium';
			this.deviceStringLogo = 'medium';
			this.deviceStringItem = 'large';
		}
		this.loadScript.load('material-icons').then(data => {
			console.log('font awesome reference added....');
		}).catch(error => console.log('err...', error));

		this.item_cost_flag = 0;
		this.itemRepeatFooter = false;
		this.category = JSON.parse(localStorage.getItem('selected_category'));
		if (this.category.popup === true) {
			this.category.associated_dept_sections.filter((i) => {

				if (i.selected === true) {
					console.log("sections............", true)
					localStorage.setItem('selected_section_name', i._id);
					i.menu_sections.filter((j) => {
						if (j.selected === true) {
							localStorage.setItem('selected_tag_name', j._id);
							localStorage.setItem('selected_tag_header', j.header);
						}

					})
				}
			})
		}
		this.show_cust_popup = false;

		//items
		this.apiService.ITEM_LIST(this.category._id).subscribe(result => {
			console.log("item response...", result);
			// console.log("shimmer....", this.shimmerList);
			if (result.status) {
				console.log("response....", result);
				// result.item_list.forEach(element => {
				// 	let str = element.imageUrl
				// 	var elems = str.split("/");
				// 	elems.splice(elems.length-1, 0, this.deviceStringItem)
				// 	element.imageUrl = elems.join("/")
				// 	// if(element.is_inclusive_tax)
				// 	// {
				//     //  element.selling_price = 
				// 	// }

				// });
				let menuItem = result.item_list
				// let menuItem1 = result.item_list.filter((j) => 
				//  {
				// 	 console.log("menuj.................",j)
				// 	 if(j.addons && j.addons.length )
				// 	 {
				// 		j.addons.filter((k) => 
				// 		{
				// 		console.log("menuk.................",k)	

				// 		for (let i = 0; i < k.options.length; i++) {
				// 			if (k.hide_option && k.hide_option === true) {
				// 				 k.options.splice(i, 1);		
				// 				 return false;					
				// 			}
				// 			else
				// 			{
				// 				return true;
				// 			}
				// 		}
				// 	 })
				// 	}

				// });



				this.menu_items = menuItem;
				this.menu_items.forEach(function (item) {
					item.addons.filter(function (addon) {
						addon.options = addon.options.filter(function (option) {
							return option.hide_option != true;
						})
					})
				});
				let cart = JSON.parse(localStorage.getItem('cart'));
				if (!cart) { cart = []; }
				for (let i = 0; i < this.menu_items.length; i++) {
					this.menu_items[i].ordered_qty = this.countItemInCart(cart, menuItem[i]._id);
					// this.menu_items.push(menuItem[i]);
				}
				console.log("menu items...", this.menu_items);
				// this.shimmerList = [];
				setTimeout(() => { this.shimmerList = []; }, 300);
				this.loaderStatus = false;
			}
			else {
				this.loaderStatus = false;
				console.log('response', result);
				this.no_items = true;
				// this.no_items_message = result.message;
				this.no_items_message = 'No items found in this category';
				this.shimmerList = [];
			}
		});

		// function tConvert (time) {
		//   // Check correct time format and split into components
		//   time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

		//   if (time.length > 1) { // If time format correct
		//     time = time.slice (1);  // Remove full string match value
		//     time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
		//     time[0] = +time[0] % 12 || 12; // Adjust hours
		//   }
		//   return time.join (''); // return adjusted time or original string
		// }

		//cart
		let cartDetails = this.userService.CART_DETAILS();
		this.cartItems = cartDetails.cart_items;
		this.cartTotal = cartDetails.cart_total;

		//search
		let searchBar: any = document.querySelector('.search-bar');
		if (this.menu_items.length) {
			document.querySelector('.js-search').addEventListener("click", function (e) {
				let searchInput: any = document.querySelector(".search-input");
				searchBar.classList.add('open');
				searchInput.focus(); searchInput.value = "";
				document.querySelector('.js-search').classList.add('d-none');
			}, false);
			document.querySelector(".close-search").addEventListener("click", function (e) {
				searchBar.classList.remove('open');
				document.querySelector('.js-search').classList.remove('d-none');
			}, false);
		}
		this.item = JSON.parse(localStorage.getItem('selected_item'));
		console.log("item..............", this.item)


		// console.log(this.item)
		if (this.item !== null) {
			this.item.sold_price = this.item.selling_price;
			this.addonList = [];
			let addons = this.item.addons;
			for (let i = 0; i < addons.length; i++) {
				if (addons[i].type == 'exclusive')
					this.onSelectOption(addons[i], addons[i].options[0], i, 0);
			}
		}

		this.userDetails = JSON.parse(localStorage.getItem('user_details'));

		let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
		if (orderType == 'in_house') {
			if (this.userDetails) {




				this.apiService.PLACED_ORDERS().subscribe(result => {
					console.log("placed orders....", result);
					if (result.status) {
						if (result.orders.order_list.length) {

							// console.log("orders found....");
							this.showViewStatus = true;
							this.userService.placed_order_status = true;
							this.userService.order_number = result.orders.order_number;
							/** Awaiting  strip */
							let user_Status = result.orders.order_list.filter((i) => i.current_user === true);
							this.index = result.orders.order_list.findIndex(i => i.current_user === true); // 3

							if (this.index === 0) { this.index = 1; }
							else { this.index = 0; }
							let orderListLength = result.orders.order_list.length;
							console.log("index by initial..........................", orderListLength)
							if (orderListLength < 2) {
								let placedUserName = (result.orders.order_list[0].user_name.split(' ').length) >= 2 ? result.orders.order_list[0].user_name.split(' ')[0] : result.orders.order_list[0].user_name;
								console.log("if", user_Status)
								if (user_Status.length) {
									this.userService.awaitingcontent = "Placed by You";
								}
								else {
									this.userService.awaitingcontent = "Placed by " + placedUserName;
								}
							}

							else {
								let otherUserName = (result.orders.order_list[this.index].user_name.split(' ').length) >= 2 ? result.orders.order_list[this.index].user_name.split(' ')[0] : result.orders.order_list[this.index].user_name
								if (orderListLength === 2) {

									if (user_Status.length) {
										this.userService.awaitingcontent = "Placed by You and " + otherUserName
									}
									else {
										this.userService.awaitingcontent = "Placed by " + otherUserName + " and " + (orderListLength - 1) + " other";
									}
								}
								else {
									if (user_Status.length) {
										this.userService.awaitingcontent = "Placed by You and " + (orderListLength - 1) + " others";
									}
									else {
										this.userService.awaitingcontent = "Placed by " + otherUserName + " and " + (orderListLength - 1) + " others";
									}
								}


								console.log("Awaiting Content..........", this.userService.awaitingcontent)

							}

							/** end */


						} else {
							this.userService.placed_order_status = false;
						}
					}
				});
			} else {
				this.userService.placed_order_status = false;
			}

		} else {
			this.userService.placed_order_status = false;
		}

	}

	// ngAfterViewInit(){  
	//     // Intersection Observer Test.....
	//     let images = document.querySelector('.anim');

	//     let observer = new IntersectionObserver( (entries) => {
	//       console.log("entries...", entries);
	//       if(entries[0].intersectionRatio > 0){
	//         console.log(entries[0].target);
	//         let img = document.createElement('img');
	//         img.src = 'assets/images/feature.svg';
	//         entries[0].target.appendChild(img);
	//       }else{
	//         entries[0].target.innerHTML = '';
	//       }
	//     })
	//     observer.observe(images);  
	//     // Intersection Observer Test.....
	// }
	itemdisp(x, y) {
		if (x === 'hidden') {
			return false;
		}
		else if (x === 'unavailable') {
			// var Time = date2.getTime() - date1.getTime(); 
			// var Days = Time / (1000 * 3600 * 24); //Diference in Days
			var time1 = y.split(" ")
			var date1 = moment().format("YYYY-MM-DD") + " " + time1[1];
			let r_date: any = moment(new Date(), 'mm : ss');
			let d_date: any = moment(new Date(date1), 'mm:ss');
			//let r_date: any = moment(new Date(), 'mm : ss');			
			let duration = d_date.diff(r_date, 'seconds');
			//console.log("time1........", duration);
			if (duration > 0) {

				setInterval(() => {
					var date1 = moment().format("YYYY-MM-DD") + " " + time1[1];
					let r_date: any = moment(new Date(), 'mm : ss');
					let d_date: any = moment(new Date(date1), 'mm:ss');
					let duration = d_date.diff(r_date, 'seconds');

					if (duration < 0) {
						clearInterval();
						return true;
					} else {
						clearInterval();
						return false;
					}

				}, 1000);


			}
			else {
				return false
			}

		}
		else {
			return true;
		}
	}


	viewOrder() {
		this.loaderStatus = true;
		localStorage.setItem("scroll_y_pos", this.CommonService.scroll_y_pos);
		this.router.navigate(['/cart/list']);
	}

	testClick() {
		console.log(this.lazyImg);
		console.log(document.querySelector('.anim'))
	}

	textAreaAdjust(event) {
		// console.log(event.target);
		event.target.style.height = "1px";
		event.target.style.height = (25 + event.target.scrollHeight) + "px";
	}

	onSelectOption(optionHeading, selectedOption, addonIndex, optionIndex) {
		// console.log(optionHeading,"----", selectedOption, "---", addonIndex, "----",optionIndex  )
		let limit_array = [];
		if (optionHeading.limit > 1) {
			for (let h = 0; h < optionHeading.options.length; h++) {
				limit_array.push(h);
			}
		}

		this.selectedAddon = optionHeading.type;
		let existStatus = false;

		console.log("this.selectedAddon------------------", this.selectedAddon)
		if (this.selectedAddon == 'exclusive') {

			console.log("inner--------------------", optionHeading.type);
			console.log("length------------------------", this.addonList.length)
			console.log("addon list------------------------", this.addonList)
			console.log("option list------------------------", optionHeading)

			for (let i = 0; i < this.addonList.length; i++) {

				console.log(optionHeading._id, "=======================", this.addonList[i].heading_id, "-----------------", i)
				if (optionHeading._id == this.addonList[i].heading_id) {
					console.log("satisfied.................")
					let array = this.addonList.splice(i, 1);
					console.log("array..........", array)

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
		} else if (optionHeading.type == 'mandatory') {
			// if(optionHeading.limit == 1){
			//   for(let i=0; i<this.addonList.length; i++)
			//   {
			//     if(optionHeading._id==this.addonList[i].heading_id) {
			//       this.addonList.splice(i, 1);
			//     }
			//   }
			// }
			// else{           
			for (let i = 0; i < this.addonList.length; i++) {
				if (selectedOption._id == this.addonList[i]._id) {
					this.addonList.splice(i, 1);
					existStatus = true;
				}

			}

			// }

		}
		else if (optionHeading.type == 'limited') {
			if (optionHeading.limit == 1) {
				for (let i = 0; i < this.addonList.length; i++) {
					if (optionHeading._id == this.addonList[i].heading_id) {
						this.addonList.splice(i, 1);
					}
				}
			} else {
				for (let i = 0; i < this.addonList.length; i++) {
					if (selectedOption._id == this.addonList[i]._id) {
						this.addonList.splice(i, 1);
						existStatus = true;
					}
				}

			}
		}

		if (!existStatus) {
			selectedOption.heading_id = optionHeading._id;
			selectedOption.heading = optionHeading.heading;
			this.addonList.push(selectedOption);
		}

		// console.log("addon_list",this.addonList)

		// if(optionHeading.type == 'mandatory'){
		//   if(optionHeading.limit > 1){
		//     let options_index = []; 
		//       for(let i=0; i<this.addonList.length; i++)
		//       {   
		//         for(let g=0; g < optionHeading.options.length; g++){
		//           if(this.addonList[i]._id == optionHeading.options[g]._id){
		//             options_index.push(g);
		//           }
		//         }           
		//       }

		//       let arr_diff = this.arr_diff(options_index,limit_array); 
		//       if(options_index.length == optionHeading.limit){

		//         for(let f=0; f< arr_diff.length; f++){
		//           let id = 'check_'+addonIndex+'_'+arr_diff[f];              
		//           let el = document.getElementById(id);
		//           el.setAttribute('style','opacity:.5;pointer-events:none');                          
		//         }            
		//       }else{
		//         // enable options           
		//           for(let f=0; f< optionHeading.options.length ; f++){
		//             let id = 'check_'+addonIndex+'_'+f;
		//             let el = document.getElementById(id);
		//             el.removeAttribute('style');                         
		//           }                      
		//       }    
		//   }
		// }
		if (optionHeading.type == 'limited') {
			if (optionHeading.limit > 1) {
				let options_index = [];
				for (let i = 0; i < this.addonList.length; i++) {
					for (let g = 0; g < optionHeading.options.length; g++) {
						if (this.addonList[i]._id == optionHeading.options[g]._id) {
							options_index.push(g);
						}
					}
				}
				let arr_diff = this.arr_diff(options_index, limit_array);

				if (options_index.length == optionHeading.limit) {
					for (let f = 0; f < arr_diff.length; f++) {
						let id = 'limit_' + addonIndex + '_' + arr_diff[f];
						let el = document.getElementById(id);
						el.setAttribute('style', 'opacity:.5;pointer-events:none');
					}
				}
				else {
					// enable options           
					for (let f = 0; f < optionHeading.options.length; f++) {
						let id = 'limit_' + addonIndex + '_' + f;
						let el = document.getElementById(id);
						el.removeAttribute('style');
					}
				}

			}
		}

		// Enable and Disable Add To Order Button
		console.log('chosen addons...', this.addonList);
		if (this.item.addons.length) {
			let mand_and_lim_addons = this.item.addons.filter(xx => xx.type == 'mandatory'); // only mandatory addons  

			console.log('mand_and_lim_addons....', mand_and_lim_addons)

			let addon_flag = [];
			if (mand_and_lim_addons.length) {

				if (this.addonList.length) {
					for (let p = 0; p < mand_and_lim_addons.length; p++) {
						let selected_an = []
						for (let q = 0; q < mand_and_lim_addons[p].options.length; q++) {

							this.addonList.filter(tt => {
								console.log("tt..................", tt)
								if (tt._id == mand_and_lim_addons[p].options[q]._id) {
									selected_an.push(tt);
								}
							});

						}

						if (selected_an.length) {
							if (selected_an.length == mand_and_lim_addons[p].limit) {
								addon_flag.push('Yes');
							} else if (selected_an.length > mand_and_lim_addons[p].limit) {
								// push no to array
								addon_flag.push('Yes');
							} else {
								addon_flag.push('No');
							}
						}
						else {
							// push no to array
							addon_flag.push('No');
						}

					}
					console.log('.......', addon_flag)

					if (addon_flag.length == mand_and_lim_addons.length) {
						let check_all_addons = addon_flag.filter(ss => ss == 'No');

						if (check_all_addons.length) {
							// hide add to order
							this.showAddToOrder = true;
						} else {
							// show add to order
							this.showAddToOrder = false;
						}
					} else if (addon_flag.length > mand_and_lim_addons.length) {
						// hide add to order
						this.showAddToOrder = false;
					} else {
						this.showAddToOrder = true;
					}
				} else {
					this.showAddToOrder = true;
				}
			}
		} else {
			this.showAddToOrder = false;
		}

		//sum
		this.item.sold_price = parseInt(this.item.selling_price);
		for (let i = 0; i < this.addonList.length; i++) {
			this.item.sold_price = this.item.sold_price + parseInt(this.addonList[i].price);
		}
		this.item_cost_flag = this.item.sold_price;
	}

	vegFilter(x) {
		this.categoryFilter = '';
		if (x) { this.categoryFilter = 'Veg'; }
	}

	arr_diff(a1, a2) {

		var a = [], diff = [];

		for (var i = 0; i < a1.length; i++) {
			a[a1[i]] = true;
		}

		for (var i = 0; i < a2.length; i++) {
			if (a[a2[i]]) {
				delete a[a2[i]];
			} else {
				a[a2[i]] = true;
			}
		}

		for (var k in a) {
			diff.push(+k);
		}

		return diff;
	}

	addItemToCart(type, x) {
		this.special_request = "";
		this.item = JSON.parse(JSON.stringify(x))
		if (this.item['addons'].length) {
			localStorage.setItem('selected_item', JSON.stringify(x));
			if (this.cartItems > 0) {

				console.log("condition 1");

				this.showAddToOrder = true;
				let itemObject = this.itemExistInCart(this.item._id);
				console.log("itemObject----------", itemObject);
				if (itemObject) {

					this.cartItemDetails = itemObject.item;
					// console.log(this.cartItemDetails)
					this.itemRepeatFooter = true;

					// document.querySelector("#slide-bot").classList.remove("slide-out-bottom");    
					// document.querySelector("#slide-bot").classList.add("slide-in-bottom");

					document.querySelector("body").classList.add("customize-fade");
					document.querySelector("#nav-fade").classList.add("nav-fade");
					document.querySelector("#item-fade").classList.add("section-fade");

					// console.log('slide out.....', document.querySelector("#slide-bot"))

					// setTimeout(
					//   function() {
					//     document.querySelector("#slide-bot").classList.remove("slide-in-bottom");    
					//     document.querySelector("#slide-bot").classList.add("slide-out-bottom");  
					//   }, 1000);



				}
				// else {
				// this.router.navigate(['/menu/item/customization']);
				// console.log("sdfssssssssssssssssss")
				this.item = JSON.parse(JSON.stringify(x));
				this.item_cost_flag = this.item.selling_price;
				this.item.sold_price = this.item.selling_price;
				this.addonList = [];
				let addons = this.item.addons;

				this.show_cust_popup = true;
				this.scrollModalTop();
				for (let i = 0; i < addons.length; i++) {
					if (addons[i].type == 'exclusive')
						this.onSelectOption(addons[i], addons[i].options[0], i, 0);

					// if(addons[i].type == 'mandatory'){
					//   if(addons[i].limit == 1){
					//     this.onSelectOption(addons[i], addons[i].options[0], i, 0);
					//   }
					// }
				}
				let limited_addons = addons.filter(gg => gg.type == 'limited');
				if (limited_addons.length) {
					if (addons.length == limited_addons.length) {
						this.showAddToOrder = false;
					}
				}

				let multiple_addons = addons.filter(gg => gg.type == 'multiple');
				if (multiple_addons.length) {
					if (addons.length == multiple_addons.length) {
						this.showAddToOrder = false;
					}
				}

				let limited_addons_e = addons.filter(gg => (gg.type == 'limited' || gg.type == 'exclusive'));
				if (limited_addons_e.length) {
					if (addons.length == limited_addons_e.length) {
						this.showAddToOrder = false;
					}
				}

				let multiple_addons_e = addons.filter(gg => (gg.type == 'multiple' || gg.type == 'exclusive'));
				if (multiple_addons_e.length) {
					if (addons.length == multiple_addons_e.length) {
						this.showAddToOrder = false;
					}
				}

				let lim_multiple_addon = addons.filter(gg => (gg.type == 'limited' || gg.type == 'multiple'));
				console.log('lim_multiple_addon..', lim_multiple_addon);
				if (lim_multiple_addon.length) {
					if (addons.length == lim_multiple_addon.length) {
						this.showAddToOrder = false;
					}
				}

				this.show_cust_popup = true;
				//}

			}
			else {
				console.log("condition 2");
				// this.router.navigate(['/menu/item/customization']);
				//this.item = x;
				this.item = JSON.parse(JSON.stringify(x));
				this.item_cost_flag = this.item.selling_price;
				this.item.sold_price = this.item.selling_price;

				this.addonList = [];
				let addons = this.item.addons;
				// this.item.tax_rates  = [];
				// this.item.tax_rates  = this.item.tax_rates;

				this.show_cust_popup = true;
				this.scrollModalTop();
				for (let i = 0; i < addons.length; i++) {
					if (addons[i].type == 'exclusive')
						this.onSelectOption(addons[i], addons[i].options[0], i, 0);

					// if(addons[i].type == 'mandatory'){
					//   if(addons[i].limit == 1){
					//     this.onSelectOption(addons[i], addons[i].options[0], i, 0);
					//   }
					// }
				}

				let limited_addons = addons.filter(gg => gg.type == 'limited');
				if (limited_addons.length) {
					if (addons.length == limited_addons.length) {
						this.showAddToOrder = false;
					}
				}

				let multiple_addons = addons.filter(gg => gg.type == 'multiple');
				if (multiple_addons.length) {
					if (addons.length == multiple_addons.length) {
						this.showAddToOrder = false;
					}
				}

				let limited_addons_e = addons.filter(gg => (gg.type == 'limited' || gg.type == 'exclusive'));
				if (limited_addons_e.length) {
					if (addons.length == limited_addons_e.length) {
						this.showAddToOrder = false;
					}
				}

				let multiple_addons_e = addons.filter(gg => (gg.type == 'multiple' || gg.type == 'exclusive'));
				if (multiple_addons_e.length) {
					if (addons.length == multiple_addons_e.length) {
						this.showAddToOrder = false;
					}
				}

				let lim_multiple_addon = addons.filter(gg => (gg.type == 'limited' || gg.type == 'multiple'));
				console.log('lim_multiple_addon..', lim_multiple_addon);
				if (lim_multiple_addon.length) {
					if (addons.length == lim_multiple_addon.length) {
						this.showAddToOrder = false;
					}
				}

			}
		}
		else {
			//cart
			// let addonDetails = false;+
			this.item_cost_flag = x.selling_price;
			x.sold_price = x.selling_price;
			localStorage.setItem('selected_item', JSON.stringify(x));
			if (this.cartItems > 0) {

				console.log("condition 3");
				this.showAddToOrder = false;
				let itemObject = this.itemExistInCart(this.item._id);
				console.log(itemObject);
				if (itemObject) {
					this.cartItemDetails = itemObject.item;
					// this.itemRepeatFooter = true;
					// this.onConfirm();
					this.showAddToOrder = true;
					this.onRepeatLastItem(itemObject.item.cart_id);

				}
				else {
					// this.router.navigate(['/menu/item/customization']);
					this.item = JSON.parse(JSON.stringify(x));
					this.item.sold_price = this.item.selling_price;
					this.item.tax_rates = [];
					this.item.tax_rates = x.tax_rates;
					console.log("Tax rate - 3", this.item.tax_rates);
					this.addonList = [];
					let addons = this.item.addons;
					console.log("addon cond 3..............", this.item.addons)
					this.show_cust_popup = true;
					this.scrollModalTop();
					this.showAddToOrder = true;
					for (let i = 0; i < addons.length; i++) {
						if (addons[i].type == 'exclusive')
							this.onSelectOption(addons[i], addons[i].options[0], i, 0);

						// if(addons[i].type == 'mandatory'){
						//   if(addons[i].limit == 1){
						//     this.onSelectOption(addons[i], addons[i].options[0], i, 0);
						//   }
						// }
					}

					this.show_cust_popup = false;
					this.onConfirm();
				}


			} else {
				console.log("condition 4");
				// this.router.navigate(['/menu/item/customization']);
				this.showAddToOrder = false;
				// this.item = x;
				this.item = JSON.parse(JSON.stringify(x));
				this.item.sold_price = this.item.selling_price;
				this.item.tax_rates = [];
				this.item.tax_rates = this.item.tax_rates;
				console.log("Tax rate - 4", this.item.tax_rates);
				this.addonList = [];
				let addons = this.item.addons;
				this.show_cust_popup = true;
				this.scrollModalTop();
				this.showAddToOrder = true;
				for (let i = 0; i < addons.length; i++) {
					if (addons[i].type == 'exclusive')
						this.onSelectOption(addons[i], addons[i].options[0], i, 0);

					// if(addons[i].type == 'mandatory'){
					//   if(addons[i].limit == 1){
					//     this.onSelectOption(addons[i], addons[i].options[0], i, 0);
					//   }
					// }
				}

				this.show_cust_popup = false;
				this.onConfirm();
			}

			// this.menuStorageService.ADD_ITEM_TO_CART(this.category, x, addonDetails);
			// this.ngOnInit();
		}
	}

	removeItemFromCart(itemId) {
		this.menuStorageService.REMOVE_ITEM_FROM_CART(itemId);
		// this.ngOnInit();

		let cartDetails = this.userService.CART_DETAILS();
		this.cartItems = cartDetails.cart_items;
		this.cartTotal = cartDetails.cart_total;

		this.menu_items.forEach((element, index) => {
			if (element._id == itemId) {
				if (element.ordered_qty > 0) {
					element.ordered_qty--;
				} else {
					element.ordered_qty = 0;
				}
			}
		});
	}


	onChooseCutomize() {
		this.router.navigate(['/menu/item/customization']);
	}
	onRepeatLastItem(obj) {

		console.log("glycftlvvcftc")
		let selectedItem = JSON.parse(localStorage.getItem('selected_item'));
		this.menuStorageService.REPEAT_ITEM_IN_CART(obj);

		// this.itemRepeatFooter = false;
		// setTimeout(() => { this.itemRepeatFooter = false; }, 250);
		// if (document.querySelector("#slide-bot")) {
		//   document.querySelector("#slide-bot").classList.remove("slide-in-bottom");
		//   document.querySelector("#slide-bot").classList.add("slide-out-bottom");
		// }


		// document.querySelector("body").classList.remove("customize-fade");
		// document.querySelector("#nav-fade").classList.remove("nav-fade");
		// document.querySelector("#item-fade").classList.remove("section-fade");
		console.log("menu item...........", this.menu_items);
		console.log("selected item..........", selectedItem);

		let cartDetails = this.userService.CART_DETAILS();
		this.cartItems = cartDetails.cart_items;
		this.cartTotal = cartDetails.cart_total;
		console.log("repeat cart-----", this.cartItems)
		this.menu_items.forEach(element => {
			if (element._id == selectedItem._id) {
				element.ordered_qty++;
			}
		});
		// this.ngOnInit();
		// this.ngOnInit();
		if (document.body.classList.contains('customize-fade')) {
			this.closeitemreapter();
		}
	}


	removeobjprop(addon) {
		let newAddonarr = addon;
		newAddonarr = newAddonarr.filter(function (addon) {
			delete addon.selected;
			return true;
		});
		console.log("newarray----------------", newAddonarr);
		return newAddonarr;
	}

	sortArrayObj(val) {
		const newArray = _.sortBy(val, o => o.name);
		return newArray
	}

	itemExistInCartByItemId(itemId, addon) {
		let cart = JSON.parse(localStorage.getItem('cart'));
		console.log("cart----------------", cart);
		console.log("addon.......................", addon)
		if (cart != null) {
			if (cart.length) {
				let newAddon = this.removeobjprop(addon)
				let a = this.sortArrayObj(newAddon);
				console.log("a----------------", a);

				let revCart = cart.reverse();
				for (let i = 0; i < revCart.length; i++) {
					if (itemId == revCart[i].item_id) {
						let b = this.sortArrayObj(revCart[i].applied_addons);
						console.log("b----------------", b, " ", _.isEqual(a, b));
						if (_.isEqual(a, b)) {
							return { item: revCart[i] };
						}

					}
				}
			}

		}

	}


	itemExistInCart(itemId) {
		let cart = JSON.parse(localStorage.getItem('cart'));
		if (cart != null) {
			if (cart.length) {
				let revCart = cart.reverse();
				for (let i = 0; i < revCart.length; i++) {
					if (itemId == revCart[i].item_id) {
						return { item: revCart[i] };
					}
				}
			}
		}

	}




	countItemInCart(cart, itemId) {
		let count = 0;
		for (let i = 0; i < cart.length; i++) {
			if (itemId == cart[i].item_id)
				count += cart[i].quantity;
		}
		return count;
	}

	iwillchoose() {

		this.special_request = "";

		this.item = JSON.parse(localStorage.getItem('selected_item'));

		this.item.sold_price = this.item.selling_price;

		this.addonList = [];
		let addons = this.item.addons;

		if (addons.length) {
			this.show_cust_popup = true;
			// this.showAddToOrder = true;
			this.scrollModalTop();

		} else {
			this.show_cust_popup = false;
			this.onConfirm();
		}
		for (let i = 0; i < addons.length; i++) {
			if (addons[i].type == 'exclusive')
				this.onSelectOption(addons[i], addons[i].options[0], i, 0);

			// if(addons[i].type == 'mandatory'){
			//   if(addons[i].limit == 1){
			//     this.onSelectOption(addons[i], addons[i].options[0], i, 0);
			//   }
			// }
		}

		// this.itemRepeatFooter = false;
		setTimeout(() => { this.itemRepeatFooter = false; }, 250);
		document.querySelector("#slide-bot").classList.remove("slide-in-bottom");
		document.querySelector("#slide-bot").classList.add("slide-out-bottom");

		document.querySelector("body").classList.remove("customize-fade");
		document.querySelector("#nav-fade").classList.remove("nav-fade");
		document.querySelector("#item-fade").classList.remove("section-fade");
	}

	scrollModalTop() {
		setTimeout(() => {
			$('.modal-body').each(function (index, element) {
				let className = 'modal-body' + (index + 1);
				element.classList.add(className);
				$("." + className).scrollTop(0);
			});
		}, 500);
	}

	// onConfirm(alertmodal) {
	//   console.log("selected item....", this.item);      
	//   console.log("addon list...", this.addonList); 
	//   let check_mandatory = this.item.addons.filter( addon => addon.type == 'mandatory');
	//   console.log("mandatory addons.....", check_mandatory);

	//   if(check_mandatory.length > 0){
	//     if(this.addonList.length > 0){
	//       let checked_addons = [];

	//       for(let k=0; k<check_mandatory.length; k++){
	//         if(check_mandatory[k].options.length){
	//           for(let p=0; p<check_mandatory[k].options.length; p++){
	//             let data = this.addonList.filter( gg => gg._id == check_mandatory[k].options[p]._id);
	//             if(data[0]){
	//               checked_addons.push(data[0]);
	//             }              
	//           }
	//         }
	//       }           
	//       console.log("checked addons...", checked_addons);
	//       // checked addon list
	//       if(check_mandatory.length == checked_addons.length){
	//         //below code
	//         console.log("below code...");
	//         let category = JSON.parse(localStorage.getItem('selected_category'));
	//         let selectedItem = JSON.parse(localStorage.getItem('selected_item'));
	//         // CART
	//         let addonDetails = { addons: this.addonList, special_request: this.special_request };
	//         selectedItem.sold_price = this.item.sold_price;
	//         console.log("inside onconfirm");

	//         this.menuStorageService.ADD_NEW_ITEM_TO_CART(category, selectedItem, addonDetails).then( res => {
	//           console.log(res);
	//           if(res){
	//             let selectedItem = JSON.parse(localStorage.getItem('selected_item'));     

	//             let cartDetails = this.userService.CART_DETAILS();
	//             this.cartItems = cartDetails.cart_items;   
	//             this.cartTotal = cartDetails.cart_total;
	//             // this.router.navigate(['/menu/items']);

	//             this.menu_items.forEach(element => {
	//               if(element._id == selectedItem._id){
	//                 element.ordered_qty++;
	//               }      
	//             });
	//           }else{
	//             console.log("asdfg");
	//           }          
	//         })
	//       }else{
	//         //alert
	//         console.log("alert...");
	//         this.show_cust_popup = false;
	//         alertmodal.show();
	//       }
	//     }else{
	//       // alert
	//       console.log("alert...");
	//       this.show_cust_popup = false;
	//       alertmodal.show();
	//     }
	//   }else{
	//     // below code
	//     console.log("below code...");
	//     let category = JSON.parse(localStorage.getItem('selected_category'));
	//     let selectedItem = JSON.parse(localStorage.getItem('selected_item'));
	//     // CART
	//     let addonDetails = { addons: this.addonList, special_request: this.special_request };
	//     selectedItem.sold_price = this.item.sold_price;
	//     console.log("inside onconfirm");

	//     this.menuStorageService.ADD_NEW_ITEM_TO_CART(category, selectedItem, addonDetails).then( res => {
	//       console.log(res);
	//       if(res){
	//         let selectedItem = JSON.parse(localStorage.getItem('selected_item'));     

	//         let cartDetails = this.userService.CART_DETAILS();
	//         this.cartItems = cartDetails.cart_items;   
	//         this.cartTotal = cartDetails.cart_total;
	//         // this.router.navigate(['/menu/items']);

	//         this.menu_items.forEach(element => {
	//           if(element._id == selectedItem._id){
	//             element.ordered_qty++;
	//           }      
	//         });
	//       }else{
	//         console.log("asdfg");
	//       }

	//     })
	//   }        

	// }


	onItemPage(category, catIndex) {
		console.log("catIndex....", catIndex);
		this.router.navigate(['/menu/items']);
		localStorage.setItem('catIndex', catIndex);
		localStorage.setItem('selected_category', JSON.stringify(category));
	}


	onConfirm() {
		let category = JSON.parse(localStorage.getItem('selected_category'));
		let selectedItem = JSON.parse(localStorage.getItem('selected_item'));
		// CART
		let addonDetails = { addons: this.addonList, special_request: this.special_request };
		selectedItem.sold_price = this.item.sold_price;

		console.log("inside onconfirm");

		console.log("confirm selected item--------------------", selectedItem)
		console.log("confirm selected addon--------------------", this.addonList);

		let itemObject = this.itemExistInCartByItemId(selectedItem._id, this.addonList)
		console.log("itemObject confirm----------", itemObject);
		if (itemObject) {
			if (this.special_request === "") {
				console.log("cart Id........................", itemObject.item.cart_id)

				this.menuStorageService.REPEAT_ITEM_IN_CART(itemObject.item.cart_id);

				let cartDetails = this.userService.CART_DETAILS();
				this.cartItems = cartDetails.cart_items;
				this.cartTotal = cartDetails.cart_total;
				console.log("repeat cart-----", this.cartItems)
				this.menu_items.forEach(element => {
					if (element._id == selectedItem._id) {
						element.ordered_qty++;
					}
				});



			}
			else {
				this.addNewItemInCart(category, selectedItem, addonDetails)
			}
		}

		else {
			this.addNewItemInCart(category, selectedItem, addonDetails)
		}

	}

	// ngAfterViewInit(){
	//   let images = document.querySelector('.anim');
	//   console.log("images...", images);    
	// }
	addNewItemInCart(category, selectedItem, addonDetails) {
		this.menuStorageService.ADD_NEW_ITEM_TO_CART(category, selectedItem, addonDetails).then(res => {
			console.log("result......................", res);
			if (res) {

				let selectedItem = JSON.parse(localStorage.getItem('selected_item'));

				let cartDetails = this.userService.CART_DETAILS();
				this.cartItems = cartDetails.cart_items;
				this.cartTotal = cartDetails.cart_total;
				// this.router.navigate(['/menu/items']);

				this.menu_items.forEach(element => {
					if (element._id == selectedItem._id) {
						element.ordered_qty++;
					}
				});
			} else {
				console.log("asdfg");
			}
		})
	}
	searchFunc() {
		this.showSearch = !this.showSearch;
		// console.log("yes");    
		let searchBar: any = document.querySelector('.search-bar');
		searchBar.classList.add('open');
	}
	closeSearch() {
		this.showSearch = !this.showSearch;
		this.item_search = null;
		let searchBar: any = document.querySelector('.search-bar');
		searchBar.classList.remove('open');
	}
	goToOrderStatus() {
		this.router.navigate(['/order-status']);
		localStorage.setItem("viewStatus", "awaiting")
	}
	cancelCust() {
		// console.log('cancel....');
		this.showAddToOrder = true;
		let addon_flag = [];
	}

	closeitemreapter() {
		document.querySelector("#slide-bot").classList.remove("slide-in-bottom");
		document.querySelector("#slide-bot").classList.add("slide-out-bottom");

		document.querySelector("body").classList.remove("customize-fade");
		document.querySelector("#nav-fade").classList.remove("nav-fade");
		document.querySelector("#item-fade").classList.remove("section-fade");
		// this.itemRepeatFooter=false;
		setTimeout(() => { this.itemRepeatFooter = false; }, 250);

	}
}

