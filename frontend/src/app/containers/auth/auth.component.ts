
import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { AlertService } from './_services/alert.service';

import { AlertComponent } from './_directives/alert.component';

declare let $: any;
declare let mUtil: any;
// /home/nami/Documents/BLE/frontend/BLE_admin_frontend/src/app/views/login/login.component.html
@Component({
  selector: '.m-grid.m-grid--hor.m-grid--root.m-page',
  templateUrl: '../../views/login/login.component.html',
  // templateUrl: './templates/login-1.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class AuthComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  @ViewChild('alertSignin',
      {read: ViewContainerRef}) alertSignin: ViewContainerRef;
  @ViewChild('alertSignup',
      {read: ViewContainerRef}) alertSignup: ViewContainerRef;
  @ViewChild('alertForgotPass',
      {read: ViewContainerRef}) alertForgotPass: ViewContainerRef;

  constructor(
      private _router: Router,
   
      private _route: ActivatedRoute,
      private _authService: AuthenticationService,
      private _alertService: AlertService,
      private cfr: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.model.remember = true;
    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    this._router.navigate([this.returnUrl]);
  }

  signin() {
    
    this.loading = true;
    this._authService.login().subscribe(
        data => {
          this._router.navigate([this.returnUrl]);
        },
        error => {
          this.showAlert('alertSignin');
          this._alertService.error(error);
          this.loading = false;
        });
  }


  showAlert(target) {
    this[target].clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = this[target].createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }

}