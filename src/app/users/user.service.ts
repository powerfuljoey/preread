import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { User } from './user';
import { GlobalVariable } from '../global';
import { LoginPayload } from '../model/loginpayload';


@Injectable()
export class UserService {
  private baseUrl: string = GlobalVariable.BASE_API_URL;
  payload: LoginPayload;
  constructor(public http: Http) {
    this.payload = JSON.parse(localStorage.getItem('currentUser'));
  }

  getAllUsers(): Observable<User[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    return this.http.get(`${this.baseUrl}/api/user`, options)
      .map(resp => resp.json()).catch(handleError);
  }

  getUsers(): Observable<User[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    return this.http.get(`${this.baseUrl}/api/user`, options)
      .map(resp => resp.json()).catch(handleError);
  }

  getUser(param: string): Observable<User[]> {
    let options = new RequestOptions({ headers: this.getHeaders() });
    return this.http.get(`${this.baseUrl}/api/user/${param}`, options)
      .map(resp => resp.json()).catch(handleError);
  }

  getPagedUsers(page: number) {
    let options = new RequestOptions({ headers: this.getHeaders() });
    return this.http.get(`${this.baseUrl}/api/user/${page}/10`, options)
      .map(resp => resp.json()).catch(handleError);
  }

  addNewUser(user: User) {
    let options = new RequestOptions({ headers: this.putHeader() });
    let bodystring = JSON.stringify(user);
    return this.http.post(`${this.baseUrl}/api/user`, bodystring, options)
      .map(resp => resp.json()).catch(handleError);
  }

  updateUser(user: User) {
    let options = new RequestOptions({ headers: this.putHeader() });
    let bodystring = JSON.stringify(user);
    return this.http.put(`${this.baseUrl}/api/user/${user.id}`, bodystring, options)
      .map(resp => resp.json()).catch(handleError);
  }

  searchUser(name: string) {
    let options = new RequestOptions({ headers: this.putHeader() });
    return this.http.get(`${this.baseUrl}/api/user/search/${name}`, options)
      .map(resp => resp.json()).catch(handleError);
  }

  resetPassword(id: string) {
    let options = new RequestOptions({ headers: this.putHeader() });
    console.log(options);
    return this.http.post(`${this.baseUrl}/api/user/reset/${id}`,'', options)
      .map(resp => resp.json()).catch(handleError);
  }

  changePassword(currentpassword: string,newpassword:string) {
    let options = new RequestOptions({ headers: this.putHeader() });
    return this.http.post(`${this.baseUrl}/api/user/change/${currentpassword}/${newpassword}`,'', options)
      .map(resp => resp.json()).catch(handleError);
  }

  unlockUser(username: string) {
    let options = new RequestOptions({ headers: this.getHeaders() });
    return this.http.get(`${this.baseUrl}/api/user/unlock/${username}`, options)
      .map(resp => resp.json()).catch(handleError);
  }

  getRoles() {
    let options = new RequestOptions({ headers: this.getHeaders() });
    return this.http.get(`${this.baseUrl}/api/user/roles`, options)
      .map(resp => resp.json()).catch(handleError);
  }

  getRole(id: string) {
    let options = new RequestOptions({ headers: this.getHeaders() });
    return this.http.get(`${this.baseUrl}/api/user/role/${id}`, options)
      .map(resp => resp.json()).catch(handleError);
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.payload.access_token);
    return headers;
  }

  private putHeader() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.payload.access_token);
    return headers;
  }
}

function handleError(error: any) {
  // log error
  // could be something more sofisticated
  console.log('HANDLE ERROR', error);

  // let errorMsg = error.json().error || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`

  // console.log('errorMsg',errorMsg);
  // throw an application level error
  return Observable.throw(error);

}