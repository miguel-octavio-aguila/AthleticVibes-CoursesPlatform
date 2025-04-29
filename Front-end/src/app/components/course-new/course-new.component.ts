import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/Course';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { FileUploadService } from '../../services/file.upload.service';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

// this is a global variable for iziToast
declare var iziToast: any;

@Component({
  selector: 'app-course-new',
  imports: [CommonModule, FormsModule, NgxDropzoneModule, FroalaEditorModule, FroalaViewModule],
  templateUrl: './course-new.component.html',
  styleUrl: './course-new.component.css',
  providers: [UserService, CourseService, CategoryService]
})
export class CourseNewComponent {
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
  public uploading = false;

  // froala_options
  public froala_options: Object = {
    // chatCounter: true is for the chat counter 
    charCounterCount: true,
    // toolbarButtons is for the toolbar buttons
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    // toolbarButtonsXS is for the toolbar buttons in xs devices
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    // toolbarButtonsSM is for the toolbar buttons in sm devices
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    // toolbarButtonsMD is for the toolbar buttons in md devices
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
    // backgroundColor is for the background color of the editor
    colorsBackground: ['#61BD6D', '#1ABC9C', '#54ACD2', 'REMOVE'],
    // events is for the events that are triggered in the editor
    // initialized is for the initialized event
    events: {
      initialized: function () {
        console.log('Froala Editor Initialized');
      }
    }
  };

  // ngx-dropzone options
  files: File[] = [];

  constructor(
    private _courseService: CourseService,
    private _userService: UserService,
    private _categoryService: CategoryService,
    private fileUploadService: FileUploadService
  ){
    this.title = 'Create a course';
    this.url_back = GLOBAL.url;
    this.course = this._courseService.getCourse();
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.edit = false;
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
  }
  
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onRemoveAll(): void {
    // Limpiar el array de archivos
    this.files = [];
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
          console.log('Upload error details:', error);
          this.status = 'error';
          this.uploading = false;
          reject(error);
        }
      });
    });
  }

  stripHtml(html: string): string {
    const temporalElement = document.createElement('div');
    temporalElement.innerHTML = html;
    return temporalElement.textContent || temporalElement.innerText || '';
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
      if (form.valid) {
        // Limpia el HTML de la descripción antes de guardar
        this.course.detail = this.stripHtml(this.course.detail);
      }
      // Save the user data
      this._courseService.create(this.token, this.course).subscribe({
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
              message: 'The course has not been created.'
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
              message: 'The course has been created successfully.'
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
                localStorage.removeItem('Course');
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
}
