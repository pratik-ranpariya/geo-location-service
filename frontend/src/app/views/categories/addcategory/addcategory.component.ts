import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../categories.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
const URL = environment.API_URL
@Component({
  selector: 'app-addcategory',
  templateUrl: './addcategory.component.html',
  styleUrls: ['./addcategory.component.css']
})
export class AddcategoryComponent implements OnInit {
  categoryForm: FormGroup;
  imageSrc: string;
  loading = false;
  submitted = false;
  constructor(private router: Router,
    public service: CategoriesService,
    public activeModal: NgbActiveModal,
    private spinner: NgxSpinnerService,
    // tslint:disable-next-line: variable-name
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.buildCategoryForm();
  }
  get f() {
    return this.categoryForm.controls;
  }

  buildCategoryForm() {

    this.categoryForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      file: [''],
      // fileSource: ['', [Validators.required]]
    });
  }
  addCategory() {
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
      this.service.addcategory(addObj).subscribe(async (response: any) => {
        if (response.code == 201) {
          this.spinner.hide();
          await this.getAllCategories()
          // this.toastService.successToastr(response.message);
        }
        else {
          // this.toastService.errorToastr(response.message);
        }
      })
    }
  }
  getAllCategories() {
    this.service.getlist().subscribe((response: any) => {
      this.service.setCategory(response);

    })
  }
  onFileChange(event) {
    this.spinner.show()
    console.log("AddcategoryComponent -> onFileChange -> event", event.target.value)
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      let formData = new FormData();
      formData.append('img', file);
      this.http.post(URL + '/user/uploadPhoto', formData).subscribe((val) => {
        this.imageSrc = val['data'][0]
    
        this.categoryForm.get('imageUrl').setValue(val['data'][0]);
        this.spinner.hide()
        console.log(val);
      });
    }
  }
}
