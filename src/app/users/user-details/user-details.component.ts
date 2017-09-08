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
  public role: string;
  public roles: any[];
  public isAdmin: boolean = true;
  public userForm: FormGroup;

  constructor(
    private dialogRef: MdDialogRef<UserDetailsComponent>,
    @Inject(MD_DIALOG_DATA) private data: any,
    private userService: UserService,
    public snackBar: MdSnackBar,
    public _fb: FormBuilder,
  ) {

    this.role = this.data.user.role !== undefined ? this.data.user.role[0] : '';
    this.user = this.data.user;
    this.isAdmin = this.user.userName === 'Administrator' ? true : false;
    this.getRoles();

    const firstName = new FormControl('', Validators.required);
    const lastName = new FormControl('', Validators.required);
    const userName = new FormControl({ value: '', disabled: this.isAdmin }, Validators.required);
    const role = new FormControl({ value: '', disabled: this.isAdmin }, Validators.required);
    const email = new FormControl('', []);
    const lockoutenabled = new FormControl('', []);

    this.userForm = _fb.group({
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      role: role,
      email: email,
      lockoutenabled: lockoutenabled
    });

  }


  cancel() {
    this.dialogRef.close('cancel');
  }

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
    this.user.role = this.role;
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
    this.user.role = this.role;
    this.userService.addNewUser(this.user)
      .subscribe(r => {
        const apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          console.log(apiresp.message);
          this.openSnackBar('New User has been successfully added', 'New User');
        }
        else {
          console.log('Error', apiresp.message);
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

  resetPassword() {
    this.userService.resetPassword(this.user.id)
      .subscribe(r => {
        const apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          console.log(apiresp.message);
          this.openSnackBar('Password has been reset', 'Reset Password');
        }
        else {
          console.log('Error', apiresp.message);
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

  }

}