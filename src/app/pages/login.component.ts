import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { AuthService } from './auth.service';
import { LoginRequest } from './loginrequest';
import { LoginPayload } from '../model/loginpayload';
import { ApiResponse } from '../model/apiresponse';
import { fallIn } from '../router.animations';
import { Helper } from '../helper';

@Component({
  templateUrl: 'login.component.html',
  providers: [AuthService, Helper],
  animations: [fallIn()]
})
export class LoginComponent {
  state: string = '';
  error: any;
  model: any = {};
  apiresponse: ApiResponse = new ApiResponse();
  loginreq: LoginRequest = new LoginRequest();

  returnUrl: string;
  constructor(private router: Router, private authService: AuthService, private helper: Helper) { }

  login() {

    this.loginreq.UserName = this.model.username;
    this.loginreq.Password = this.model.password;

    this.authService.login(this.loginreq)
      .subscribe(r => {
        let resp = this.helper.toInstance(new ApiResponse(), JSON.stringify(r));
        if (resp.succeeded) {
          localStorage.setItem('currentUser', JSON.stringify(resp.payload));
          this.router.navigate(['/dashboard']);
        }
        else {
          this.error = resp.message;
        }
      }, (error: any) => {
        this.error = error;
      }, () => {
        console.log('Completed');
      });


  }
}
