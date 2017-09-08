import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomFormsModule } from 'ng2-validation';
import { MaterialModule } from '@angular/material';
import { ChartsModule } from 'ng2-charts/ng2-charts';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './pages/auth.service';

// import { BreadcrumbsComponent } from './shared/breadcrumb.component';
// import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';
// import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
// import { AsideToggleDirective } from './shared/aside.directive';

import { FullLayoutComponent, DialogResultChangePassword } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    DialogResultChangePassword
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ChartsModule,
    MaterialModule,
    CustomFormsModule
  ],
  exports: [DialogResultChangePassword],
  entryComponents: [DialogResultChangePassword],
  providers: [AuthGuard, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
