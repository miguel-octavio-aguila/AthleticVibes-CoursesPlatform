import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { Course } from '../../models/Course';
import { FileUploadService } from '../../services/file.upload.service';

declare var iziToast: any;

@Component({
  selector: 'app-course-edit',
  imports: [CommonModule, FormsModule, RouterModule, NgxDropzoneModule],
  templateUrl: '../course-new/course-new.component.html',
  styleUrl: './course-edit.component.css',
  providers: [CourseService, UserService, CategoryService]
})
export class CourseEditComponent {
  public title: string;
  public identity: any;
  public token: any;
  public course: any;
  public course_: Course;
  public status: any;
  public edit: boolean;
  public url_back: any;
  public url: any;
  public categories: any;
  public resetVar = true;
  public uploading = false;

  // ngx-dropzone options
  files: File[] = [];

  constructor(
    private _courseService: CourseService,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private fileUploadService: FileUploadService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.title = 'Edit the course';
    this.url_back = GLOBAL.url;
    this.course = this._courseService.getCourse();
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.edit = true;
    this.course_ = new Course(
      this.course.id,
      this.course.name,
      this.course.category_id,
      this.course.detail,
      this.course.image,
      this.course.url,
      this.course.accordion,
      this.course.current_price,
      this.course.previous_price,
      this.course.num_sales);
  }

  ngOnInit(): void {
    this.getCategories();
    this.getCourse();
  }
  
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  // creaate a promise with no value 
  uploadCourse(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if files are selected
      this.fileUploadService.uploadCourse(this.files[0]).subscribe({
        next: (response: any) => {
          // Check if the response contains an image
          if (response.image) {
            // Update the user object with the new image
            this.course_.image = response.image;
            this.course.image = response.image;
            // Save the new image in local storage
            localStorage.setItem('Course', JSON.stringify(this.course));
            // To indicate that the image is uploaded and the uploading is finished
            this.uploading = false;
            // Indicate success of the promise
            resolve();
          } else {
            this.status = 'error';
            this.uploading = false;
            reject('Error uploading image');
          }
        },
        error: (error) => {
          console.log(error);
          this.status = 'error';
          this.uploading = false;
          reject(error);
        }
      });
    });
  }
  
  // onSubmit method to handle form submission
  // form is the form object that is passed from the template
  // async is used to indicate that this method is asynchronous and will return a promise, so we can use await inside it
  async onSubmit(form: any) {
    // try catch is used to handle errors that may occur during the execution of the code inside the try block
    try {
      // First, check if the user has selected any files to upload
      if (this.files.length > 0) {
        this.uploading = true;
        // Call the uploadImage method to upload the image
        // and await for it to finish before proceeding
        await this.uploadCourse();
      }
      this.course.category_id = Number(this.course.category_id);
      // Save the user data
      this._courseService.update(this.token, this.course, this.course.id).subscribe({
        next: (response) => {
          if (!response.course) {
            this.status = 'error';
            // iziToast
            iziToast.show({
              title: 'Error',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'The course has not been updated.'
            });
          } else {
            this.status = 'success';
            // iziToast
            iziToast.show({
              title: 'Success',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'The course has been updated successfully.'
            });
            this.course = response.course;
            localStorage.setItem('Course', JSON.stringify(this.course));
            // Make a timeout to scroll to the top of the page after 100ms
            setTimeout(() => {
              // Scroll to the top of the page in a smooth way
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // Alternative using ViewChild:
              // this.topElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
              // wait to reload the page
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }, 100);
          }
        },
        error: (error) => {
          this.status = 'error';
          console.log(error);
        }
      });
    } catch (error) {
      this.status = 'error';
      console.log(error);
    }
  }

  getCategories() {
    this._categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.status == 'success') {
          this.categories = response.categories;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getCourse() {
    this._route.params.subscribe({
      next: (params) => {
        var id = +params['id'];
        this._courseService.getCourseInfo(id, this.token).subscribe({
          next: (response) => {
            if (response.status == 'success') {
              this.course = response.course;
              this.course_.id = this.course.id;
              this.course_.name = this.course.name; 
            } else {
              this._router.navigate(['/home']);
            }
          },
          error: (error) => {
            console.log(error);
            this._router.navigate(['/home'])
          }
        });
        },
      error: (error) => {
        console.log(error);
        this.status = 'error';
        this._router.navigate(['/home'])
      } 
    });
  }
}
