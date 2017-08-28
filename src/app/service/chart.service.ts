import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { GlobalVariable } from '../global';
import { LoginPayload } from '../model/loginpayload';

@Injectable()
export class ChartService {
    private baseUrl: string = GlobalVariable.BASE_API_URL;
    private payload: LoginPayload;

    constructor(private http: Http) {
        this.payload = JSON.parse(localStorage.getItem('currentUser'));
    }

    getLineChart(type:number): Observable<any[]> {
        let options = new RequestOptions({ headers: this.getHeaders() });

        return this.http.get(`${this.baseUrl}/api/movement/linechart/${type}`, options)
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