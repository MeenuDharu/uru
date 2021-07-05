import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'myFilter'
})
export class MyFilterPipe implements PipeTransform {

	transform(items: any[], field: string, value: string): any[] {
		if (!items) {
			return [{ notFound: true }];
		}
		else if (!value || value.length == 0) {
			return items;
		}
		else {
			let filterItems = items.filter(it => it[field] === value);
			if (filterItems.length) return filterItems;
			else return [{ notFound: true }];
		}
	}

}
