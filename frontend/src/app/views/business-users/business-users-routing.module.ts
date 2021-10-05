import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusinessUsersComponent } from './business-users.component';
import {ViewbusinessuserComponent} from './viewbusinessuser/viewbusinessuser.component'
const routes: Routes = [
  {
    path: '',
    component: BusinessUsersComponent,
    data: {
      title: 'Business Users'
    }
  },
  {
    path: 'detail',
    component: ViewbusinessuserComponent,
    data: {
      title: 'Business Users / Details'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessUsersRoutingModule {}
