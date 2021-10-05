// 
import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from "@angular/common";
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from "ngx-spinner";
import {BusinessUsersComponent} from './business-users.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {BusinessUsersRoutingModule} from './business-users-routing.module';
import { ViewbusinessuserComponent } from './viewbusinessuser/viewbusinessuser.component'
@NgModule({
  declarations: [BusinessUsersComponent, ViewbusinessuserComponent ],
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
    BusinessUsersRoutingModule
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BusinessUserModule { }
