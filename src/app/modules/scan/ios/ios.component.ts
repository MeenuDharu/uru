import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../_services/api.service';
import { QrcodeReaderService } from '../../../_services/qrcode-reader.service';
import {DeviceDetectorService} from 'ngx-device-detector';
@Component({
  selector: 'app-ios',
  templateUrl: './ios.component.html',
  styleUrls: ['./ios.component.css']
})
export class IosComponent implements OnInit {

  subscription: Subscription;
  deviceData:any;
isChrome:boolean = false;
  constructor(private router: Router, private apiService: ApiService, private qrReader: QrcodeReaderService,private deviceService: DeviceDetectorService
    ) { }
    ngOnInit() {
      this.deviceData = this.deviceService.getDeviceInfo();
      if(this.deviceData.browser === 'Chrome')
      {
        this.isChrome = true;
       
      }
      else
      {
        this.isChrome = false;
       
      }
    }
    
  onFileChange(event) {
    this.subscription = this.qrReader.decode(event.target.files[0]).subscribe(decodedString => {
      let res = decodedString.split("#");
      if(res[1] && res[1]!='') this.router.navigate([res[1]]);
      else document.getElementById("openModal").click();
    });
  }

}
