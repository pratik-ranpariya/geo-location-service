import { ToastrService } from 'ngx-toastr';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { LoginService } from './login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements  OnInit{
  loginForm: FormGroup;
    loading = false;
    submitted = false;
    constructor(private _formBuilder: FormBuilder,
      private _router: Router,
      private _loginService: LoginService,
      private toastService: ToastrService,
      ) {
  }
  ngOnInit() {
  this.buildLoginForm();
  }
  get f() { return this.loginForm.controls; }
  onSubmit() {
  this.submitted = true;
  if (this.loginForm.invalid) {
    return;
  }
  // this.spinner.show();
  this._loginService.post(this.loginForm.value).subscribe((response: any) => {
    // this.spinner.hide();
    if (response.code == 200) {
      this.toastService.success(response.message);
      localStorage.setItem('_token', JSON.stringify(response.token))
      this._router.navigate(['/categories']);
    }
    else {
      this.toastService.error(response.message);
    }
  }, error => {
    this.toastService.error(error.message);
  });
}
  buildLoginForm() {
  this.loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
    password: ['', [Validators.required]]

  });
}
  remember() {
}
 }
