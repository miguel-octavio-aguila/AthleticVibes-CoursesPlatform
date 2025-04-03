import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  public url: string;

  constructor(
    public http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  // create method
  create(token: string, course: any): Observable<any> {
    let json = JSON.stringify(course);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('Authorization', token);
    return this.http.post(this.url + 'course', params, { headers: headers });
  }
}
