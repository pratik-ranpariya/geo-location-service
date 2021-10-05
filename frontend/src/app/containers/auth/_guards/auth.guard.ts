import { AuthenticationService } from './../_services/authentication.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

import { Observable } from "rxjs/Rx";
import { ToastrService } from 'ngx-toastr';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private _router: Router, private _authService: AuthenticationService, private toastService: ToastrService,
		// private spinnerService: Ng4LoadingSpinnerService
	) {

	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
		let currentUser = JSON.parse(localStorage.getItem('_token'));
		if (currentUser) {
			// this.spinnerService.show();
			this._authService.verify().subscribe(data => {

				// this.spinnerService.hide();
				if (data.status == 0) {
					this._router.navigate(['/login'])
					// this.toastService.success(data['message']);

				}
			})
			return true;
		} else {
			this._router.navigate(['/login'])
			return false;
		}
	}

}