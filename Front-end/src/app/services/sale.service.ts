import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  public url: string;

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  // create sale
  createSale(token: any, user: any): Observable<any> {
    const json = JSON.stringify(user);
    const params = 'json=' + json
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    return this._http.post(this.url + 'sales', params, { headers: headers });
  }
}
