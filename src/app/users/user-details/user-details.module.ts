import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule, MdDialogRef } from '@angular/material';
import { UserDetailsComponent } from './user-details.component';
import { UsersComponent } from '../users.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule, FormsModule, ReactiveFormsModule
  ]
  ,
  // declarations: [UserDetailsComponent],
  providers:[]
})
// tslint:disable-next-line:eofline
export class UserDetailsModule { }