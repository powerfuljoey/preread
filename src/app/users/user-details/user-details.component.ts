import { Component, Inject, Injectable, OnInit, Input, Directive, TemplateRef, ViewChild, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';

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
    private userService: UserService,
    public snackBar: MdSnackBar
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
    console.log('Update', this.user);
    this.user.role=this.role;
    this.userService.updateUser(this.user)
      .subscribe(r => {
        const apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          console.log(apiresp.message);
          this.openSnackBar('User has been successfully updated', 'Update User');
        }
        else {
          console.log(apiresp.message);
          this.openSnackBar(apiresp.message, 'Error');
        }
      },
      (error: any) => {
        console.log(error);
        this.openSnackBar(error, 'Error');
      },
      () => {
        // this.state.modal.close();
      });
  }

  post() {
    console.log('New User');
    this.user.role=this.role;
    this.userService.addNewUser(this.user)
      .subscribe(r => {
        const apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          console.log(apiresp.message);
          this.openSnackBar('New User has been successfully added', 'New User');
        }
        else {
          console.log(apiresp.message);
          this.openSnackBar(apiresp.message, 'Error');
        }
      },
      (error: any) => {
        console.log(error);
        this.openSnackBar(error, 'Error');
      },
      () => {
        
      });
  }

  getRoles() {
    this.userService.getRoles()
      .subscribe(r => {
        const apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          this.roles = JSON.parse(JSON.stringify(apiresp.payload));
          console.log(this.roles);
        }
        else {
          console.log(apiresp.message);
          this.openSnackBar(apiresp.message, 'Error');
        }
      },
      (error: any) => {
        console.log(error);
        this.openSnackBar(error, 'Error');
      },
      () => {

      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  ngOnInit() {
    console.log('param', this.data.user);
    this.role = this.data.user.role !== undefined ? this.data.user.role[0] : '';
    this.user = this.data.user;
    this.getRoles();
  }

}