import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs'
import { NgxSpinnerService } from "ngx-spinner";
import { BusinessUsersService } from './business-users.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ViewbusinessuserComponent } from './viewbusinessuser/viewbusinessuser.component'
import * as XLSX from 'xlsx'
import { google } from "google-maps";
import { CategoriesService } from '../categories/categories.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-business-users',
  templateUrl: './business-users.component.html',
  styleUrls: ['./business-users.component.css']
})
export class BusinessUsersComponent implements OnInit {
  category: Array<any>;
  modalReference: any;
  data: Array<any>;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  public isDtInitialized = false
  dtTrigger: Subject<any> = new Subject();
  title = 'XlsxFileRead';
  file: File
  arrayBuffer: any
  filelist: any
  constructor(
    private service: BusinessUsersService,
    // private modalService: NgbModal,
    private categoryService: CategoriesService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastService: ToastrService,
  ) {
  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      order: [[0, 'desc']],
      columnDefs: [{ width: '200', targets: 0 }],
    };
    this.categoryList()
    this.getbusinesslist()
    // this.getallbusinessusers()
  }
  // getallbusinessusers() {
  //   this.spinner.show();
  //   this.service.getlist().subscribe((response: any) => {
  //     this.data = response.data;
  //     this.spinner.hide();
  //     if (this.isDtInitialized) {
  //       this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //         dtInstance.destroy();
  //         this.dtTrigger.next();
  //       });
  //     } else {
  //       this.isDtInitialized = true
  //       this.dtTrigger.next();
  //     }
  //   }, error => {
  //   });
  // }
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
            this.getbusinesslist()
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
  userDetails(data) {
    this.router.navigate(['/businessUsers/detail'], { state: { data: data } });
  }

  // =====================business APIS

  getbusinesslist() {
    this.spinner.show();
    this.service.getbusinesslist().subscribe((response: any) => {
      this.data = response.data;
      console.log("getBusinessList");
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
  Accept(id) {
    let status = true
    let obj = {
      status: true
    }
    this.service.businessstatusupdate(id, obj).subscribe((response: any) => {
      this.getbusinesslist()

    })
  }
  Decline(id) {
    let status = true
    let obj = {
      status: false
    }
    this.service.businessstatusupdate(id, obj).subscribe((response: any) => {
      this.getbusinesslist()

    })
  }


  addfile(event) {

    this.file = event.target.files[0];
    let fileReader = new FileReader();
    var latest = []
    fileReader.readAsArrayBuffer(this.file);

    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      var list = this.category
      arraylist.forEach(function (input, index) {
        input['typeOfBusiness'] = input['typeOfBusiness'].trim()
        list.map((ele) => {
          input['email'] = input['email'].trim()
          if (input['category'].trim() == ele.name.trim()) {
            input['category'] = ele._id
          } else {
          }
        })
      });
      this.addbusiness(arraylist)
    }
  }
  addbusiness(arraylist) {
    this.spinner.show();
    return this.service.addbusinesses(arraylist).subscribe((response: any) => {
      if (response.code == 400) {
        this.toastService.error(response.message + response.data);
        this.spinner.hide();
        this.getbusinesslist()

      }
      else if (response.code == 500) {
        this.toastService.error(response.message);
        this.spinner.hide();
        this.getbusinesslist()

      } else if (response.code == 200) {
        this.toastService.success(response.message);
        this.spinner.hide();
        this.getbusinesslist()

      }
      // this.spinner.hide();
      // this.getbusinesslist()
    })
  }
  categoryList() {
    this.categoryService.getlist().subscribe((response: any) => {
      this.category = response.data;
      // return response.data
    }, error => {
    });
  }
}
