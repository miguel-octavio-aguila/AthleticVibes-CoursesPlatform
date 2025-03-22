import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { GLOBAL } from './global';

@Injectable({
    providedIn: "root"
})
  
export class UserService {
    public apiUrl: string = GLOBAL.url;
    public identity: any;
    public token: any;

    constructor(public http: HttpClient) {
        this.apiUrl;
    }

    signup(user:any, getToken:any = null): Observable<any> {
        // Check if getToken is set to true
        if (getToken != null) {
            user.getToken = 'true';
        }
        // Convert the user object to a JSON string
        let json = JSON.stringify(user);
        // Convert the JSON string to a string that can read
        let params = 'json=' + json;
        // Set the headers
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        // Make the POST request to the API
        return this.http.post(this.apiUrl + 'signup', params, { headers: headers });
    }
}