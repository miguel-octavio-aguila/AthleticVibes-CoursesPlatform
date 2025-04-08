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
    // clean htmlentities
    if (course.detail) {
      course.detail = GLOBAL.htmlEntities(course.detail);
    }
    if (course.url) {
      course.url = GLOBAL.htmlEntities(course.url);
    }
    let json = JSON.stringify(course);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('Authorization', token);
    return this.http.post(this.url + 'courses', params, { headers: headers });
  }

  // get courses for the home
  getCourses(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    return this.http.get(this.url + 'courses', { headers: headers });
  }

  // uodate de course
  update(token: any, course: any, id: any): Observable<any> {
    if (course.detail) {
      course.detail = GLOBAL.htmlEntities(course.detail);
    }
    if (course.url) {
      course.url = GLOBAL.htmlEntities(course.url);
    }
    let json = JSON.stringify(course);
    let params = 'json=' + json;
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                   .set('Authorization', token);
    return this.http.put(this.url + 'courses/' + id, params, { headers: headers });
  }

  // get course info
  getCourseInfo(id: any, token: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                   .set('Authorization', token);
    return this.http.get(this.url + 'courses/' + id, { headers: headers });
  }

  // delete course
  delete(token: any, id: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                  .set('Authorization', token);
    return this.http.delete(this.url + 'courses/' + id, { headers: headers });
  }
}
