import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
	providedIn: 'root'
})
export class SnackbarService {

	constructor(public snackBar: MatSnackBar) { }

	OPEN(message: string, action: string) {
		this.snackBar.open(message, action, {
			duration: 4000,
		});
	}

	BILLSETTLEMENTINPROGRESS(message: string, action: string) {
		this.snackBar.open(message, action);
	}
	BILLSETTLEMENTINPROGRESSCLOSE() {
		this.snackBar.dismiss();
	}
	CLOSE() {
		this.snackBar.dismiss();
	}

}