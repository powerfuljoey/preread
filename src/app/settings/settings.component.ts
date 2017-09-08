import { Component, OnInit, NgModule } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule } from '@angular/forms';

import { ApiResponse } from '../model/apiresponse';
import { User } from '../users/user';
import { UserService } from '../users/user.service';

import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [UserService]
})
export class SettingsComponent implements OnInit {

  private user: User = new User;
 
  changePasswordForm: FormGroup;

  constructor(
    public _fb: FormBuilder,
    private userService: UserService) {

    const oldpassword = new FormControl('', Validators.compose([Validators.required]) );
    const newpassword = new FormControl('', Validators.required);
    const confirmpassword = new FormControl('', Validators.compose([Validators.required, CustomValidators.equalTo(newpassword)]));

    this.changePasswordForm = new FormGroup({
      oldpassword: oldpassword,
      newpassword: newpassword,
      confirmpassword: confirmpassword
    });
  }

  ngOnInit() {

  }

  // private validateUser(input: FormControl): any {
  //   console.log(input.value);
  //   if (!input.root) {
  //     return null;
  //   }

  //   // this.userService.getUser(input.value)
  //   //   .subscribe(r => {
  //   //     const apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
  //   //     if (apiresp.succeeded) {
  //   //       const user = JSON.parse(JSON.stringify(apiresp.payload));
  //   //       console.log(user);
  //   //     }
  //   //     else {
  //   //       // this.notificationService.error(apiresp.message);
  //   //     }
  //   //   }, (error: any) => {
  //   //     if (!error.ok) {
  //   //       if (error.status == 0) {
  //   //         // this.notificationService.error('Connection Refused');
  //   //       } else {
  //   //         // this.notificationService.error(error.statusText);
  //   //       }

  //   //     }
  //   //   }, () => {
  //   //     console.log('Completed');
  //   //   });
  // }
}
