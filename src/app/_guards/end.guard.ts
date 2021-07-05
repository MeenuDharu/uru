import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './../_services/api.service';

@Injectable({
	providedIn: 'root'
})
export class EndGuard implements CanActivate {

	constructor(private router: Router, private apiService: ApiService) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {

		if (localStorage.getItem('session_status')) {
			this.router.navigate(['/bill/confirm']);
			return false;
		}
		else {
			return true;
		}

	}
}
