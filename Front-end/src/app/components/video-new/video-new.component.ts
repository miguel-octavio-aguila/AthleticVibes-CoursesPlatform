import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { VideoService } from '../../services/video.service';
import { UserService } from '../../services/user.service';
import { CourseService } from '../../services/course.service';
import { FileUploadService } from '../../services/file.upload.service';
import { Video } from '../../models/Video';
import { CommonModule } from '@angular/common';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

// this is a global variable for iziToast
declare var iziToast: any;

@Component({
  selector: 'app-video-new',
  imports: [CommonModule, NgxDropzoneModule, FormsModule, FroalaEditorModule, FroalaViewModule],
  templateUrl: './video-new.component.html',
  styleUrl: './video-new.component.css',
  providers: [VideoService, UserService, CourseService, FileUploadService]
})
export class VideoNewComponent {
  public title: string;
  public url: string;
  public video_: Video;
  public video: any;
  public token: any;
  public identity: any;
  public status: any;
  public edit: any;
  public course: any = { name: ''};
  public accordion: Array<any> = [];
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
    private _route: ActivatedRoute,
    private _videoService: VideoService,
    private _userService: UserService,
    private _courseService: CourseService,
    private fileUploadService: FileUploadService
  ){
    this.title = 'Save a new video';
    this.url = GLOBAL.url;
    this.video = this._videoService.getVideos();
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.edit = false;
    this.video_ = new Video(
      this.video.id,
      this.video.user_id = this.identity.sub ,
      this.video.course_id,
      this.video.title,
      this.video.content,
      this.video.url,
      this.video.file,
      this.video.section,
      this.video.accordion_title);
  }

  ngOnInit(): void {
    this.getCourse();
  }
  
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  getCourse() {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this._courseService.getCourseInfo(id, this.token).subscribe(
        response => {
          if (response.status == 'success') {
            this.course = response.course;
            this.accordion = response.accordion;
            this.video.course_id = id;
          } else {
            this.status = 'error on getCourse()';
          }
        },
        error => {
          console.log(error);
        }
      )
    })
  }

  onRemoveAll(): void {
    // Limpiar el array de archivos
    this.files = [];
  }

  // creaate a promise with no value 
  uploadVideo(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if files are selected
      this.fileUploadService.uploadVideo(this.files[0]).subscribe({
        next: (response: any) => {
          // Check if the response contains an file
          if (response.file) {
            // Update the user object with the new file
            this.video_.file = response.file;
            this.video.file = response.file;
            // Save the new image in local storage
            localStorage.setItem('Video', JSON.stringify(this.course));
            // To indicate that the image is uploaded and the uploading is finished
            this.uploading = false;
            // Indicate success of the promise
            resolve();
          } else {
            this.status = 'error';
            this.uploading = false;
            reject('Error uploading file');
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

  async onSubmit(form: any) {
    localStorage.setItem('Video', JSON.stringify(this.video));
    // try catch is used to handle errors that may occur during the execution of the code inside the try block
    try {
      // First, check if the user has selected any files to upload
      if (this.files.length > 0) {
        this.uploading = true;
        // Call the uploadImage method to upload the image
        // and await for it to finish before proceeding
        await this.uploadVideo();
      }
      this._route.params.subscribe(params => {
        let id = +params['id'];
        this.video.course_id = id;
        if (this.video.file == '') {
          this.video.file = null;
        }

        // Convert string IDs to numbers
        this.video.course_id = Number(this.video.course_id);
        this.video.user_id = Number(this.video.user_id);
        this.video.section = Number(this.video.section);

        if (form.valid) {
          // Clean HTML from description before saving
          this.video.content = this.stripHtml(this.video.content);
        }

        // Save the video data
        this._videoService.create(this.token, this.video).subscribe({
          next: (response) => {
            console.log(response);
            console.log(this.video);
            console.log(this.token);
            
            
            if (!response.video || !response || response.status == 'error') {
              this.status = 'error';
              console.log(response);
              console.log(this.video);
              
              // iziToast
              iziToast.show({
                title: 'Error',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message: 'The video has not been created.'
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
                message: 'The video has been created successfully.'
              });
              this.video = response.video;
              localStorage.setItem('Video', JSON.stringify(this.video));
              // Make a timeout to scroll to the top of the page after 100ms
              setTimeout(() => {
                // Scroll to the top of the page in a smooth way
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // Alternative using ViewChild:
                // this.topElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
                // wait to reload the page
                setTimeout(() => {
                  window.location.reload();
                  localStorage.removeItem('Video');
                }, 1000);
              }, 100);
            }
          },
          error: (error) => {
            this.status = 'error';
            console.log(error);
          }
        });
      });
    } catch (error) {
      this.status = 'error';
      console.log(error);
    }
  }
}
