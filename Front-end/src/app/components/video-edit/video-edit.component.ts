import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { finalize, switchMap, tap } from 'rxjs/operators';

// this is a global variable for iziToast
declare var iziToast: any;

@Component({
  selector: 'app-video-edit',
  imports: [CommonModule, NgxDropzoneModule, FormsModule, FroalaEditorModule, FroalaViewModule, RouterModule],
  templateUrl: '../video-new/video-new.component.html',
  styleUrl: '../video-new/video-new.component.css'
})
export class VideoEditComponent {
  public title: string;
  public url: string;
  public video_: Video;
  public video: any = {}; // Initialize as empty object to prevent null errors
  public token: any;
  public identity: any;
  public status: any;
  public edit: any;
  public course: any = { name: '' };
  public accordion: Array<any> = [];
  public uploading = false;
  public videos: any[];

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
    private _router: Router,
    private _videoService: VideoService,
    private _userService: UserService,
    private _courseService: CourseService,
    private fileUploadService: FileUploadService
  ) {
    this.title = 'Update a video';
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.edit = true;
    this.videos = []; // Initialize videos array
    
    // Initialize with empty object - we'll populate it later
    this.video_ = new Video(
      0, // Default id
      0, // Default user_id
      0, // Default course_id
      '', // Default title
      '', // Default content
      '', // Default url
      '', // Default file
      0,  // Default section
      '' // Default accordion_title
    );
  }

  ngOnInit(): void {
    this.loadData();
  }
  
  // Load data in the correct sequence
  loadData(): void {
    this._route.params.subscribe(params => {
      let videoId = +params['id'];
      
      // First get the video info
      this._videoService.getVideo(videoId).subscribe({
        next: (response) => {
          if (response.status == 'success') {
            this.video = response.video;
            
            // After getting video, get the course info
            if (this.video && this.video.course_id) {
              this._courseService.getCourseInfo(this.video.course_id, this.token).subscribe({
                next: (courseResponse) => {
                  if (courseResponse.status == 'success') {
                    this.course = courseResponse.course;
                    this.accordion = courseResponse.accordion;
                    
                    // Now initialize the video_ object with proper values
                    this.video_ = new Video(
                      this.video.id,
                      this.video.user_id,
                      this.video.course_id,
                      this.video.title,
                      this.video.content,
                      this.video.url,
                      this.video.file,
                      this.video.section,
                      this.video.accordion_title
                    );
                    
                    // Cache in localStorage for redundancy
                    localStorage.setItem('Video', JSON.stringify(this.video));
                  } else {
                    this.handleError('Error loading course data');
                  }
                },
                error: (error) => {
                  console.error('Course loading error:', error);
                  this.handleError('Error loading course data');
                }
              });
            } else {
              this.handleError('Invalid video data - missing course ID');
            }
          } else {
            this.handleError('Error loading video data');
          }
        },
        error: (error) => {
          console.error('Video loading error:', error);
          this.handleError('Error loading video data');
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

  // Upload video file
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
    
    try {
      // First upload the file if any
      if (this.files.length > 0) {
        await this.uploadVideo();
      }
      
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

      // Get all videos for this course
      this._videoService.getVideosByCourse(this.video.course_id).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.status = 'success';
            
            // Fix: Check if videos exist in the response and assign them properly
            // The API returns "video" (singular) not "videos" (plural)
            if (response.videos) {
              this.videos = response.videos;
            } else if (response.video && Array.isArray(response.video)) {
              this.videos = response.video;
            } else {
              this.videos = []; // Initialize as empty array if no videos found
            }
            
            // Handle accordion title updates if needed
            if (form.value.accordion_title == '') {
              form.value.accordion_title = null;
            }
            
            if (form.value.accordion_title == '' || form.value.accordion_title == null) {
              // No accordion title to process
            } else {
              // Make sure this.videos is iterable before using forEach or for...of
              if (Array.isArray(this.videos)) {
                for (const vid of this.videos) {
                  if (form.value.section == vid['section'] && vid['accordion_title'] != null) {
                    this.update_title(vid['id']);
                    break;
                  }
                }
              }
            }
            
            localStorage.setItem('Video', JSON.stringify(this.video));
            // Update the video
            this.update_video();
            setTimeout(() => {
              // Scroll to the top of the page in a smooth way
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // wait to reload the page
              setTimeout(() => {
                this._router.navigate(['/video-detail/', this.video.id]).then(() => {
                  window.location.reload();
                  localStorage.removeItem('Video');
                });
              }, 1000);
            }, 100);
          } else {
            this.status = 'error';
            this.handleError('Failed to get videos for this course');
          }
        },
        error: (error) => {
          console.error('Error fetching videos:', error);
          this.handleError('Failed to get videos for this course');
        }
      });
    } catch (error) {
      console.error('Error during submission:', error);
      this.handleError('An error occurred during submission');
    }
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

  update_video() {
    this._videoService.update(this.token, this.video, this.video.id).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.handleSuccess('The video has been updated successfully');
        } else {
          console.log(response);
          this.handleError('The video has not been updated');
        }
      },
      error: (error) => {
        console.error('Error updating video:', error);
        this.handleError('Error updating video: ' + (error.message || 'Unknown error'));
      }
    });
  }
}