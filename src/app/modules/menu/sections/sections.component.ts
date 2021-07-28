import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SwPush } from '@angular/service-worker';
import { AuthService, GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { UserService } from '../../../_services/user.service';
import { ApiService } from '../../../_services/api.service';
import { environment } from '../../../../environments/environment';
// import { SocketService } from '../../_services/socket.service';
import { Socket } from 'ngx-socket-io';
import { SnackbarService } from '../../../_services/snackbar.service';
import * as sha512 from 'js-sha512';
import { LoadscriptService } from 'src/app/_services/loadscript.service';
import { CommonService } from 'src/app/_services/common.service';
import { CookieService } from 'ngx-cookie-service';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
import * as moment from 'moment'; 
declare const Swiper: any;
declare const $: any;
@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.css']
})
export class SectionsComponent implements OnInit {
  restaurant_details: any = JSON.parse(localStorage.getItem('restaurant_details'));
	user_details: any = JSON.parse(localStorage.getItem('user_details'));
	signupForm: any = {}; otpForm: any = {}; loginForm: any = {}; forgotForm: any = {}; user_name: string; user_id:string;photo_url: string;
	lp_hide: boolean; sp_hide: boolean; customer_id: any;
	cartItems: Number = 0; selected_quick_option: any = null;
	page_redirect: string; billStatus: string; paymentStatus: string; orderTypeFlag: string; hideBubble: boolean;
	orderedItemCount: number;
	enterEmailField: boolean = true;
	enterNameField: boolean = true;
	enterSurNameField: boolean = false;
	enterPasswordField: boolean = false;
	confirmPasswordField: boolean = false;
	enterMobileField: boolean = false;
	enterOtpField: boolean = false;
	pleasewait: boolean = false;
	passwordMismatch: boolean = true;
	auth2: any;
	interval: any;
	mobile_num: any;
	timeLeft: number;
	mob_num_exist: boolean = false;
	exist_email: String = '';
	private user: SocialUser;
	timeLeftString: String = '00 : 60';
	social_data: any;
	showExit: boolean = true;
	take_aways: boolean = false;
	orderContent: any;
	awaitingcontent: any;
	userDetails:any;
	index: any;
	resendOTP:boolean = false;
	sendOTP:boolean = true;
	mobileShow:boolean = false;
	modalLogo:boolean = false;
	socialLogo:boolean = false;
	yesBtnStatus:boolean = false;
	loaderStatus:boolean = false;
	baseUrl = environment.img_url;
	isReadonly:boolean = true;
	valet_status: any;
	progressValue: any;
	progressPerc: any;
	delayTime: any = '5';
	serial_number: any;
	showFetchingDetails: any;
	resultString: any;
	confirm_click: boolean = true;
	valet_id: any;
	status: boolean;
	config: any = {};
	re_request:boolean = false;
	isDepart:boolean;
	valet_det_sta: any;
  sectionName:String;
  sectionHeader:String;
  sectionMenu:any;
  sectionDisp:any;
  popupBanner:any;
  popupheader:any;
  deviceStringCat:string;
  deviceStringLogo:string;
  deviceStringItem:string;
  alterUrl:any;
  constructor(private router: Router,
		private socket: Socket,
		public userService: UserService,
		private socialAuthService: AuthService,
		private apiService: ApiService,
		private swPush: SwPush,
		private snackBar: SnackbarService,
		private location: Location,
		private ldScript: LoadscriptService,
		public commonService: CommonService, private cookieService: CookieService, private browserService :UserBrowserService) { }

  ngOnInit() {
    
		//this.loginForm.mobile.length = 0;
			console.log(this.userService.showExit)
      //user details
      this.ldScript.load('font-awesome', 'material-icons').then(data => {
        console.log('font awesome reference added....');
      }).catch(error => console.log('err...', error));

	  if(this.browserService.isChrome)
	  {		
		  this.alterUrl =  'assets/images/Dinamic_Logo.webp'
	  }
	  else
	  {
		  this.alterUrl =  'assets/images/Dinamic_Logo.png'
	  }

	  
		this.apiService.ACCESS_CODE_DETAILS({ "id": 'q', "code": localStorage.getItem('access_code'), baseURL: environment.baseUrl }).subscribe(result => {
			console.log('api call')
			if (result.status) {
				console.log('result -------------------------', result);					
				if (result.dinamic_details.table_type == "location") {
				 
						
							console.log("location origin....", location.origin);
							console.log("restuarent det....", result);
					let isBanner:boolean;
					console.log("image length..........",result.branch_details[0].banner_images.length)
					if(result.branch_details[0].banner_images && result.branch_details[0].banner_images.length)
					{
						isBanner = true
						console.log("banner images true...............", )
					}
					else
					{
						isBanner = false;
						console.log("banner images false...............", )
					}
					result.branch_details[0].categories_list[0].categories.forEach(element => {
						let str = element.imageUrl
						if(element.imageUrl)
						{
						var elems = str.split("/");
					    elems.splice(elems.length-1, 0, this.deviceStringCat)
						element.imageUrl = elems.join("/")
						}
						
					});


					

				   let categoryList = result.branch_details[0].categories_list[0].categories;
				   let logoStr = result.branch_details[0].logo_url ? (environment.img_url + result.branch_details[0].logo_url) : this.alterUrl
				   var logoElems = logoStr.split("/");
				   logoElems.splice(logoElems.length-1, 0, this.deviceStringLogo);
				   let logoURL = logoElems.join("/")
				

				   

					console.log("category list....", categoryList);
					this.userService.restaurant_gst = result.branch_details[0].tax_value;
					result.branch_details[0].taxes.forEach((element, index) => {
						if (index != (result.branch_details[0].taxes.length - 1)) {
							this.userService.restuarant_taxes = this.userService.restuarant_taxes + element.value + " + ";
						} else {
							this.userService.restuarant_taxes = this.userService.restuarant_taxes + element.value;
						}
					});

					console.log("restuarant taxes.....", this.userService.restuarant_taxes);
					let itemsCount = 0;
			
			
					var str="/image/picture.jpg";
					var elems = str.split("/");
					elems.splice(elems.length-1, 0, "original")
					console.log("join...............",elems.join("/"))
	
					for (let i = 0; i < categoryList.length; i++) {	
						itemsCount += categoryList[i].item_count;
					}
					if(result.branch_details[0].departments)
					{
						var departments =  result.branch_details[0].departments.sort((a, b) => {
							return a.department_order - b.department_order;
						});
					}

					if(result.branch_details[0].has_department_module)
					{
						departments.forEach(element => {
							let rest = JSON.parse(localStorage.getItem('restaurant_details'))
							
							if(element.pop_up_banners &&  element.pop_up_banners.length)
							{
								
								rest.departments.filter(element1 =>{
								
								 if(element1._id === element._id)
								 {
									console.log("element1...............", element1)
									if(element1.pop_up_banners &&  element1.pop_up_banners.length && element1.popup == false)
									{
										element.popup =false;
									}
									else
									{
										element.popup =true;	
									}
								 }
								})

							}
						});
					}
					console.log('result -------------------------', result);
					console.log("location origin....", location.origin)
					if (result.dinamic_details.table_type == "location") {
						// location
						let restaurant_details = {
							order_type: "in_house",
							company_id: result.branch_details[0].company_id,
							branch_id: result.branch_details[0]._id,
							floor_id: result.table_detail.floor_id,
							table_id: result.table_detail._id,
							branch_name: result.branch_details[0].name,
							logo_url: result.branch_details[0].logo_url ? (environment.img_url + result.branch_details[0].logo_url) : this.alterUrl,
							service_charge : result.branch_details[0].service_charge ? result.branch_details[0].service_charge : '0',
							customer_editable_sc : result.branch_details[0].customer_editable_sc,
							branch_location: result.branch_details[0].location,
							gst: result.branch_details[0].tax_value,
							restaurant_tax: this.userService.restuarant_taxes,
							valet_service: true,
							session_started_at: result.table_detail.session_started_at,
							offers: [],
							total_items: result.branch_details[0].total_items_count,
							table_order_status: result.table_detail.table_order_status,
							table_name: result.table_detail.name ? result.table_detail.name : '',
							menu_category: categoryList,
							isDepartment: result.branch_details[0].has_department_module,
							departments:result.branch_details[0].departments ? departments : 'empty',
							menu_sections:result.branch_details[0].menu_sections ? result.branch_details[0].menu_sections : [{'header':'Order Now', 'name':'all', 'section_order': 1}],
							quick_options: result.branch_details[0].quick_options,
							isBanner:isBanner,
							banner_images: isBanner ? result.branch_details[0].banner_images : 'empty'
						}
						localStorage.setItem('restaurant_details', JSON.stringify(restaurant_details));

					}
					else {
						// locationless
						let restaurant_details = {
							order_type: "take_aways",
							company_id: result.branch_details[0].company_id,
							branch_id: result.branch_details[0]._id,
							branch_name: result.branch_details[0].name,
							branch_location: result.branch_details[0].location,
							logo_url: result.branch_details[0].logo_url ? (environment.img_url + result.branch_details[0].logo_url) : this.alterUrl,
							service_charge : result.branch_details[0].service_charge ? result.branch_details[0].service_charge : '0',
							gst: result.branch_details[0].tax_value,
							restaurant_tax: this.userService.restuarant_taxes,
							valet_service: false,
							offers: [],
							total_items: result.branch_details[0].total_items_count,
							menu_category: categoryList,
							isDepartment: result.branch_details[0].has_department_module,
							departments:result.branch_details[0].departments ? departments : 'empty',
							menu_sections:result.branch_details[0].menu_sections ? result.branch_details[0].menu_sections : [{'header':'Order Food', 'name':'all', 'section_order': 1}],
							quick_options: result.branch_details[0].quick_options,
							isBanner:isBanner,
							banner_images: isBanner ? result.branch_details[0].banner_images : 'empty'
						}
						localStorage.setItem('restaurant_details', JSON.stringify(restaurant_details));
					}


					
					localStorage.setItem('access_type', result.dinamic_details.table_type);
					localStorage.setItem('dinamic_details', JSON.stringify(result.dinamic_details));
							console.log("table Engaged Socket..........*******************")
							// this.socket.emit("table_engaged", resturant_det.table_id);
					

					

				}

			} else {
				console.log('response', result);
				console.log('response idle', result);
				document.getElementById("networkAlertModal").click();
				let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
				if(restaurant_det.order_type === 'in_house')
				{
				this.socket.emit('leave_table', restaurant_det.table_id);
				}
				else
				{
				this.socket.emit('close_take_away',localStorage.getItem('pos_order_id'));	
				}
				
				// localStorage.clear();
				// sessionStorage.clear();
				this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict'); 
			}
		});

	  this.sectionName = localStorage.getItem("selected_section_name")
	  
	  this.restaurant_details.departments.filter((j) => { 
        if(j._id === localStorage.getItem("selected_section_name"))
        {
          this.sectionHeader = j.header
		  setTimeout(() => {
			document.getElementById("departModal").click();
		}, 500); //any millisecond
        }
      });
      
      localStorage.removeItem('catIndex');
      this.userService.showOrderNow = false;
      this.userService.showExit = true;
  
    
      console.log("restaurant details.......", JSON.parse(localStorage.getItem('restaurant_details')));
  
  
      let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'))
      // this.apiService.RAZOR_WEBHOOK({branch_id:restaurant_det.branch_id}).subscribe(result => {
      // 	console.log("razor result..............", result)
      // })

  
           this.isDepart = restaurant_det.isDepartment
       console.log("department................", this.isDepart)
  
        this.restaurant_details.departments.forEach(element => {
          if(element.menu_sections && element.menu_sections.length)
          {
            element.menu_sections.forEach(element1 => {
              element1.itemsCount = 0;
              if(element._id === this.sectionName)
              {
               
               // console.log("section name...............", element)
               // this.sectionMenu = element.menu_sections;
				this.sectionMenu = element.menu_sections.sort((a, b) => {
					return a.section_order - b.section_order;
				});
			//    this.sectionMenu = element.sort((a, b) => {
			// 	return a.section_order - b.section_order;
			// });

                console.log("section name1...............",  this.sectionMenu);
                console.log("menu category.................",this.restaurant_details.menu_category)
                  //element.menu_sections[0].itemsCount = 0;
                  
                  this.restaurant_details.menu_category.filter((i) =>
                  {
                 console.log("category element...............", i)
                 if(i.associated_dept_sections)
                 {
                  i.associated_dept_sections.filter((k) =>
                  {
                   console.log("count element",element._id,"....................", k._id);
                   if(element._id === k._id)
                   {
                  console.log("count head....................", i.associated_dept_sections)
                     //console.log("count.............",  i.associated_dept_sections[0].menu_sections)
                     let t = k.menu_sections.filter((j) => j._id === element1._id  && j.selected === true);
                     console.log("length of t.....................", t)
                     if(t.length)
                     {			
                      
					   if(i.item_count == undefined)
					   {
						element1.itemsCount += 0;
						element.selected = true;
					   }
					   else
					   {
						element1.itemsCount += Number(i.item_count);
						element.selected = true;
					   }
                       
                     //console.log("count.............",  element.menu_sections.itemsCount)
                     }
					 	
                    
                   }
                   })
                 }
             
                 
                
             
                    
                  } );
                    
                
    
    
                // sectionMenu.menu_sections.filter((i) =>
                // {
                //   if(element.name == 'all')
                // {
                //   element.itemsCount += Number(i.item_count)
                // }
                // else
                // {
                //   let t = i.associated_menu_sections.filter((j) => j.name === element.name  && j.checked === true);
                //   if(t.length)
                //   {			
                //   element.itemsCount += Number(i.item_count)
                //   }	
                // }
                  
                  
                // } );
               
              }
              else
              {
                element.selected = false;
                console.log("No data Found")
              }
            })
          
          }
       else
       {
         console.log("No menu sections..............")
       }
        
     
            
          });
      
  
  
       
          
      let user_details = JSON.parse(localStorage.getItem('user_details'));
      if (JSON.parse(localStorage.getItem('user_details'))) {
  
        //restaurant session check
  
        let a = JSON.parse(localStorage.getItem('user_details'));
        let sendData = {
          dinamic_user_id:a.dinamic_user_id,
          access_code :localStorage.getItem("access_code"),
          pos_branch_id:this.restaurant_details.branch_id
        }
  
        this.apiService.GET_VALET_DETAILS(sendData).subscribe(result => {
          console.log('valet result....', result.status);
          if (result.status === true) {
            this.commonService.valet_details = result.data;
            if (result.data.valet_status) {
              console.log("home valet", result.data.valet_status)
              this.commonService.valetStatus = result.data.valet_status;
              
        this.apiService.GET_BILL().subscribe(result => {
        console.log("valet bill.......",result)
        })
            //	this.router.navigate(['/bill/confirm']);
            } else {
              this.apiService.CANCEL_VALET({ _id: result.data._id }).subscribe(result => {
                console.log('valet result....', result);
              })
            }
  
          }
        })
        this.billStatus = localStorage.getItem('await_settlement');
        this.paymentStatus = localStorage.getItem('payment_status') ? localStorage.getItem('payment_status') : "";
        let userDetails = JSON.parse(localStorage.getItem('user_details'));
        this.userService.user_name = user_details.name;
        this.user_id = user_details.dinamic_user_id;
        this.photo_url = user_details.photo_url;
  
  
  
        this.apiService.CONFIRMED_ORDERS().subscribe(result => {
          console.log('orders........................', result)
          if (result.status) {
            let order_list = result.orders.order_list;
            if (order_list.length) {
              this.userService.showExit = false;
            } else {
              this.apiService.PLACED_ORDERS().subscribe(reslt => {
                console.log('placed orders1.....', reslt);
                if (reslt.status) {
                  let ord_list = reslt.orders.order_list;
                  if (ord_list.length) {
                    this.userService.showExit = false;
                  } else {
                    this.userService.showExit = true;
                  }
                }
              })
            }
  
          }
        })
  
        this.apiService.GET_BILL().subscribe(result => {
          console.log('oms bills.....', result);
          if (result.status) {
            let bills = result.bills.bills;
            console.log("result.bills.bills", result.bills.bills);
            let check_currentuser_ordered = bills.filter(ss => ss.orderer_id === this.user_id);
            console.log('bills....', check_currentuser_ordered);
  
            if (check_currentuser_ordered.length) {
              this.userService.showOrderNow = true;
              this.userService.showExit = true;
              //this.snackBar.BILLSETTLEMENTINPROGRESS('Bill settlement in progress.', 'OKAY');
              this.router.navigate(['bill/confirm']);
  
            } else {
              this.snackBar.BILLSETTLEMENTINPROGRESSCLOSE();
              if(!this.take_aways){
                this.userService.showOrderNow = true;
              }
              
  
            }
  
          }
          else
          {
            console.log("bills else.....")
            let a = this.user_details;
            let sendData = {
              dinamic_user_id:a.dinamic_user_id,
              access_code :localStorage.getItem("access_code"),
              pos_branch_id:this.restaurant_details.branch_id
            }
            this.apiService.GET_VALET_DETAILS(sendData).subscribe(result => {
              console.log('valet result....', result);
              if (result.status) {
                this.commonService.valet_details = result.data;
                this.resultString = result.data.serial_number
                this.status = true;
                this.userService.showOrderAgain = false;
                if (result.data.valet_status) {
                  this.userService.showValetAgain = true;
                  this.resultString = result.data.serial_number;
                  this.commonService.valetStatus = result.data.valet_status;
                  localStorage.setItem(result.data.valet_status, "valet_staus")
                  this.valet_status = result.data.valet_status;
                  let valet_delivery = result.data.delivery_time;
                  console.log('valet_delivery.....', this.commonService.valetStatus)
                  if (valet_delivery) {
                    this.commonService.deliveryTime = Number(valet_delivery);
                    this.userService.vehicle.delivery_time   =  Number(result.data.delivery_time) ;
                  }
                  
          
          
            
                  if (valet_delivery) {
                    this.commonService.deliveryTime = Number(valet_delivery);
                  }
                //	let timer_config = JSON.parse(localStorage.getItem('timerConfig'));
                  // console.log('timer_config....', timer_config);
                  
                    if (this.valet_status) {
                      if (this.valet_status == 'on_hold') {								
                        this.userService.vehicle.delivery_time = Number(result.data.delivery_time);
                        this.userService.vehicle.valet_delay = Number(result.data.delay)
                        let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
                        let r_date: any = moment(new Date(), 'mm : ss');			
                        let duration = d_date.diff(r_date, 'seconds');
                        //console.log("event duration.............", duration)
                        if(duration>0)
                        {
                        this.commonService.timerConfig = { leftTime: duration, format: 'mm:ss', notify: 0 };
                        }
                        else
                        {
                          this.commonService.timerConfig = { leftTime: 0, format: 'mm:ss', notify: 0 };
                          this.commonService.valetStatus = 'awaiting';
                        }
                        
                      } else if (this.valet_status == 'vehicle_ready') {
                        this.userService.vehicle.delivery_time = Number(result.data.delivery_time);
                        this.userService.vehicle.valet_delay = Number(result.data.delay)
                        let d_date: any = moment(new Date(this.userService.vehicle.delivery_time), 'mm:ss');
                        let r_date: any = moment(new Date(), 'mm : ss');			
                        let duration = d_date.diff(r_date, 'seconds');
                        //console.log("event.............", duration)
                        
          
                        console.log("event.............", duration	)
                           if(duration>0)
                           {
                        this.commonService.timerConfig = { leftTime: duration, format: 'mm:ss', notify: 0 };
                           }
                           else
                        {
                          this.commonService.timerConfig = { leftTime: 0, format: 'mm:ss', notify: 0 };
                        }
                      }
      
                    }
      
      
                
      
      
              
                  if (this.valet_status === 'awaiting' || this.valet_status === 'on_hold' || this.valet_status === 'confirmed' || this.valet_status === 'vehicle_ready' || this.valet_status === 'vehicle_re_ready' || this.valet_status === 're_confirmed' || this.valet_status === 'vehicle_parked' || this.valet_status === 'delivered' || this.valet_status === 're_request') {
                    if(this.valet_status == 're_request')
                    {
                      this.commonService.valetStatus = 'awaiting'
                    }
                    else
                    {
                      this.commonService.valetStatus = this.valet_status;
                    }
                    
                    document.getElementById("openValetStatusOpenModal").click();
                  }
                this.status = true
                //return this.status;
                }
              }
              else {
      
                this.status = false;
                //return this.status;
              }
            })
          }
      
        
          
        });
  
  
      }
  
      let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
  
      if (orderType == 'in_house') {
        this.orderTypeFlag = 'View Bill';
        this.orderContent = 'Order Now'
        this.take_aways = false;
      } else {
        this.orderTypeFlag = 'View Orders';
        this.orderContent = 'Order Food'
        this.take_aways = true;
        //console.log(localStorage.getItem('order_again'));
        // if (localStorage.getItem('order_again')) {
        // 	this.userService.ORDER_AGAIN();
        // }
      }
      console.log("take aways..............", this.take_aways)
  
      if (localStorage.getItem('payment_status') == 'paid') {
        // document.getElementById('tooltipdiv').setAttribute('data-tooltip','Tab to see your order.');
        // document.getElementById('tooltipdiv').classList.add('tooltip-bottom');
        let orderType = JSON.parse(localStorage.getItem('restaurant_details')).order_type;
        if (orderType == 'in_house') {
          this.hideBubble = false;
        } else {
          this.hideBubble = true;
          // this.snackBar.BILLSETTLEMENTINPROGRESS("View your order status here!",'OKAY')
        }
  
      }
      // push subscription
      if (environment.production && !localStorage.getItem('device_token')) {
        this.swPush.requestSubscription({ serverPublicKey: environment.server_public_key })
          .then(subscription => {
            localStorage.setItem('device_token', JSON.stringify(subscription))
          })
          .catch(err => {
            console.error("Could not subscribe to notifications", err)
          });
      }
  
      
      let user_Details = JSON.parse(localStorage.getItem('user_details'));
  
      if (orderType == 'in_house') {
  
        if (user_Details) {
  
          this.apiService.PLACED_ORDERS().subscribe(result => {
            console.log("placed orders2kjbhjbjhb....", result);
            if (result.status) {
              if (result.orders.order_list.length) {
  
                // console.log("orders found....");              
                this.userService.placed_order_status = true;
                /** Awaiting  strip */
                this.userService.order_number = result.orders.order_number;
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
  
  
      console.log('oniniti..............', this.userService.showExit)
  }
  categoryList(x)
	{
		this.loaderStatus=true;
		localStorage.setItem('selected_tag_name',x._id);
    	localStorage.setItem('selected_tag_header',x.header);
		//this.router.navigate(['/menu/categories/tag']);
	}


	departPopup(modalName)
	{
		this.restaurant_details.departments.filter((j) => { 
			if(j._id === localStorage.getItem("selected_section_name"))
			{
			  this.sectionHeader = j.header
		
			  
		if(j.popup)
		{
			if(j.pop_up_banners && j.pop_up_banners.length)
			{
				this.popupBanner =  j.pop_up_banners.filter((j) => j.visibility === 'visible');
				console.log("popup Banner.........",this.popupBanner)
				if(this.popupBanner.length)
				{
				 
					modalName.show();
			  
					this.restaurant_details = JSON.parse(localStorage.getItem('restaurant_details'));
					this.restaurant_details.departments.forEach(element => {
						if(j.header === element.header)
						{
					  	  element.popup = false;
						}
					});
					localStorage.setItem('restaurant_details', JSON.stringify(this.restaurant_details));				
					this.popupheader = j.header;
					setTimeout(() => { 
						new Swiper('.carousal_2', {
							speed: 800,
							loop: true,
							autoplay: {
							  delay: 4000,
							  disableOnInteraction: false
							},
						  
						  });
					 }, 500);
				}
				
				
			}
			
		}
			}
		  });
	
	}
	
	popup_linked_category(id)
		{
			this.loaderStatus = true;
			localStorage.setItem('selected_tag_name',id);
			let data ={};
	
			let t = this.restaurant_details.menu_category.filter((j) => 
			{
			if(j._id === id)
			{
				j.popup = true;
				data = j;
			}
			});
	
			let category = data;
			localStorage.setItem('selected_category', JSON.stringify(category));
			this.router.navigate(['/menu/items'])
		}

  onWaiterCall(userModal, serviceModal) {
		this.page_redirect = null;
		this.selected_quick_option = null;
		let quickOptions = this.restaurant_details.quick_options;

		quickOptions.filter((service) => {
			if (service.name === "call waiter") this.selected_quick_option = service;
		});

		// console.log(this.selected_quick_option);

		if (localStorage.getItem('user_details')) {
			this.onServiceConfirm(this.selected_quick_option).then((result: any) => {
				console.log(result);
				if (result.status) {
					serviceModal.hide();
				}
				else {
					console.log('response', result.response);
				}

			});
			this.snackBar.OPEN('A waiter will assist you shortly.', 'Close');
			serviceModal.hide();

		}
		else {
			serviceModal.hide();
			this.mobile_num = "";
			this.userService.continueBtn = false;
			this.userService.loginSocialDisable = true;
			this.isReadonly  = false;		
			this.socialLogo = true;			
	  	userModal.show();
		}
	}


  onServiceConfirm(selectedQuickOption) {
		return new Promise((resolve, reject) => {
			// if(reject){
			//  console.log("reject...", reject);
			// }
			let type_id;
			let order_type;
			if(this.restaurant_details.order_type === 'in_house')
			{
			type_id = this.restaurant_details.table_id;
			order_type = this.restaurant_details.order_type
			}
			else
			{
				type_id = localStorage.getItem("pos_order_id");
				order_type = this.restaurant_details.order_type;	
			}

			let sendData = {
				services: [{
					service_id: selectedQuickOption._id,
					name: selectedQuickOption.name,
					quantity: 1,
					free_service: true,
					called_on: "12/02/2015"	
				}],
				order_type: order_type,
				type_id : type_id	

			};
			console.log("quickservice senddata............", sendData)
			// service api
			this.apiService.CONFIRM_SERVICE(sendData).subscribe(result => {

				console.log("on service confirm....", result)
				if (result.status) {
					this.snackBar.OPEN('Your service call has been placed.', 'Close');
					resolve({ status: true });
				}
				else {
					resolve({ status: false, response: result });
				}
			});
		});
	}


  onKeyPress(event: any) {
		// this.values = event.target.value;
		this.otpForm.error_msg = "";
		this.userService.error_msg = "";
		console.log(event.target.value.length)

	 };

  onKeyUp(element){	
		let length = element.target.value.length ; //this will have the length of the text entered in the input box
		//console.log(element.target.value.length);
		this.userService.continueBtn = false;
		this.userService.loginSocialDisable = true;
			
		if(length === 10)
		{
			
			let sendData =
			{
				mobile : element.target.value,
				type:'checkmobile',
				company_id:this.restaurant_details.company_id,
				branch_id:this.restaurant_details.branch_id,
				user_type:'existing_user'
			}
			this.isReadonly = true;
			console.log("keyup data..........",sendData);
			this.apiService.CHECK_MOBILE_LOGIN(sendData).subscribe(result => {
			console.log("result Mobile..............", result);		
				if(result.data && result.data.activation === true)
				{
					this.userService.loginDetails = result.data;
					this.isReadonly = false;
					this.customer_id = result.data._id;
					this.userService.continueBtn = true;					
				}
				else{
					this.userService.loginSocialDisable = false;
					this.isReadonly = false;
				}

			})
		}
		else
		{
			this.userService.loginSocialDisable = true	
		}
	  }


	  continueSignin(newUserModal,newOTPModal)
	  {
		// newUSerModal.hide() ;
		// newOTPModal.show();
	//	this.social_data['mobile'] = this.mobile_num;
	
		let userData = this.social_data;	
				let sendUserData = {				
					'mobile': this.mobile_num,
					'customer_id' : this.customer_id,
					'otp_status':'sent',
					'user_type':'existing_user',
					'type':'sentotp',
					'company_id':this.restaurant_details.company_id,
					'branch_id':this.restaurant_details.branch_id,
					'smsType':environment.smsType,
					'smsUrl' : environment.smsUrl	
				}	

				this.userService.UPDATE_USER(sendUserData).then((userResp: any) => {
					console.log('userResp1....', userResp);
					// this.timeLeft = 60;
					// this.timeLeftString = '00 : 60';
					// this.startTimer();
					this.customer_id=userResp.customer_id;
				})
			
				newUserModal.hide();
				this.mobileShow = false;				
				this.otpForm.otp = "";
				this.sendOTP = true;
				newOTPModal.show();


	  }
	  
	  signinVerify(newOTPModal)
	  {
		this.loaderStatus = true;
		console.log("otp value.........", this.otpForm.otp)
		let sendUserData = {				
			'mobile': this.mobile_num,
			'customer_id' : this.customer_id,
			'otp_status':'verified',
			'type':'otpverify',
			'otp': String(this.otpForm.otp),
			'company_id':this.restaurant_details.company_id,
			'branch_id':this.restaurant_details.branch_id,	

									
		}	
		console.log("senddata............",sendUserData );
		this.apiService.UPDATE_EXISTING_USER(sendUserData).then(result => {
			console.log('SAVE_SOCIAL_USER....', result);
			console.log("result", result);			
			if(result.status)
			{
				if(result.data.user_id)
				{
					let userData = {
						id: result.data.user_id,
						social_unique_id: result.data.user_id,
						name: result.data.name,
						email: result.data.email,
						mobile: result.data.mobile,				
						provider: result.data.third_party_provider,
						photoUrl: result.data.photo_url,
						user_type: result.data.user_type
					}
					console.log("true2..........", userData)
					this.social_login_user(userData, newOTPModal);
				}
			   else
			   {
				let userData = {
					id: result.data._id,
					social_unique_id: result.data._id,
					name: result.data.name,
					email: result.data.email,
					mobile: result.data.mobile,	
					email_confirmed: result.data.email_confirmed,			
					provider: 'Dinamic',					
					user_type: result.data.user_type,
					status:result.status
				}
				console.log("true1..........", userData)
				this.email_login_user(userData, newOTPModal);
			   }
				
				
			}
			else
			{

				this.otpForm.error_msg = result.message;
				// this.otpForm.otp = "";
				this.sendOTP = true;
				this.resendOTP = true;
				this.loaderStatus = false;
			}
		
		})
		this.mobileShow = false;				
		this.otpForm.otp = "";
		this.sendOTP = true;
	//	newOTPModal.hide();

	  }

	  email_login_user(userData, newOTPModal)
	  {
		this.userService.LOGIN(userData).then((result: any) => {
			console.log('user login....', result);
			if (result.status) {				
				newOTPModal.hide();
				this.loaderStatus = false;
				if (this.selected_quick_option.name == 'bill')
					this.router.navigate(['/bill/view']);
				else if (this.selected_quick_option)
					this.onServiceConfirm(this.selected_quick_option);
			}
			else{
				this.loaderStatus = false;
				this.loginForm.error_msg = result.message;
			} 
		});
	  }

	  social_login_user(userData, newOTPModal)
	  {
		this.userService.SOCIAL_APP_LOGIN(userData).then((result: any) => {
			
			if (result.status) {
				this.userService.user_name =userData.name;
			    this.photo_url =  userData.photoUrl;
				   newOTPModal.hide();
				   this.loaderStatus = false;
				   if(userData.user_type === 'existing_user')
				   {
					this.apiService.GET_BILL().subscribe(result => {
						console.log('oms bills.....', result);
						if (result.status) {						
							this.ngOnInit();
							let bills = result.bills.bills;
							let check_currentuser_ordered = bills.filter(ss => ss.orderer_name === userData.name);
							console.log('bills....', check_currentuser_ordered);
	
							if (check_currentuser_ordered.length) {
								this.userService.showOrderNow = true;
								this.userService.showExit = true;
							
								if (!this.take_aways) {
									this.router.navigate(['bill/confirm']);
								}
								else {
	
								}
	
							} else {
								this.userService.showOrderNow = false;
							}
						} else {
							this.userService.showOrderNow = false;
							if (this.selected_quick_option.name == 'bill')
										this.router.navigate(['/bill/view']);
									else if (this.selected_quick_option)
										this.onServiceConfirm(this.selected_quick_option);

						}
					})
				   }
				
			}
			else this.signupForm.error_msg = result.message;
		});
	  }
	  socialSignIn(modalName, socialPlatform: string, otpModal) {
		let socialPlatformProvider;
		this.userService.usableLink = false;
		this.loaderStatus = true;
		if (socialPlatform == "facebook") {
			console.log("success2............")
			socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;

		}
		else if (socialPlatform == "google") {
			socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
			console.log("success1............")
			if(socialPlatformProvider)
		{
			console.log("success............")
		}
		else
		{
			console.log("false............")
		}

		}

		console.log("HAndle socialPlatformProvider............", socialPlatformProvider)
		if(socialPlatformProvider)
		{
			console.log("success............")
		}
		else
		{
			console.log("false............")
		}

		this.socialAuthService.signIn(socialPlatformProvider).then((userData: any) => {
			console.log("social data...", userData);

			let sendData = {
				email: userData.email
			}
	        this.social_data = userData;
			
			this.userService.usableLink = true;
			// this.apiService.CHECK_MOBILE_SOCIAL_LOGIN(sendData).subscribe(result => {
			// 	console.log("result Login................", result)
			// 	if (result.status === true && result.data.activation === true) {
			// 		this.social_data = userData;							
			// 	    this.userService.error_msg = result.message;

			// 	} else {
				//	this.social_data = userData;
				
					console.log("ask_mobile Data", this.social_data)
					modalName.hide();
					
					this.social_data['mobile'] = this.mobile_num;
          
					console.log('user social login details....', this.social_data);
					console.log("social data...", userData);		
					let sendUserData = {
					user_id: userData.id,
					social_unique_id:userData.id,
					name: userData.name,
					email: userData.email,
					mobile: userData.mobile,
					email_confirmed: true,
					photo_url:userData.photoUrl,
					third_party_provider: userData.provider,
					'password': '13579',
					social_user:this.social_data,
					company_id:this.restaurant_details.company_id,
					branch:{branch_id:this.restaurant_details.branch_id, count:0},
					user_type:'new_user',
					smsType:environment.smsType,
					'smsUrl' : environment.smsUrl,
					count:0													
					}
				this.userService.SAVE_SOCIAL_USER(sendUserData).then((result: any) => {
					console.log('userResp1....', result);
					if(result.status)
					{		
						this.customer_id = result.customer_id;				
						this.timeLeft = 60;
						this.userService.loginDetails = result.data;
						modalName.hide();
						this.mobileShow = false;
						this.otpForm.otp = "";
						this.sendOTP = true;
						this.loaderStatus = false;
						otpModal.show();
					}
					else
					{
						this.loaderStatus = false	;
					}
				})
			// 	}
			// }, err => {
			// 	console.log("Google err............", err)
			// })
		}, err => {
			this.loaderStatus = true;
			console.log("Google err1............", err);
			this.userService.usableLink= true;
		});

	}

	OTPCloseModal(modalName)
	{
	   modalName.hide();
	   this.loaderStatus = false;
	}
	userEmailCheck(modalName) {
		// console.log(this.loginForm)
		this.passwordMismatch = true;
		if (this.loginForm.name) {
			// console.log("password and confirm");
					this.enterEmailField = true;
					this.enterOtpField = false;
					this.enterNameField = true;				
					this.enterPasswordField = true;
					this.confirmPasswordField = true;
					this.mob_num_exist = false;
				
		
				this.userService.pass_error = ""
				this.passwordMismatch = false;
				this.loaderStatus = true;
				//this.pleasewait = true;

				if(environment.password === false)
				{
					this.loginForm.password = '123456'
					this.loginForm.confirm_password = '123456'
				}
				
				let newSignupForm = {
					'email': this.loginForm.username,
					'name': this.loginForm.name,
					'surname': this.loginForm.surname,
					'mobile': this.mobile_num,
					'password': this.loginForm.password,
					'confirm_password': this.loginForm.confirm_password,
					"company_id":this.restaurant_details.company_id,
					"branch":{"branch_id":this.restaurant_details.branch_id, count:0},
					"smsType":environment.smsType,
					'smsUrl' : environment.smsUrl
				}

				console.log("Signup Details...", newSignupForm)

				this.apiService.DINAMIC_SIGNUP(newSignupForm).subscribe(result => {
					//  this.signupForm.submit = false;
					console.log("signup result Data.........", result)
					if (result.status) {
					//	this.pleasewait = false;
						this.loaderStatus = false;
						this.customer_id = result.customer_id;
						this.user_name =  result.name; 
						let sendData = {
							"user": this.customer_id,
							"company_id":this.restaurant_details.company_id,
							"branch_id":this.restaurant_details.branch_id,
							"userBaseURL":environment.userBaseURL
						}
						this.apiService.SEND_CONFIRM_EMAIL_LINK(sendData).subscribe(result => {
							console.log("mail result...", result);
							if(result.status)
							{
								this.loaderStatus = false;

							}
							else
							{
								this.loaderStatus = false;
							}
				
						})
					
						this.enterPasswordField = false;
						this.confirmPasswordField = false;
						this.enterNameField = false;	
						this.mob_num_exist = false;
						this.enterOtpField = true;
						//this.loginForm.name = "";
						//this.loginForm.password = "";
						//this.loginForm.confirm_password = "";
					}
					else {
						console.log('response', result);
						this.loaderStatus = false;
						//this.pleasewait = false;						
						this.loginForm.error_msg = result.message;
						this.signupForm.error_msg = result.message;
					}
				});

			

		}

		else if(this.loginForm.password)
		{
			this.userService.LOGIN(this.loginForm).then((result: any) => {
				console.log('user login....', result);
				if (result.status) {
					this.ngOnInit();
					modalName.hide();
					if (this.page_redirect) {
						console.log(this.page_redirect);
						if (this.page_redirect === '/myorder') {
							this.router.navigate(['/myorder']);
						} else {
							if (this.page_redirect === '/myoder') {
								this.router.navigate(['/myorder']);
							} else {
								this.router.navigate([this.page_redirect]);
							}
						}
					}
					else if (this.selected_quick_option)
						this.onServiceConfirm(this.selected_quick_option);
				}
				else this.loginForm.error_msg = result.message;
			});
		}
	
		else if (this.loginForm.username) {					
					
					this.enterEmailField = false;				
					this.enterNameField = false;
					this.enterPasswordField = true;
					this.confirmPasswordField = true;
					this.enterOtpField = false;
					this.mob_num_exist = false;
					//this.loginForm.name = "";
					this.loginForm.password = "";

			
		}

	}

	userOtpValidate(modalName) {
    console.log("validate initiated...", this.customer_id)
   this.loaderStatus = true;
   //clearInterval(this.interval);
   if (this.otpForm.otp !== '') {
     this.userService.SIGNUP_OTP_VALIDATE({ customer_id: this.customer_id, otp: String(this.otpForm.otp) }).then((result: any) => {
       console.log("OTP Result.....", result)
       if (result.status) {
         // console.log("validation successfull...")
         // this.ngOnInit();
         // this.userService.user_name = ;
         this.loaderStatus = false;
         modalName.hide();
         if (this.page_redirect)
           this.router.navigate([this.page_redirect]);
         else if (this.selected_quick_option)
           this.onServiceConfirm(this.selected_quick_option);
       }
       else {
         this.loaderStatus = false;
         this.otpForm.error_msg = result.message;
           console.log("error OTP")
       };
     });
   }

 }

  closeLogin() {
		// console.log("jhggeghjhegbj");
		this.enterEmailField = true;
		this.enterOtpField = false;
		this.enterNameField = true;
		this.enterMobileField = false;
		this.enterSurNameField = false;
		this.enterPasswordField = false;
		this.confirmPasswordField = false;
		this.pleasewait = false;
		this.mob_num_exist = false
		this.loginForm = {};
		clearInterval(this.interval);
	}

	goBack(m1,m2)
	{
		if(this.enterEmailField)
		{
		m1.hide();
		this.closeLogin()
		m2.show()
		}
		else if(this.enterNameField && this.enterPasswordField && this.confirmPasswordField)
		{
		this.enterEmailField = true;
		this.enterOtpField = false;
		this.enterNameField = true;
		this.enterPasswordField = false;
		this.confirmPasswordField = false;
		this.pleasewait = false;
		this.loginForm.confirm_password = "";
		this.loginForm.password=""
		this.mob_num_exist = false
		}
		
		
					
				
	}

}
