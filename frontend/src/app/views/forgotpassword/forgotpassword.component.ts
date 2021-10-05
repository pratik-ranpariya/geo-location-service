import { ToastrService } from 'ngx-toastr';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ForgotpasswordService } from './forgotpassword.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  forgotpasswordForm: FormGroup;
  loading = false;
  submitted = false;
  constructor(private _formBuilder: FormBuilder,
    private Service: ForgotpasswordService,
    private toastService: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
    this.buildforgotpasswordForm();
  }
  get f() { return this.forgotpasswordForm.controls; }
  buildforgotpasswordForm() {
    this.forgotpasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.forgotpasswordForm.invalid) {
      return;
    }
    this.spinner.show();
    this.Service.post(this.forgotpasswordForm.value).subscribe((response: any) => {
      this.spinner.hide();
      if(response.code==404){
        this.toastService.error("Email not Found");
      }else if(response.code=200){
        this.toastService.success("we have sent Reset Password link in mail");
        this.router.navigate(['/login']);
      }
      //success code here
    }, error => {
      // this.spinnerService.hide();
      this.toastService.error(error.message);
    });
  }
}
