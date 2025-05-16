import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public url: any;
  public video: any;

  constructor(
    public _http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  // get videos
  getVideos(): Observable<any> {
    let video = JSON.parse(localStorage.getItem('Video') || '{}');
    if (video && video != 'undefined') {
        this.video = video;
    } else {
        this.video = null;
    }
    return this.video;
  }

  // create de course
  create(token: any, video: any): Observable<any> {
    if (video.url){
      video.url = GLOBAL.htmlEntities(video.url);
    }
    if (video.content) {
      video.content = GLOBAL.htmlEntities(video.content);
    }

    let json = JSON.stringify(video);
    let params = 'json=' + json;

    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);

    return this._http.post(this.url + 'videos', params, { headers: headers });
  }

  //get videos by course
  getVideosByCourse(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    return this._http.get(this.url + 'videos/getVideosByCourse/' + id, { headers: headers });
  }

  // get video
  getVideo(id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'videos/' + id, { headers: headers });
  }

  // update video
  update(token: any, video: any, id: any): Observable<any> {
    if (video.content) {
      video.content = GLOBAL.htmlEntities(video.content);
    }
    if (video.url) {
      video.url = GLOBAL.htmlEntities(video.url);
    }
    let json = JSON.stringify(video);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                   .set('Authorization', token);
    return this._http.put(this.url + 'videos/' + id, params, { headers: headers });
  }

  // update title
  updateTitle(token: any, video: any, id: any): Observable<any> {
    let json = JSON.stringify(video);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                  .set('Authorization', token);
    return this._http.put(this.url + 'videos/updateTitle/' + id, params, { headers: headers });
  }
}
