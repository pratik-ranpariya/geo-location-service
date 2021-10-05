import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthModule } from './containers/auth/auth.module';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { NgxSpinnerModule } from "ngx-spinner";
import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CategoriesModule } from './views/categories/categories.module';
import { CustomersModule } from './views/customers/customers.module';
import { BusinessUserModule } from './views/business-users/business-users.module'
import { ToastrModule } from "ngx-toastr";
import { ForgotpasswordComponent } from './views/forgotpassword/forgotpassword.component';
import { BusinessModule } from './views/business/business.module';
// import { SuggestionsComponent } from './views/suggestions/suggestions.component';
// import { ReportedUsersComponent } from './views/reported-users/reported-users.component'
import { ReportedUserModule } from "./views/reported-users/reported-users.module"
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    HttpClientModule,
    CategoriesModule,
    ReportedUserModule,
    CustomersModule,
    BusinessUserModule,
    BusinessModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({

    }),
    AuthModule,
    NgxSpinnerModule

  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    ForgotpasswordComponent,
    // SuggestionsComponent,
    // ReportedUsersComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
