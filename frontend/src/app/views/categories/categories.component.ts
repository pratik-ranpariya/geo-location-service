import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs'
import { NgxSpinnerService } from "ngx-spinner";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriesService } from './categories.service';
import { ViewcategoryComponent } from './viewcategory/viewcategory.component';
import { EditcategoryComponent } from './editcategory/editcategory.component';
import { AddcategoryComponent } from './addcategory/addcategory.component'
import Swal from 'sweetalert2';

@Component({
  templateUrl: 'categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  modalReference: any;
  data: Array<any>;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  public isDtInitialized = false
  dtTrigger: Subject<any> = new Subject();


  constructor(
    private service: CategoriesService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
   
  ) {
    this.spinner.show();
    this.service.getCategory().subscribe((response: any) => {
      this.data = response.CategoryList.data;
      this.spinner.hide();
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true
        this.dtTrigger.next();
      }
    }, error => {
    });
  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[0, 'desc']],
    };
    this.getallcategories()
  }
  getallcategories() {
    this.spinner.show();
    this.service.getlist().subscribe((response: any) => {
      this.data = response.data;
      this.spinner.hide();
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true
        this.dtTrigger.next();
      }
    }, error => {
    });
  }
  categoryDetails(category) {
    const modalRef = this.modalService.open(ViewcategoryComponent, { size: 'lg', windowClass: 'big_popup' });
      modalRef.componentInstance.categoryid = category._id;
      modalRef.componentInstance.name = category.name;
      modalRef.componentInstance.imageUrl=category.imageUrl
  }
  editcategory(category) {
    const modalRef = this.modalService.open(EditcategoryComponent, { size: 'lg', windowClass: 'big_popup' });
    modalRef.componentInstance.categoryid = category._id;
    modalRef.componentInstance.name = category.name;
    modalRef.componentInstance.imageUrl=category.imageUrl

  }
  addcategory() {
    const modalRef = this.modalService.open(AddcategoryComponent, { size: 'lg', windowClass: 'big_popup' });
  }
  deletecategory(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        // this.spinnerService.show();
        this.service.deletecategory(id).subscribe(
          data => {
            this.getallcategories()
            if (data['code'] == 200) {
              Swal.fire(
                'Deleted!',
                data['message'],
                'success'
              )
            } else {
              Swal.fire(
                'error',
                data['message']
              )
            }
          }, error => {
            Swal.fire(
              'Cancelled',
              'Your imaginary file is safe :)',
              'error'
            )
          });

      }
    })
  }


}
