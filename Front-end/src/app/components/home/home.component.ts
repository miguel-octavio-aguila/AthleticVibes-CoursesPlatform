import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GLOBAL } from '../../services/global';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [CourseService, UserService]
})
export class HomeComponent {
  public title: string;
  public courses: any;
  public identity: any;
  public status: any;
  public token: any;
  public url: any;

  constructor(
    private _courseService: CourseService,
    private _userService: UserService,
  ){
    this.title = 'Home';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.getCourses(); 
  }

  getCourses(){
    this._courseService.getCourses().subscribe(
      response => {
        console.log(response);
        if(response.status == 'success'){
          this.courses = response.courses;
        }
      },
      error => {
        console.log(error);
      }
    ); 
  }

  // show the videos of youtube
  getThumbnail(url: string, size: any) {
    var video, results, thumbnail_url;  

    // if url is null
    if (url === null) {
      return ''; 
    }
    // identification of youtube video
    results = url.match('[\\?&]v=([^&#]*)');
    // if results is null save into 'video', if results is not null save into 'results[1]'
    video = (results === null) ? url : results[1];
    // if size is not null
    if (size !== null) {
      thumbnail_url = 'https://img.youtube.com/vi/'+ video + '/' + size+ '.jpg'; 
    } else {
      // default size
      thumbnail_url = 'https://img.youtube.com/vi/' + video + '/mqdefault.jpg';
    }
    return thumbnail_url;
  }

  // delete course
  deleteCourse(id: any){
    this._courseService.delete(this.token, id).subscribe(
      response => {
        this.getCourses();
        setTimeout(() => {
          window.location.reload();
        }, 100);
      },
      error => {
        console.log(error);
      }
    );
  }
}
