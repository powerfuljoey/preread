import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { GlobalVariable } from './global';

@Injectable()
export class AuthGuard implements CanActivate {
    private baseUrl: string = GlobalVariable.BASE_API_URL;
    constructor(private router: Router, private http: Http) { }

    canActivate(route: ActivatedRouteSnapshot) {
        if (localStorage.getItem('currentUser')) {
            let options = new RequestOptions({ headers: this.getHeaders() });
            this.http.get(`${this.baseUrl}/api/account/ping`, options)
                .map(resp => resp.json()).catch(handleError)
                .subscribe(r => {
                    console.log('CAN-ACTIVATE ', r);
                }, (error: any) => {
                    console.log('CAN-ACTIVATE ERROR', error);
                    if (error.status = 401) {
                        localStorage.removeItem('currentUser');
                        this.router.navigate(['pages/login']);
                        return false;
                    }
                });
                return true;
        }
        // not logged in so redirect to login page with the return url
        localStorage.removeItem('currentUser');
        this.router.navigate(['pages/login']);
        return false;
    }

    private getHeaders() {
        let headers = new Headers();
        let payload = JSON.parse(localStorage.getItem('currentUser'));
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', 'Bearer ' + payload.access_token);
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