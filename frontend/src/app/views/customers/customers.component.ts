import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs'
import { NgxSpinnerService } from "ngx-spinner";
// import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomersService } from './customers.service';
import Swal from 'sweetalert2';
// import {ViewcustomerComponent} from './viewcustomer/viewcustomer.component'
import { Router } from '@angular/router';
@Component({
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  modalReference: any;
  data: Array<any>;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  public isDtInitialized = false
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private service: CustomersService,
    // private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[0, 'desc']],
    };
    this.getallcustomers()
  }
  getallcustomers() {
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
  userDetails(data) {
      this.router.navigate(['/customers/detail'], { state: { data: data } });
  }
  deleteUser(id) {
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
      this.service.deleteuser(id).subscribe(
        data => {
          this.getallcustomers()
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
