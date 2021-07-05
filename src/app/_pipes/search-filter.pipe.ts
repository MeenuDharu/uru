import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

	transform(items: any[], field: string, value: string): any[] {
		if (!items) {
			return [{ notFound: true }];
		}
		else if (!value || value.length == 0) {
			return items;
		}
		else {
			// let firstKey = Object.keys(value);
			// console.log('first key....', firstKey);
			let filterItems = items.filter(it => it[field].toLowerCase().indexOf(value.toLowerCase()) != -1);
			if (filterItems.length) {
				// console.log('filter items....', filterItems);
				return filterItems;
			} else return [{ notFound: true }];
		}
	}

	// transform(items: any[], filter: any): any[] {
	//   // console.log('items....', filter);
	//   if(!items) return [{ notFound: true }];
	//   else
	//   {
	//     let firstKey = Object.keys(filter)[0];

	//     if(filter[firstKey] && filter[firstKey] != undefined)
	//     {
	//       console.log('filter[firstKey].....', Array.isArray(items))
	//       if(filter && Array.isArray(items))
	//       {
	//         let filterKeys = Object.keys(filter);
	//         return items.filter(item => {
	//           return filterKeys.some((keyName) => {
	//             return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
	//           });
	//         });
	//       }else{
	//         return [{ notFound: true }];
	//       }
	//     }
	//     else return items;
	//   }

	// }

}


