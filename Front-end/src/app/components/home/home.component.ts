import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/Cart';
import { SaleService } from '../../services/sale.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [CourseService, UserService, CartService, SaleService]
})
export class HomeComponent {
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
    private _cartService: CartService,
    private _saleService: SaleService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.title = 'Home';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.cart = new Cart(1, 1, 1, 1);
  }

  ngOnInit(){
    this._route.params.subscribe(params => {
      let id = +params['id'];
      let text = params['text'];
      if (id || text) {
        if (this.identity.sub || this.identity.id || this.identity.name) {
          if (id) {            
            this.getSalesByCategory(id);
          } else {
            this.getSalesByText(text);
          }
        } else {
          if (id) {            
            this.getCoursesByCategory(id);
          } else {
            this.getCoursesByText(text);
          }
        }
      } else {
        if (this.identity.sub) {
          this.getSales();
        } else {
          this.getCourses(); 
        }
      } 
    });
  }

  getCourses(){
    this._courseService.getCourses().subscribe(
      response => {
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

  // onSubmit of cart
  onSubmit(form: any){
    if(this.identity.sub == null || this.identity.sub == undefined || this.identity.sub == ''){
      this._router.navigate(['/login']);
    } else if(this.identity.sub) {
      this.cart.course_id = form.value.course_id;
      this._cartService.store(this.token, this.cart).subscribe(
        response => {
          if(response.status == 'success'){
            this.status = response.status;
            this.cart = response;
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        },
        error => {
          console.log(error);
        }
      )
    }
  }

  // get sales
  getSales(){
    this._saleService.getSales(this.token).subscribe(
      response => {
        if(response.status =='success'){
          this.courses = response.courseStatus;
          console.log(this.courses);
        } else {
          this._router.navigate(['/home']);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  // get sales by category
  getSalesByCategory(id: any){
    this._saleService.getSalesByCategory(this.token, id).subscribe(
      response => {
        if(response.status =='success'){
          this.courses = response.courseStatus;
        } else {
          this._router.navigate(['/home']);
        }
      }
    )
  }

  // get courses by category
  getCoursesByCategory(id: any){
    this._courseService.getCoursesByCategory(id).subscribe(
      response => {
        if(response.status =='success'){
          this.courses = response.courses;
        } else {
          this._router.navigate(['/home']);
        }
      }
    )
  }

  // get sales by text
  getSalesByText(text: any){
    this._saleService.getSalesByText(this.token, text).subscribe(
      response => {
        if(response.status =='success'){
          this.courses = response.courseStatus;
        } else {
          this._router.navigate(['/home']);
        }
      }
    )
  }

  // get courses by text
  getCoursesByText(text: any){
    this._courseService.getCoursesByText(text).subscribe(
      response => {
        if(response.status =='success'){
          this.courses = response.courses;
        } else {
          this._router.navigate(['/home']);
        }
      }
    )
  }
}
