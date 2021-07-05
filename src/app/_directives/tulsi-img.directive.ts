import { Directive, ElementRef, EventEmitter, Output, Input, Renderer2 } from '@angular/core';

import 'lazysizes/plugins/blur-up/ls.blur-up'
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
import { lazySizes } from 'lazysizes';

@Directive({
	selector: '[appTulsiImg]'
})
export class TulsiImgDirective {

	@Input() tulsi_img_url: any;
	@Input() img_base_url: any;

	@Output() public appTulsiImg: EventEmitter<any> = new EventEmitter();
	public tempImage: any = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
	// public tempImage: any = 'http://localhost:4200/assets/images/product_placeholder.svg'; // need to set the base url from server assets

	private _intersectionObserver?: IntersectionObserver;

	constructor(
		private _element: ElementRef,
		private renderer: Renderer2
	) { }

	ngOnInit() {
		// console.log(this.img_base_url);
		this.initLazyLoading();
		this.setAttributes();
	}

	initLazyLoading() {
		if (lazySizes) {
			lazySizes.init();
		}
	}

	setAttributes() {
		this.renderer.addClass(this._element.nativeElement, 'lazyload');
		this.renderer.addClass(this._element.nativeElement, 'blur-up');
		if (this._element.nativeElement.localName === 'img') {
			this.setImgSrc();
		} else {
			this.setElementBackgroundImage();
		}
	}

	setImgSrc() {
		this.renderer.setAttribute(this._element.nativeElement, 'data-src', this.tulsi_img_url);
		this.renderer.setAttribute(this._element.nativeElement, 'src', this.tempImage);
	}

	setElementBackgroundImage() {
		this.renderer.setAttribute(this._element.nativeElement, 'data-bg', this.tulsi_img_url);
		this.renderer.setStyle(this._element.nativeElement, 'background-image', `url(${this.tempImage})`);
	}


	//  public ngAfterViewInit () {    

	//     this._intersectionObserver = new IntersectionObserver(entries => {
	//         this.checkForIntersection(entries);
	//         // console.log('entries...', entries);
	//         console.log('img url...', this.tulsi_img_url);
	//         entries.forEach( entry => {
	//           if( entry.intersectionRatio > 0){
	//             console.log('target...', entry.target);
	//             entry.target.setAttribute('src', this.tulsi_img_url);
	//           }else{
	//             console.log('target...', entry.target);
	//           }
	//         })
	//     }, {});
	//     this._intersectionObserver.observe(<Element>(this._element.nativeElement));
	// }

	// private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {    
	//   entries.forEach((entry: IntersectionObserverEntry) => {
	//       if (this.checkIfIntersecting(entry)) {
	//           this.appTulsiImg.emit();
	//           this._intersectionObserver.unobserve(<Element>(this._element.nativeElement));
	//           this._intersectionObserver.disconnect();
	//       }
	//   });
	// }

	// private checkIfIntersecting (entry: IntersectionObserverEntry) {
	//       return (<any>entry).isIntersecting && entry.target === this._element.nativeElement;
	//   }

}
