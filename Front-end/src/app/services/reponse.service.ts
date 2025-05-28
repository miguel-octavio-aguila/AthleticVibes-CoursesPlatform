import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  public url: string;

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  // get reponse
  getReponses(token: any, id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('Authorization', token);
    return this._http.get(this.url + 'responses/' + id, { headers: headers });
  }
}
