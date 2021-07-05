import {Directive, Input, HostBinding} from '@angular/core'

@Directive({
  selector: '[appMenuSectionImgBroken]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }
})
export class MenuSectionImgBrokenDirective {
  @Input() src:string;


  updateUrl() {
    this.src = "assets/images/order-food.svg";
  }
}
