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
  public videos: any[] = [];

  // froala_options
  public froala_options: Object = {
    charCounterCount: true,
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
    toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
    colorsBackground: ['#61BD6D', '#1ABC9C', '#54ACD2', 'REMOVE'],
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
      this.video.user_id = this.identity.sub,
      this.video.course_id,
      this.video.title,
      this.video.content,
      this.video.url,
      this.video.file,
      this.video.section,
      this.video.accordion_title);
  }

  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this._courseService.getCourseInfo(id, this.token).subscribe({
        next: (response) => {
          if (response.status == 'success') {
            this.course = response.course;
            this.accordion = response.accordion;
            this.video.course_id = id;
            this.getVideos();
          } else {
            this.handleError('Error loading course data');
          }
        },
        error: (error) => {
          console.error('Course loading error:', error);
          this.handleError('Error loading course data');
        }
      });
    });
  }
  
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onRemoveAll(): void {
    this.files = [];
  }

  handleError(message: string): void {
    this.status = 'error';
    iziToast.show({
      title: 'Error',
      titleColor: '#FF0000',
      color: '#FFF',
      class: 'text-danger',
      position: 'topRight',
      message: message
    });
  }

  handleSuccess(message: string): void {
    this.status = 'success';
    iziToast.show({
      title: 'Success',
      titleColor: '#1DC74C',
      color: '#FFF',
      class: 'text-success',
      position: 'topRight',
      message: message
    });
  }

  uploadVideo(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.files.length === 0) {
        resolve(); // No files to upload
        return;
      }
      
      this.uploading = true;
      this.fileUploadService.uploadVideo(this.files[0]).subscribe({
        next: (response: any) => {
          if (response.file) {
            this.video_.file = response.file;
            this.video.file = response.file;
            this.uploading = false;
            resolve();
          } else {
            this.uploading = false;
            reject('Error uploading file: No file received in response');
          }
        },
        error: (error) => {
          console.error('Upload error details:', error);
          this.uploading = false;
          reject(error);
        }
      });
    });
  }

  stripHtml(html: string): string {
    if (!html) return '';
    const temporalElement = document.createElement('div');
    temporalElement.innerHTML = html;
    return temporalElement.textContent || temporalElement.innerText || '';
  }

  async onSubmit(form: any) {
    if (!form.valid) {
      this.handleError('Please fill all required fields correctly');
      return;
    }
    
    localStorage.setItem('Video', JSON.stringify(this.video));
    
    try {
      // First upload the file if any
      if (this.files.length > 0) {
        await this.uploadVideo();
      }
      
      this._route.params.subscribe(params => {
        let id = +params['id'];
        this.video.course_id = id;

        // Process the form data
        if (this.video.file === '') {
          this.video.file = null;
        }

        // Ensure numeric types
        this.video.course_id = Number(this.video.course_id);
        this.video.user_id = Number(this.video.user_id);
        this.video.section = Number(this.video.section);

        // Sanitize YouTube URL by removing the app=desktop parameter
        const sanitizedUrl = form.value.url.replace('?app=desktop&', '?');
        this.video.url = sanitizedUrl;
        
        // Clean HTML content
        if (this.video.content) {
          this.video.content = this.stripHtml(this.video.content);
        }

        // Get all videos for this course and check for accordion title
        this._videoService.getVideosByCourse(this.video.course_id).subscribe({
          next: (response) => {
            if (response.status === 'success') {
              // Assign videos
              if (response.videos) {
                this.videos = response.videos;
              } else if (response.video && Array.isArray(response.video)) {
                this.videos = response.video;
              } else {
                this.videos = [];
              }
              
              // Handle accordion title updates
              if (form.value.accordion_title === '') {
                form.value.accordion_title = null;
                this.video.accordion_title = null;
              }
              
              // Check if we need to clear accordion titles for other videos
              if (form.value.accordion_title !== '' && form.value.accordion_title !== null) {
                this.checkAndClearAccordionTitles(form.value.section);
              }
              
              // Save the video
              this.create_video();
            } else {
              this.handleError('Failed to get videos for this course');
            }
          },
          error: (error) => {
            console.error('Error fetching videos:', error);
            this.handleError('Failed to get videos for this course');
          }
        });
      });
    } catch (error) {
      console.error('Error during submission:', error);
      this.handleError('An error occurred during submission');
    }
  }

  checkAndClearAccordionTitles(section: number): void {
    if (!Array.isArray(this.videos) || this.videos.length === 0) {
      return;
    }

    // Find videos in the same section with accordion_title
    for (const vid of this.videos) {
      if (vid.section == section && vid.accordion_title != null) {
        this.update_title(vid.id);
        break;
      }
    }
  }

  create_video() {
    // Save the video data
    this._videoService.create(this.token, this.video).subscribe({
      next: (response) => {
        if (!response.video || !response || response.status == 'error') {
          this.handleError('The video has not been created.');
        } else {
          this.handleSuccess('The video has been created successfully.');
          
          localStorage.setItem('Video', JSON.stringify(this.video));
          
          // Smooth scroll to top and reload page
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
              window.location.reload();
              localStorage.removeItem('Video');
            }, 1000);
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error creating video:', error);
        this.handleError('Error creating video: ' + (error.message || 'Unknown error'));
      }
    });
  }

  update_title(id: any) {
    this._videoService.updateTitle(this.token, this.video, id).subscribe({
      next: (response) => {
        if (response.status !== 'success') {
          console.warn('Title update was not successful');
        }
      },
      error: (error) => {
        console.error('Error updating title:', error);
      }
    });
  }

  getVideos() {
    // Get all videos for this course
    this._videoService.getVideosByCourse(this.video.course_id).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          if (response.videos) {
            this.videos = response.videos;
          } else if (response.video && Array.isArray(response.video)) {
            this.videos = response.video;
          } else {
            this.videos = [];
          }
        } else {
          this.handleError('The videos have not been loaded.');
        }
      },
      error: (error) => {
        console.error('Error fetching videos:', error);
      }
    });
  }
}