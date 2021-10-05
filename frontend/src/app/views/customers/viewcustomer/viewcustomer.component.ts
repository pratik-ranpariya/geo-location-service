import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
// import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-viewcustomer',
  templateUrl: './viewcustomer.component.html',
  styleUrls: ['./viewcustomer.component.css']
})
export class ViewcustomerComponent implements OnInit {
  public customer;
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (!history.state.data) {
      this.customer = ""
    } else {

      this.customer = history.state.data
    }
  }
  back() {
    this.router.navigate(['/customers']);
  }
}
