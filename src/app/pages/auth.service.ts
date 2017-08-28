import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiResponse } from '../model/apiresponse';
import { LoginRequest } from './loginrequest';

import { GlobalVariable } from '../global';

@Injectable()
export class AuthService {
  private baseUrl: string = GlobalVariable.BASE_API_URL;
  headers: Headers;
  options: RequestOptions;


  constructor(public http: Http) {
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  login(loginrequest: LoginRequest): Observable<ApiResponse> {

    let options = new RequestOptions({ headers: this.putHeader() });
    let bodyString = JSON.stringify(loginrequest);

    return this.http.post(`${this.baseUrl}/api/account/login`, bodyString, this.options)
      .map(resp => resp.json()).catch(handleError);
  }

  logout(){
    let options = new RequestOptions({ headers: this.getHeaders()});
    return this.http.get(`${this.baseUrl}/api/account/logout`, this.options)
      .map(resp => resp.json()).catch(handleError);
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }

  private putHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  }
}

// this could also be a private method of the component class
function handleError(error: any) {
  // log error
  // could be something more sofisticated
  console.log(error);

  // throw an application level error
  return Observable.throw(error);
}