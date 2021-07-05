import {Directive, Input, HostBinding} from '@angular/core'

@Directive({
  selector: 'img[appCatImgBroken]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  }

})
export class CatImgBrokenDirective {
  @Input() src:string;


  updateUrl() {
    this.src = "assets/images/list.svg";
    
  }


}
