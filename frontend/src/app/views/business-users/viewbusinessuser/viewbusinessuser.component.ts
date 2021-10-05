import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-viewbusinessuser',
  templateUrl: './viewbusinessuser.component.html',
  styleUrls: ['./viewbusinessuser.component.css']
})
export class ViewbusinessuserComponent implements OnInit {

  public customer;
  constructor(  private router: Router) { }

  ngOnInit(): void {
    if (!history.state.data) {
      this.customer = ""
    } else {
      this.customer = history.state.data
    }
  }
  back(){
    this.router.navigate(['/businessUsers']);
  }
}
