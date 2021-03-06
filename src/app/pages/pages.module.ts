import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MaterialModule],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent
  ]
})
export class PagesModule { }
