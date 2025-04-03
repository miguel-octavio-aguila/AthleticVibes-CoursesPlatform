import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  public url: string;
  public course: any;

  constructor(
    public http: HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  getCourse(): Observable<any> {
    let course = JSON.parse(localStorage.getItem('Course') || '{}');
    if (course && course != 'undefined') {
        this.course = course;
    } else {
        this.course = null;
    }
    return this.course;
}

  // create method
  create(token: string, course: any): Observable<any> {
    let json = JSON.stringify(course);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('Authorization', token);
    return this.http.post(this.url + 'courses', params, { headers: headers });
  }
}
