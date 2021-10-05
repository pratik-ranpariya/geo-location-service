import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../categories.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
const URL = environment.API_URL
@Component({
  selector: 'app-editcategory',
  templateUrl: './editcategory.component.html',
  styleUrls: ['./editcategory.component.css']
})
export class EditcategoryComponent implements OnInit {
  categoryForm: FormGroup;
  submitted = false;
  @Input() categoryid;
  @Input() name;
  @Input() imageUrl;
  
  constructor(public activeModal: NgbActiveModal,
    private service: CategoriesService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private http: HttpClient) { }

  ngOnInit(): void {
    this.buildCategoryForm();
    this.categoryForm.patchValue({
      "name":this.name,
      "imageUrl":this.imageUrl
    })
  }
  get f() {
    return this.categoryForm.controls;
  }

  buildCategoryForm() {

    this.categoryForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      file: [''],

    });

  }
  editCategory() {
   
    this.submitted = true;
    if (this.categoryForm.invalid) {
      return;
    }
    else {
      this.spinner.show();
      var addObj = {
        'name': this.categoryForm.controls['name'].value,
        'imageUrl': this.categoryForm.controls['imageUrl'].value
      }
      this.activeModal.dismiss();
      this.service.updatecategory(this.categoryid, addObj).subscribe((response: any) => {
        if (response.code == 200) {
          this.spinner.hide();
          this.getAllCategories()
          // this.toastService.successToastr(response.message);
        }
        else {
          // this.toastService.errorToastr(response.message);
        }
      })
    }
  }
  onFileChange(event) {
    this.spinner.show()
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      let formData = new FormData();
      formData.append('img', file); this.http.post(URL + '/user/uploadPhoto', formData).subscribe((val) => {
        this.imageUrl = val['data'][0];
        this.categoryForm.patchValue({
          "imageUrl":this.imageUrl
        })
        this.spinner.hide()
        console.log(val);
      });
    }
  }
  getAllCategories() {
    this.service.getlist().subscribe((response: any) => {
      this.service.setCategory(response);

    })
  }
}
