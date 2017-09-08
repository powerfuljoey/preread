import { Component, OnInit, ViewEncapsulation, Input, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule } from '@angular/forms';

import { MdIconRegistry, MdPaginator, MdSort, MdDialog, MdDialogRef, MdDialogConfig, MdSnackBar } from '@angular/material';
import { CustomValidators } from 'ng2-validation';

import { UserService } from '../users/user.service';
import { AuthService } from '../pages/auth.service';
import { LoginPayload } from '../model/loginpayload';
import { ApiResponse } from '../model/apiresponse';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [AuthService]
})
export class FullLayoutComponent implements OnInit {
  invert = false;
  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };
  public username: string;
  public role: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    iconRegistry: MdIconRegistry,
    sanitizer: DomSanitizer,
    public dialog: MdDialog,
  ) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/favicon.svg'));
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  public logout() {
    this.authService.logout()
      .subscribe(r => {
        console.log('Logout Resp:', r);
      }, (error: any) => {
        console.log('Logout Error:', error);
      }, () => {
        localStorage.removeItem('currentUser');
        this.router.navigate(['pages/login']);
      });

  }

  public changePassword() {
    const dialogRef = this.dialog.open(DialogResultChangePassword);
  }



  ngOnInit(): void {
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.firstname;
    this.role = currentUser.role;
  }
}

@Component({
  selector: 'dialog-delete',
  templateUrl: './change-password.component.html',
  providers: [UserService]
})
export class DialogResultChangePassword {
  constructor(
    private authService: AuthService,
    private router: Router,
    public dialogRef: MdDialogRef<DialogResultChangePassword>,
    private userService: UserService,
    public snackBar: MdSnackBar) {

    const oldpassword = new FormControl('', Validators.compose([Validators.required]));
    const newpassword = new FormControl('', Validators.required);
    const confirmpassword = new FormControl('', Validators.compose([Validators.required, CustomValidators.equalTo(newpassword)]));

    this.changePasswordForm = new FormGroup({
      oldpassword: oldpassword,
      newpassword: newpassword,
      confirmpassword: confirmpassword
    });
  }

  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  changePasswordForm: FormGroup;

  change() {
    this.userService.changePassword(this.currentPassword, this.confirmPassword)
      .subscribe(r => {
        const apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          console.log(apiresp.message);
          this.openSnackBar('Password has been successfuly changed', 'Change Password');
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
        this.authService.logout()
          .subscribe(r => {
            console.log('Logout Resp:', r);
          }, (error: any) => {
            console.log('Logout Error:', error);
          }, () => {
            localStorage.removeItem('currentUser');
            this.router.navigate(['pages/login']);
          });
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
