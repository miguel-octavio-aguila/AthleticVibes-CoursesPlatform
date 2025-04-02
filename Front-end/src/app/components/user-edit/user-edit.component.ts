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

  uploadImage() {
    if (this.files.length > 0) {
      this.uploading = true;
      
      this.fileUploadService.uploadFile(this.files[0]).subscribe({
        next: (response: any) => {
          if (response.image) {
            this.user.image = response.image;
            this.identity.image = response.image;
            localStorage.setItem('identity', JSON.stringify(this.identity));
            this.status = 'success';
          } else {
            this.status = 'error';
          }
          this.uploading = false;
        },
        error: (error) => {
          console.log(error);
          this.status = 'error';
          this.uploading = false;
        }
      });
    }
  }

  onSubmit(form:any) {
    this.userService.update(this.token, this.user).subscribe({
      next: (response) => {
        if (!response.user) {
          this.status = 'error';
        } else {
          this.status = 'success';
          this.identity = this.user;
          localStorage.setItem('identity', JSON.stringify(this.user));
          // Redirect to the user profile page
          this.router.navigate(['/settings']).then(() => {
            // Reload the page to reflect the changes
            //window.location.reload();
          });
        }
      },
      error: (error) => {
        this.status = 'error';
        console.log(error);
      }
    });
  }

  avatarUpload(data: any) {
    // let _data is a variable that holds the data returned from the server
    let _data = JSON.parse(data.response);
    // add the image to the user object
    this.user.image = _data.image;
  }
}
