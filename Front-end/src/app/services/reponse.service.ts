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

  // add a response
  createResponse(token: any, response: any): Observable<any> {
    if (response.response) {
      response.response = GLOBAL.htmlEntities(response.response);
    }
    
    let json = JSON.stringify(response);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                   .set('Authorization', token);
    return this._http.post(this.url + 'responses', params, { headers: headers });
  }

  // update a response
  updateResponse(token: any, response: any): Observable<any> {
    if (response.response) {
      response.response = GLOBAL.htmlEntities(response.response);
    }

    let json = JSON.stringify(response);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                  .set('Authorization', token);
    return this._http.put(this.url +'responses/' + response.id, params, { headers: headers });
  }

  // delete a response
  deleteResponse(token: any, id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                   .set('Authorization', token);
    return this._http.delete(this.url +'responses/' + id, { headers: headers });
  }
}
