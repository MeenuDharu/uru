import {Directive, Input, HostBinding} from '@angular/core'

@Directive({
  selector: 'img[appLogoImgBroken]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }

})
export class LogoImgBrokenDirective {
  @Input() src:string;


  updateUrl() {
    this.src = "assets/images/Dinamic_Logo.svg";
  }
}
