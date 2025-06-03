import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckboxService {
  public url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  // store checkbox
  storeCheckbox(token: any, checkbox: any): Observable<any> {
    let json = JSON.stringify(checkbox);
    let params = 'json=' + json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                   .set('Authorization', token);

    return this._http.post(this.url + 'checkboxes', params, { headers: headers });
  }

  // get checkboxes
  getCheckboxes(token: any, id:any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('Authorization', token);

    return this._http.get(this.url + 'checkboxes/' + id, { headers: headers });
  }

  // delete checkbox
  deleteCheckbox(token: any, id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                   .set('Authorization', token);

    return this._http.delete(this.url + 'checkboxes/' + id, { headers: headers });
  }
}

