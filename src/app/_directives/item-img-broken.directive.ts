import {Directive, Input, HostBinding} from '@angular/core'
import { environment } from '../../environments/environment';
import {DeviceDetectorService} from 'ngx-device-detector';

@Directive({
  selector: 'img[appItemImgBroken]',
  host: {
    '(error)': 'updateUrl()',
    '[ImagelazyLoad]': 'src',
    '[style]':'display:none'
  }
})
export class ItemImgBrokenDirective { 
  @Input() src:string;
  constructor(private deviceService: DeviceDetectorService){}
  baseUrl = environment.img_url;
  
  updateUrl() {
   this.src = 'assets/images/dinamic-blogo.webp';

  }
}
