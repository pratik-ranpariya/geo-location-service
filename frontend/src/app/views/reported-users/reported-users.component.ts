
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs'
import { NgxSpinnerService } from "ngx-spinner";
// import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReporteduserService } from './reported-users.service';
import Swal from 'sweetalert2';
// import {ViewcustomerComponent} from './viewcustomer/viewcustomer.component'
import { Router } from '@angular/router';
@Component({
  selector: 'app-reported-users',
  templateUrl: './reported-users.component.html',
  styleUrls: ['./reported-users.component.css']
})
export class ReportedUsersComponent implements OnInit {
  modalReference: any;
  data: Array<any>;
  dtOptions: DataTables.Settings = {};
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  public isDtInitialized = false
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private service: ReporteduserService,
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
      console.log("ReportedUsersComponent -> getallcustomers -> response", response)

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


}

