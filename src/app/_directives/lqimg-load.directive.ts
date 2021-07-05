import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import '../../assets/js/ls.unveilhooks';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import { lazySizes } from 'lazysizes';
import { environment } from '../../environments/environment';

@Directive({
  selector: '[appLqimgLoad]',
  host: { '(error)':'placeholder($event)', '(load)':'addBlur()' }
})
export class LqimgLoadDirective {

  @Input() ImagelazyLoad: any;
  public lqip_img : any;
  disp_style:any;
  constructor(private _element: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.lqip_img = "assets/images/placeholder.png";
    if(lazySizes) lazySizes.init();
    this.setAttributes();
  }

  setAttributes() {
    let imgPathName = "assets/images/placeholder.png";
    let imgArray = this.ImagelazyLoad.split(environment.img_url);
    if(imgArray.length==2)
    {
      let str =  environment.img_url+imgArray[1]
      var elems = str.split("/");
      elems.splice(elems.length-1, 0, "small")
      imgPathName = elems.join("/")
      this.disp_style = "display:block"
    }
    
    this.renderer.addClass(this._element.nativeElement, 'lazyload');

    let objImg: any = this._element.nativeElement;
    objImg.src = this.ImagelazyLoad;
    if(objImg.complete) {
      imgPathName = this.ImagelazyLoad;
      this.lqip_img = this.ImagelazyLoad;
      this.disp_style = "display:block"
    }

    // console.log("image", imgPathName);
    if(this._element.nativeElement.localName === 'img') {
      this.renderer.setAttribute(this._element.nativeElement, 'data-src', imgPathName);
      this.renderer.setAttribute(this._element.nativeElement, 'src', this.lqip_img);
      // if(imgPathName === 'assets/images/placeholder.png')
      // {
      //   this.renderer.setAttribute(this._element.nativeElement, 'style','display:none');
      // }
      // else
      // {
      //   this.renderer.setAttribute(this._element.nativeElement, 'style', 'display:block');
      // }
     
     // this.renderer.setAttribute(this._element.nativeElement, 'display', this.lqip_img);
    }
    else {
    //  this.renderer.setAttribute(this._element.nativeElement, 'style', "display:none");
      this.renderer.setAttribute(this._element.nativeElement, 'data-bg', imgPathName);
      this.renderer.setStyle(this._element.nativeElement, 'background-image', `url(${this.lqip_img})`);
    }
  }

  placeholder(event) {
    // console.log(event)
    if(event.type === 'error')
    {
      this.renderer.setAttribute(this._element.nativeElement, 'style', "display:none");
    }
    this.lqip_img = "assets/images/placeholder.png";
    this.ImagelazyLoad = "assets/images/placeholder.png";   
    // this.renderer.setAttribute(this._element.nativeElement, 'data-src',   this.ImagelazyLoad);
    // this.renderer.setAttribute(this._element.nativeElement, 'src', this.lqip_img);

     this.disp_style = "display:none";    
    //  console.log("placeholder")
     this.setAttributes();
  }

  addBlur() {
    if(this._element.nativeElement.src.indexOf('') === -1) {
      this.renderer.addClass(this._element.nativeElement, 'lq-blur-up');
    }
    
  }

}
