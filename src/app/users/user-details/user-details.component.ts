import { Component, Inject, Injectable, OnInit, Input, Directive, TemplateRef, ViewChild, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { User } from '../user';
import { UserService } from '../user.service';
import { ApiResponse } from '../../model/apiresponse';
// import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
  providers: [UserService]
})
export class UserDetailsComponent implements OnInit {

  public user: any;

  constructor(
    private dialogRef: MdDialogRef<UserDetailsComponent>,
    @Inject(MD_DIALOG_DATA) private data: any,
    private userService: UserService
  ) { }

  role: string;
  roles: any[];

  save() {
    if (this.user.id === undefined) {
      this.post();
    }
    else {
      this.put();
    }
  }

  put() {
    console.log('Update',this.user);
    this.userService.updateUser(this.user)
      .subscribe(r => {
        let apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          console.log(apiresp.message);
          // this.notificationService.success('Update User', 'User has been successfully updated');
        }
        else {
          console.log(apiresp.message);
          // this.notificationService.error(apiresp.message);
        }
      },
      (error: any) => {
        console.log(error);
        // this.notificationService.error(error);
      },
      () => {
        // this.state.modal.close();
      });
  }

  post() {

  }

  getRoles() {
    this.userService.getRoles()
      .subscribe(r => {
        let apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          this.roles = JSON.parse(JSON.stringify(apiresp.payload));
          console.log(this.roles);
        }
        else {
          // this.notificationService.error(apiresp.message);
        }
      },
      (error: any) => {
        // this.notificationService.error(error);
      },
      () => {

      });
  }

  ngOnInit() {
    console.log(this.data.user);
    this.user = this.data.user;
    this.getRoles();
  }

}