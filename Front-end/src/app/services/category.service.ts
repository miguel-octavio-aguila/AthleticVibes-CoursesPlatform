// this import injectable is used to inject the service into other components
import { Injectable } from "@angular/core";
// this import httpclient is used to make http requests
// this import httpheaders is used to set headers for the http requests
import { HttpClient, HttpHeaders } from "@angular/common/http";
// this import observable is used to subscribe to the http requests
import { Observable } from "rxjs";
// this import category is used to define the category model
import { Category } from "../models/Category";
import { GLOBAL } from "./global";

@Injectable({
  providedIn: "root"
})

export class CategoryService {
  public apiUrl: string = GLOBAL.url;

  constructor(public http: HttpClient) {
    this.apiUrl
  }

  getCategories(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.get(this.apiUrl + 'categories', { headers: headers });
  }
}