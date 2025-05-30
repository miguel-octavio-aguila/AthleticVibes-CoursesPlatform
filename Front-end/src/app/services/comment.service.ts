import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  public url: string;

  constructor(
    private _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  // get comments
  getComments(videoId: any, token: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                   .set('Authorization', token);

    return this._http.get(this.url + 'comments/' + videoId, { headers: headers });
  }

  // add comment
  create(token: string, comment: any): Observable<any> {
    if(comment.comment) {
      comment.comment = GLOBAL.htmlEntities(comment.comment);
    }
    let json = JSON.stringify(comment);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                  .set('Authorization', token);

    return this._http.post(this.url + 'comments', params, { headers: headers });
  }

  // update comment
  update(token: string, comment: any): Observable<any> {
    if(comment.comment) {
      comment.comment = GLOBAL.htmlEntities(comment.comment);
    }
    let json = JSON.stringify(comment);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                 .set('Authorization', token);

    return this._http.put(this.url + 'comments/' + comment.id, params, { headers: headers });
  }

  // delete comment
  delete(token: string, id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                  .set('Authorization', token);

    return this._http.delete(this.url + 'comments/' + id, { headers: headers });
  }
}
