import {Directive, Input, HostBinding} from '@angular/core'
import { environment } from '../../environments/environment';
import {DeviceDetectorService} from 'ngx-device-detector';

@Directive({
  selector: 'img[appPopupMgBroken]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }
})
export class PopupMgBrokenDirective {
  @Input() src:string;
  constructor(private deviceService: DeviceDetectorService){}

  
  updateUrl() {
   this.src = 'assets/images/default_image.png';

  }

}
