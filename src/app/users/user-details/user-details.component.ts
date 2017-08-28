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
  providers:[]
})
export class UserDetailsComponent implements OnInit {
  
  public user: any;
  
  constructor(
    private dialogRef: MdDialogRef<UserDetailsComponent>,
    @Inject(MD_DIALOG_DATA) private data: any,
    public _fb: FormBuilder,
  ) { }

  roles: any[];
  userForm: FormGroup;

  ngOnInit() {
    console.log(this.data.user);
    this.user = this.data.user;
    // this.userForm = this._fb.group({
    //   username: ['', Validators.compose([Validators.required])],
    //   email: ['', Validators.compose([Validators.required])],
    //   firstname: ['', Validators.compose([Validators.required])],
    //   lastname: ['', Validators.compose([Validators.required])],
    //   designation: [],
    //   role: ['', Validators.compose([Validators.required])]
    // });
  }

}