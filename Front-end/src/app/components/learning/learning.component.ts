import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { CartService } from '../../services/cart.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-learning',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: '../home/home.component.html',
  styleUrl: '../home/home.component.css',
  providers: [CourseService, UserService, CartService, SaleService]
})
export class LearningComponent {
  public title: string;
  public courses: any;
  public identity: any;
  public status: any;
  public token: any;
  public url: any;
  public cart: any;

  constructor(
    private _courseService: CourseService,
    private _userService: UserService,
    private _saleService: SaleService,
    private _router: Router
  ){
    this.title = 'My courses';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    if (this.identity.sub || this.identity.id || this.identity.name) {
      this.myCourses();
    } else {
      this._router.navigate(['/login']);
    }
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
        this.myCourses();
        setTimeout(() => {
          window.location.reload();
        }, 100);
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit(form: any){}

  myCourses(){
    this._saleService.myCourses(this.token).subscribe(
      response => {
        if(response.status =='success'){
          this.courses = response.courses;
        } else {
          this._router.navigate(['/home']);
        }
      },
      error => {
        console.log(error);
      }
    )
  }
}
