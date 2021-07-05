import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';​
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
import { lazySizes } from 'lazysizes';
​import { environment } from '../../environments/environment';
import {DeviceDetectorService} from 'ngx-device-detector';

@Directive({
	selector: '[appLazyload]',
	exportAs: 'lazyload',
	host: { '(error)':'placeholder()' }
})
export class LazyloadDirective {
​ baseUrl = environment.img_url;
 deviceData:any;
 isChrome:boolean = false;
 @Input() ImagelazyLoad: any;
  public lqip_img : any;

  constructor(private _element: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
   
    let imgArray = this.ImagelazyLoad.split(environment.img_url);
  
    if(imgArray.length==2) 
    {
    let str =  environment.img_url+imgArray[1]
    var elems = str.split("/");
    elems.splice(elems.length-1, 0, "small")
    this.lqip_img = elems.join("/")}
    else {this.lqip_img = "";}
    if(lazySizes) lazySizes.init();
    this.setAttributes();
  }

  setAttributes() {
    this.renderer.addClass(this._element.nativeElement, 'lazyload');

    let objImg: any = this._element.nativeElement;
    objImg.src = this.ImagelazyLoad;
    if(objImg.complete) {
      this.lqip_img = this.ImagelazyLoad;
      this.renderer.removeClass(this._element.nativeElement, 'blur-up');
    }
    else {this.renderer.addClass(this._element.nativeElement, 'blur-up')};

    if(this._element.nativeElement.localName === 'img') {
      this.renderer.setAttribute(this._element.nativeElement, 'data-src', this.ImagelazyLoad);
      this.renderer.setAttribute(this._element.nativeElement, 'src', this.lqip_img);
    }
    else {
      this.renderer.setAttribute(this._element.nativeElement, 'data-bg', this.ImagelazyLoad);
      this.renderer.setStyle(this._element.nativeElement, 'background-image', `url(${this.lqip_img})`);
    }
  }

  placeholder() {
    this.lqip_img = "";
    this.ImagelazyLoad = "";
    this.setAttributes();
  }

}