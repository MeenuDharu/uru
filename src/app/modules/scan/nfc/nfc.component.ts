import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../_services/common.service';
import { ApiService } from '../../../_services/api.service';
import { UserService } from 'src/app/_services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../../../environments/environment';
import { UserBrowserService } from 'src/app/_services/user-browser.service';
@Component({
  selector: 'app-nfc',
  templateUrl: './nfc.component.html',
  styleUrls: ['./nfc.component.css']
})
export class NfcComponent implements OnInit {

  @ViewChild('openModal',  { static: true }) openModal: ElementRef;
  constructor(private http: HttpClient, private socket: Socket, private router: Router, private route: ActivatedRoute, private apiService: ApiService, private commonService: CommonService,
    public userService: UserService,private cookieService: CookieService,private browserService: UserBrowserService) { }
    loaderStatus:boolean;
    deviceData:any;
    alterUrl:any;
    isChrome:boolean = false;
    deviceStringCat:string;
    deviceStringLogo:string;
    deviceStringItem:string;

  ngOnInit() {
   // this.deviceData = this.deviceService.getDeviceInfo();
   console.log("base url................",location.origin);
   if(this.browserService.isChrome)
   {		
     this.alterUrl =  'assets/images/Dinamic_Logo.webp'
   }
   else
   {
     this.alterUrl =  'assets/images/Dinamic_Logo.png'
   }

 // this.actualData = this.deviceService.getDeviceInfo();
   // console.log("this.actualData........", this.actualData);
   //let string1 = this.detectDevice();

   //this.deviceData = this.browserService.browserStatus()
   console.log("device data..........", this.browserService.isChrome)
   if(this.browserService.isMobile())
   {
     this.deviceStringCat = 'small'
     this.deviceStringLogo = 'large';
     this.deviceStringItem = 'medium'
   }
   else if(this.browserService.isTablet())
   {
     this.deviceStringCat = 'medium'
     this.deviceStringLogo = 'large';
     this.deviceStringItem = 'medium'
   }
   else if(this.browserService.isDesktop())
   {
     this.deviceStringCat = 'medium';
     this.deviceStringLogo = 'large';
     this.deviceStringItem = 'large';
   }
   
    this.loaderStatus = true;
    this.route.params.subscribe((params: Params) => {
      // check access code
      if(localStorage.getItem("access_code")) {
        if(localStorage.getItem("access_code")!=params['code']) {
          localStorage.clear();
          //this.socket.disconnect();
          this.cookieService.deleteAll('/','.dinamic.io', true,'Strict');
          sessionStorage.clear();
        }
      }
      // device details
      this.commonService.DEVICE_DETAILS();

      // fullscreen
      // let elem = document.documentElement;
      // let methodToBeInvoked = elem.requestFullscreen || elem['webkitRequestFullScreen'] || elem['mozRequestFullscreen'] || elem['msRequestFullscreen'];
      // if (methodToBeInvoked) methodToBeInvoked.call(elem);
      // access code details
      this.apiService.ACCESS_CODE_DETAILS({"id": 'n', "code": params['code'], baseURL: environment.baseUrl}).subscribe(result => {
        console.log()
        if(result.status) {
          this.loaderStatus = false;

					if (localStorage.getItem("access_code")) {
						console.log("access_code",localStorage.getItem("access_code"))
						if (localStorage.getItem("access_code") != params['code']) {
							console.log("qr code doesnot match")
							let restaurant_det = JSON.parse(localStorage.getItem('restaurant_details'));
							
							if(restaurant_det.order_type === 'in_house')
							{
							this.socket.emit('leave_table', restaurant_det.table_id);
							console.log("In House", restaurant_det.order_type)
							}
							else
							{
							this.socket.emit('close_take_away',localStorage.getItem('pos_order_id'));	
							console.log("Take Away", restaurant_det.order_type)
							}
							localStorage.clear();
							sessionStorage.clear();
							this.cookieService.deleteAll('/', '.dinamic.io', true, 'Strict');
						}
						
					}

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
						var elems = str.split("/");
					    elems.splice(elems.length-1, 0, this.deviceStringCat)
						element.imageUrl = elems.join("/")
						
					});


					var departments =  result.branch_details[0].departments.sort((a, b) => {
						return a.department_order - b.department_order;
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
					console.log('result -------------------------', result);

					if(result.branch_details[0].has_department_module)
					{
						result.branch_details[0].departments.forEach(element => {
							if(element.pop_up_banners &&  element.pop_up_banners.length)
							{
								element.popup =true
							}
						});
					}

          console.log("location origin....", location.origin)
          
          if(result.dinamic_details.table_type=="location") {
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
                            isDepartment:result.branch_details[0].has_department_module,
							departments:departments ? departments : 'empty',
							menu_sections:result.branch_details[0].menu_sections ? result.branch_details[0].menu_sections : [{'header':'Order Now', 'name':'all', 'section_order': 1}],
							quick_options: result.branch_details[0].quick_options,
                            isBanner:isBanner,
							banner_images: isBanner ? result.branch_details[0].banner_images : 'empty'
						}
						localStorage.setItem('restaurant_details', JSON.stringify(restaurant_details));       
            this.userService.restaurant_gst = restaurant_details.gst;
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
              isDepartment:result.branch_details[0].has_department_module,
							departments:departments ? departments : 'empty',
							menu_sections:result.branch_details[0].menu_sections ? result.branch_details[0].menu_sections : [{'header':'Order Food', 'name':'all', 'section_order': 1}],
							quick_options: result.branch_details[0].quick_options,
              isBanner:isBanner,
							banner_images: isBanner ? result.branch_details[0].banner_images : 'empty'
						}
						localStorage.setItem('restaurant_details', JSON.stringify(restaurant_details));
            this.userService.restaurant_gst = restaurant_details.gst;
          }
          localStorage.setItem('access_code', params['code']);
          localStorage.setItem('access_type', result.dinamic_details.table_type);
          localStorage.setItem('dinamic_details', JSON.stringify(result.dinamic_details));
          this.router.navigate(['/home']);
        }
        else {
          console.log('response', result);
          this.loaderStatus = false;
          let openModal: HTMLElement = this.openModal.nativeElement as HTMLElement;
          openModal.click();
        }
      });
    });
  }

  closeModal(modalName) {
    modalName.hide();
    this.router.navigate(['/']);
  }

}
