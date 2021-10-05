// import { Helpers } from './../../helpers';
import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {Router} from "@angular/router";
// import {AuthenticationService} from "../_services/authentication.service";

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	encapsulation: ViewEncapsulation.None,
})

export class LogoutComponent implements OnInit {

	constructor(private _router: Router,
	          ) {
	}
	ngOnInit(){

	}

	// ngOnInit(): void {
	// 	Helpers.setLoading(true);
	// 	// reset login status
	// 	this._authService.logout();
	// 	this._router.navigate(['/login']);
	// }
}