import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { ViewcustomerComponent } from './viewcustomer/viewcustomer.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    data: {
      title: 'Customers'
    }
  },
  {
    path: 'detail',
    component: ViewcustomerComponent,
    data: {
      title: 'Customers / Detail'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule {}
