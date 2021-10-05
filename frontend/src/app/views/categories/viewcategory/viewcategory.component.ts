import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-viewcategory',
  templateUrl: './viewcategory.component.html',
  styleUrls: ['./viewcategory.component.css']
})
export class ViewcategoryComponent implements OnInit {
  @Input() categoryid;
  @Input() name;
  @Input() imageUrl;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    
  }

}
