import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import {MaterialModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    CdkTableModule
  ],
  exports: [

  ],
  declarations: [
    ProfileComponent,
  ],
  providers: [
  ]
})
// tslint:disable-next-line:eofline
export class ProfileModule { }