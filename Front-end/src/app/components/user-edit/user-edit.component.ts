import { Component, OnInit } from '@angular/core';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { FileUploadService } from '../../services/file.upload.service';
import { GLOBAL } from '../../services/global';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FroalaEditorModule, FroalaViewModule, NgxDropzoneModule, CommonModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {
  public page_title: string;
  public user: User; // User object
  public status: any;
  public identity: any;
  public token: any;
  public resetVar = true;
  public url: any;
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
    private userService: UserService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.page_title = 'User Settings';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
    // user object
    this.user = new User(
      this.identity.sub,
      this.identity.name,
      this.identity.surname,
      this.identity.role,
      this.identity.email,'',
      this.identity.description,
      this.identity.image,
    )
  }

  ngOnInit(): void {
  }
  
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  // creaate a promise with no value 
  uploadImage(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if files are selected
      this.fileUploadService.uploadFile(this.files[0]).subscribe({
        next: (response: any) => {
          // Check if the response contains an image
          if (response.image) {
            // Update the user object with the new image
            this.user.image = response.image;
            this.identity.image = response.image;
            // Save the new image in local storage
            localStorage.setItem('identity', JSON.stringify(this.identity));
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
        await this.uploadImage();
      }
      
      // Save the user data
      this.userService.update(this.token, this.user).subscribe({
        next: (response) => {
          if (!response.user) {
            this.status = 'error';
          } else {
            this.status = 'success';
            this.identity = this.user;
            localStorage.setItem('identity', JSON.stringify(this.user));
            
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
}