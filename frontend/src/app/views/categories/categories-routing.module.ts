import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesComponent } from './categories.component';
// import {ViewcategoryComponent} from './viewcategory/viewcategory.component'
const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    data: {
      title: 'Categories'
    }
  },
  // {
  //   path: 'view',
  //   component: ViewcategoryComponent,
  //   data: {
  //     title: 'Categories/Details'
  //   }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {}
