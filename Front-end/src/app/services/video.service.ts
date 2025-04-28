import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public url: any;

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  // create de course
  create(token: any, video: any): Observable<any> {
    if (video.url){
      video.url = GLOBAL.htmlEntities(video.url);
    }
    if (video.contesnt) {
      video.content = GLOBAL.htmlEntities(video.content);
    }

    let json = JSON.stringify(video);
    let params = 'json=' + json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.post(this.url + 'videos', params, { headers: headers });
  }
}
