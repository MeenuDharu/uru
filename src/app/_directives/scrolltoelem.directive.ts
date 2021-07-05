import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import * as $ from 'jquery';

@Directive({
	selector: '[appScrolltoelem]'
})
export class ScrolltoelemDirective {
	// @Output() public appDeferLoad: EventEmitter<any> = new EventEmitter();
	private _intersectionObserver?: IntersectionObserver;
	constructor(private _element: ElementRef) { }
	public ngOnInit() {
		console.log("element....", this._element.nativeElement);
		this._intersectionObserver = new IntersectionObserver(entries => {
			// console.log("entries...", entries);
			this.checkForIntersection(entries);
		}, {});
		this._intersectionObserver.observe(<Element>(this._element.nativeElement));
	}
	private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
		entries.forEach((entry: IntersectionObserverEntry) => {
			if (this.checkIfIntersecting(entry)) {
				// $("#tab2").find(".product-image > img").addClass('lazypreload');
				// $('#scr_elem')
				console.log('entry....', entry);
				document.getElementById('scr_elem').classList.add('d-none');
				// this.appDeferLoad.emit();             
			} else {
				let elem = document.getElementById('scr_elem');
				if (elem) {
					elem.classList.remove('d-none');
				}
			}
		});
	}
	private checkIfIntersecting(entry: IntersectionObserverEntry) {
		return (<any>entry).isIntersecting && entry.target === this._element.nativeElement;
	}
}