import { Directive, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
declare const Swiper: any;
declare const $: any;

@Directive({
  selector: '[appPopupSwiper]'
})
export class PopupSwiperDirective {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private _element: ElementRef) { }
  ngAfterViewInit() {
    let classList1: any = this._element.nativeElement.classList;
    console.log("classlist...............", classList1)
   // for(let i=0; i<classList.length; i++) {
     // if(classList[i].includes("carousal_")) {
        let swipeElement = 1;
      //  if(isPlatformBrowser(this.platformId)) {
          // carousal
          
         // if(swipeElement.includes("carousal_")) {
           
            new Swiper('.carousal_2', {
              speed: 700,
              loop: true,
              autoplay: {
                delay: 3000,
                disableOnInteraction: false
              },
              // pagination: {
              //   el: '#swipe_pagination_'+swipeElement.split("_")[1],
              //   clickable: true
              // },
              // navigation: {
              //   nextEl: '#swipe_next_'+swipeElement.split("_")[1],
              //   prevEl: '#swipe_prev_'+swipeElement.split("_")[1]
              // }
            });
        //  }
        
          // hover event
          // if(swipeElement.includes("desktop")) {
          //   $('.'+swipeElement).hover(function () {
          //     (this).swiper.autoplay.stop();
          //   }, function () {
          //     (this).swiper.autoplay.start();
          //   });
          // }
       // }
      //  break;
      //}
   // }
  }

}
