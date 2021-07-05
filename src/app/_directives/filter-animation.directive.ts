import { Directive, ElementRef, EventEmitter, Output, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFilterAnimation]'
})
export class FilterAnimationDirective {

  constructor(private el: ElementRef) { }

  ngOnInit(){
    // console.log('filter elements.....', this.el.nativeElement);
  }

}
