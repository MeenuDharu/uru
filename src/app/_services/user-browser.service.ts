import { Injectable } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class UserBrowserService {
  deviceData:any;
  alterUrl:any;
  isChrome:boolean = false;
  public deviceInfo = null;
  public isMobilevar = false;
  public isTabletvar = false;
  public isDesktopvar = false;
  constructor(private deviceService: DeviceDetectorService) { }
  browserStatus()
  {
    this.deviceData = this.deviceService.getDeviceInfo();
    if(this.deviceData.browser === 'Chrome')
		{
      this.isChrome = true;
      this.alterUrl =  'assets/images/Dinamic_Logo.webp'
		}
		else
		{
      this.isChrome = false;
      this.alterUrl = 'assets/images/Dinamic_Logo.png'
    }
    console.log('browser chrome..............', this.isChrome)
  }


  	public detectDevice() {
		this.deviceInfo = this.deviceService.getDeviceInfo();
		console.log("this.deviceInfo..........", this.deviceInfo)
	  }
	
	  public isMobile() {
		this.isMobilevar = this.deviceService.isMobile();
		return this.isMobilevar
	  }
	
	  public isTablet() {
		this.isTabletvar = this.deviceService.isTablet();
		return this.isMobilevar
		console.log("this.isTabletvar..........", this.isTabletvar)
	  }
	
	  public isDesktop() {
    this.isDesktopvar = this.deviceService.isDesktop();
    return this.isDesktopvar
		console.log("this.isDesktopvar..........", this.isDesktopvar)
    }
    
}
