import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from "@angular/common";
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from "ngx-spinner";
import {CustomersComponent} from './customers.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {CustomersRoutingModule} from './customers-routing.module';
import { ViewcustomerComponent } from './viewcustomer/viewcustomer.component'
@NgModule({
  declarations: [CustomersComponent, ViewcustomerComponent ],
  imports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    DataTablesModule,
    CommonModule,
    NgxSpinnerModule,
    CustomersRoutingModule
  ],
  entryComponents: [ViewcustomerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomersModule { }
