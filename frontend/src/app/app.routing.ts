import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { LoginComponent } from './views/login/login.component';
import { AuthGuard } from './containers/auth/_guards/auth.guard';
import { ForgotpasswordComponent } from './views/forgotpassword/forgotpassword.component';
export const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full',
  // },
  {
    path: 'login',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'forgotpassword',
    component: ForgotpasswordComponent,
    data: {
      title: 'Forgotpassword Page'
    }
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },

  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },

  {
    path: '',
    canActivate: [AuthGuard],
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      // {
      //   path: 'base',
      //   loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      // },
      // {
      //   path: 'buttons',
      //   loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      // },
      // {
      //   path: 'charts',
      //   loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      // },
      // {
      //   path: 'dashboard',
      //   loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      // },
      {
        path: 'categories',
        loadChildren: () => import('./views/categories/categories.module').then(m => m.CategoriesModule)
      },

      {
        path: 'customers',
        loadChildren: () => import('./views/customers/customers.module').then(m => m.CustomersModule)
      },
      // {
      //   path: ' customers/detail',
      //   loadChildren: () => import('./views/customers/customers.module').then(m => m.CustomersModule)
      // },
      {
        path: 'businessUsers',
        loadChildren: () => import('./views/business-users/business-users.module').then(m => m.BusinessUserModule)
      },
      {
        path: 'business',
        loadChildren: () => import('./views/business/business.module').then(m => m.BusinessModule)
      },
      {
        path: 'reportedUsers',
        loadChildren: () => import('./views/reported-users/reported-users.module').then(m => m.ReportedUserModule)
      },
      {
        path: 'suggestions',
        loadChildren: () => import('./views/suggestions/suggestions.module').then(m => m.SuggestionsModule)
      }
      // {
      //   path: 'icons',
      //   loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      // },
      // {
      //   path: 'notifications',
      //   loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      // },
      // {
      //   path: 'theme',
      //   loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      // },
      // {
      //   path: 'widgets',
      //   loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      // }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
