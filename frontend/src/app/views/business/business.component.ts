import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params,Router } from '@angular/router';
import{BusinessService} from './business.service'

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
 business={};
  constructor(private route: ActivatedRoute,private service:BusinessService,private router:Router) { }

  ngOnInit(): void {
    let param1 = this.route.snapshot.queryParams["id"];
    this.service.details(param1).subscribe((response: any) => {
      console.log("BusinessComponent -> Accept -> response", response)
       this.business=response.data
      }, error => {
       console.error({error})
      });
  }
  Accept() {
    let param1 = this.route.snapshot.queryParams["id"];
    this.service.Approvebusiness(param1).subscribe((response: any) => {
    console.log("BusinessComponent -> Accept -> response", response)
    this.router.navigate(['categories']);
     
    }, error => {
     console.error({error})
    });
  }

}
