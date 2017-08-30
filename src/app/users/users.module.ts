import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { CdkTableModule } from '@angular/cdk';

import { UsersComponent, DialogResultDelete } from './users.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  imports: [
    UsersRoutingModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MaterialModule,
    CdkTableModule
  ],
  exports: [
    DialogResultDelete, UserDetailsComponent
  ],
  declarations: [
    UsersComponent, UserDetailsComponent,
    DialogResultDelete
  ],
  entryComponents: [DialogResultDelete, UserDetailsComponent],
  providers: [

  ]
})
// tslint:disable-next-line:eofline
export class UsersModule { }