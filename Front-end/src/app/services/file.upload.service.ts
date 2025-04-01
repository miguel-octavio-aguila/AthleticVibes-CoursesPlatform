import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) { }

  uploadFile(file: File): Observable<any> {
    // Create a FormData object to hold the file data
    const formData = new FormData();
    formData.append('file', file, file.name);
    
    // Obtain the token from the UserService
    const token = this.userService.getToken();
    
    // Configure the headers for the request
    const headers = new HttpHeaders({
      'Authorization': token
    });
    
    // Make the POST request to upload the file
    return this.http.post(GLOBAL.url + 'user/avatar/', formData, { headers });
  }
}
