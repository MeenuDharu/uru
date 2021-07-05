import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'railwayToLocal'
})
export class RailwayToLocalPipe implements PipeTransform {

	transform(value: any, args?: any): any {

		// Check correct time format and split into components
		value = value.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [value];

		if (value.length > 1) { // If time format correct
			value = value.slice(1);  // Remove full string match value
			value[5] = +value[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
			value[0] = +value[0] % 12 || 12; // Adjust hours
		}
		return value.join(''); // return adjusted time or original string

	}

}
