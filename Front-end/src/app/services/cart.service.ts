import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public url: string;
  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  // index
  index(token: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);
    return this._http.get(this.url + 'carts', { headers: headers });
  }

  // store
  store(token: any, cart: any): Observable<any> {
    let json = JSON.stringify(cart);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);
    return this._http.post(this.url + 'carts', params, { headers: headers });
  }

  // delete
  delete(token: any, id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);
    return this._http.delete(this.url + 'carts/' + id, { headers: headers });
  }

  //delete all
  deleteAll(token: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);
    return this._http.delete(this.url + 'carts/deleteCart', { headers: headers });
  }
}
