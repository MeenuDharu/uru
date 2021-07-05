import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'unicodeFiler'
})
export class UnicodeFilerPipe implements PipeTransform {

	transform(value: any, args?: any): any {
		if (value == 0) {
			return "\u24EA";
		} else if (value == 1) {
			return "\u2460";
		} else if (value == 2) {
			return "\u2461";
		} else if (value == 3) {
			return "\u2462";
		} else if (value == 4) {
			return "\u2463";
		} else if (value == 5) {
			return "\u2464";
		} else if (value == 6) {
			return "\u2465";
		} else if (value == 7) {
			return "\u2466";
		} else if (value == 8) {
			return "\u2467";
		} else if (value == 9) {
			return "\u2468";
		} else if (value == 10) {
			return "\u2469";
		} else if (value == 11) {
			return "\u246A";
		} else if (value == 12) {
			return "\u246B";
		} else if (value == 13) {
			return "\u246C";
		} else if (value == 14) {
			return "\u246D";
		} else if (value == 15) {
			return "\u246E";
		} else if (value == 16) {
			return "\u246F";
		} else if (value == 17) {
			return "\u2470";
		} else if (value == 18) {
			return "\u2471";
		} else if (value == 19) {
			return "\u2472";
		} else if (value == 20) {
			return "\u2473";
		} else {
			return "\u24EA";
		}
	}

}
