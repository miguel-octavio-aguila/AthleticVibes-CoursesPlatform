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
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);
    return this._http.post(this.url + 'sales', params, { headers: headers });
  }

  // get sales
  getSales(token: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);
    return this._http.get(this.url + 'sales' , { headers: headers });
  }

  // update sale
  updateSaleProgress(token: any, sale: any, id: any): Observable<any> {
    const json = JSON.stringify(sale);
    const params = 'json=' + json
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);
    return this._http.put(this.url +'sales/' + id, params, { headers: headers });
  }

  // get sale by category
  getSalesByCategory(token: any, category: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);
    return this._http.get(this.url +'sales/getSalesByCategory/' + category, { headers: headers });
  }

  // get sale by text
  getSalesByText(token: any, text: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('Authorization', token);
    return this._http.get(this.url +'sales/getSalesByText/' + text, { headers: headers });
  }
}
