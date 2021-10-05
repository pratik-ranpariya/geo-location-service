import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from "@angular/common";
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { NgxSpinnerModule } from "ngx-spinner";
import { ViewcategoryComponent } from './viewcategory/viewcategory.component';
import { EditcategoryComponent } from './editcategory/editcategory.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddcategoryComponent } from './addcategory/addcategory.component';
@NgModule({
  declarations: [ CategoriesComponent, ViewcategoryComponent, EditcategoryComponent, AddcategoryComponent ],
  imports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CategoriesRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    DataTablesModule,
    CommonModule,
    NgxSpinnerModule
  ],
  entryComponents: [ViewcategoryComponent,EditcategoryComponent,AddcategoryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoriesModule { }
