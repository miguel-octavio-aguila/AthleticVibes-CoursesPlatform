import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { UserService } from './user.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private categoryService: CategoryService
  ) { }

  uploadFile(file: File): Observable<any> {
    // Create a FormData object to hold the file data
    const formData = new FormData();
    formData.append('file0', file, file.name);
    
    // Obtain the token from the UserService
    const token = this.userService.getToken();
    
    // Configure the headers for the request
    const headers = new HttpHeaders({
      'Authorization': token
    });
    
    // Make the POST request to upload the file
    return this.http.post(GLOBAL.url + 'upload', formData, { headers });
  }

  uploadCourse(file: File): Observable<any> {
    // Create a FormData object to hold the file data
    const formData = new FormData();
    formData.append('file0', file, file.name);
    
    // Obtain the token from the UserService
    const token = this.userService.getToken();
    
    // Configure the headers for the request
    const headers = new HttpHeaders({
      'Authorization': token
    });
    
    // Make the POST request to upload the file
    return this.http.post(GLOBAL.url + 'courses/upload', formData, { headers });
  }

  uploadVideo(file: File): Observable<any> {
    // Create a FormData object to hold the file data
    const formData = new FormData();
    formData.append('file0', file, file.name);

    // Obtain the token from the UserService
    const token = this.userService.getToken();

    // Configure the headers for the request
    const headers = new HttpHeaders({
      'Authorization': token
    });

    // Make the POST request to upload the file
    return this.http.post(GLOBAL.url + 'videos/doc', formData, { headers });
  }

  uploadComment(file: File): Observable<any> {
    // Create a FormData object to hold the file data
    const formData = new FormData();
    formData.append('file0', file, file.name);

    // Obtain the token from the UserService
    const token = this.userService.getToken();

    // Configure the headers for the request
    const headers = new HttpHeaders({
      'Authorization': token
    });

    // Make the POST request to upload the file
    return this.http.post(GLOBAL.url + 'comments/upload', formData, { headers });
  }

  uploadResponse(file: File): Observable<any> {
    // Create a FormData object to hold the file data
    const formData = new FormData();
    formData.append('file0', file, file.name);

    // Obtain the token from the UserService
    const token = this.userService.getToken();

    // Configure the headers for the request
    const headers = new HttpHeaders({
      'Authorization': token
    });

    // Make the POST request to upload the file
    return this.http.post(GLOBAL.url + 'responses/upload', formData, { headers });
  }
}
