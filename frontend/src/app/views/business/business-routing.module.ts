import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessComponent } from './business.component';
// import {ViewcategoryComponent} from './viewcategory/viewcategory.component'
const routes: Routes = [
  {
    path: '',
    component: BusinessComponent,
    data: {
      title: 'business'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule {}
