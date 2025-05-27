import { Component } from '@angular/core';
import { GLOBAL } from '../../services/global';
import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { FileUploadService } from '../../services/file.upload.service'; 
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/Comment';
// jQuery is already declared globally via 'declare var $: any'

declare var $: any;
// this is a global variable for iziToast
declare var iziToast: any;

@Component({
  selector: 'app-video-detail',
  imports: [RouterModule, CommonModule, FormsModule, NgxDropzoneModule, FroalaEditorModule, FroalaViewModule],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.css',
  providers: [VideoService, CourseService, UserService, CommentService, FileUploadService]
})
export class VideoDetailComponent {
  public identity: any;
  public token: any;
  public course: any;
  public videos: any;
  public accordion: Array<any> = [];
  public status: any;
  public contentAccordionOpen: boolean = false;
  public video: any;
  public comment_: Comment;
  public comment: any;
  public comments: any;
  public response_cont: any;
  public users: any;
  public url: any;
  public is_edit: any;
  public show = false;
  public uploading = false;
  public showImg = false;

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
    private _videoService: VideoService,
    private _courseService: CourseService,
    private _userService: UserService,
    private _commentService: CommentService,
    private fileUploadService: FileUploadService,
    private _route: ActivatedRoute,
    private _router: Router,
    private sanitizer: DomSanitizer
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.is_edit = false;

    this.comment = {
      id: null,
      user_id: this.identity?.sub || null,
      video_id: null,
      title: '',
      comment: '',
      image: null
    };

    this.comment_ = new Comment(
      0,
      0,
      0,
      '',
      '',
      ''
    )
  }

  ngOnInit(): void {
    this.getVideo();
  }

  public newComment() {
    this.comment_ = new Comment (
      this.comment.id,
      this.comment.user_id = this.identity.sub,
      this.comment.video_id,
      this.comment.title,
      this.comment.comment,
      this.comment.image
    )
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

  // creaate a promise with no value 
  uploadComment(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if files are selected
      this.fileUploadService.uploadComment(this.files[0]).subscribe({
        next: (response: any) => {
          // Check if the response contains an image
          if (response.image) {
            // Update the user object with the new image
            this.comment_.image = response.image;
            this.comment.image = response.image;
            // Save the new image in local storage
            localStorage.setItem('Comment', JSON.stringify(this.comment));
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

  getVideo() {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this._videoService.getVideo(id).subscribe(
        response => {
          if (response.status == 'success') {
            this.video = response.video;
            this.comment.video_id = this.video.id;
            // initialize the comment
            this.newComment();

            // for the youtube video
            var results = this.video.url.match('[\\?&]v=([^&#]*)');
            var video = (results === null) ? this.video.url : results[1];
            this.video.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?controls=0');

            this.getVideosByCourse();
            this.getCourse();
            this.getComments();
          } else {
            this._router.navigate(['/']);
            this.status = 'error on getVideo()';
          }
        },
        error => {
          this._router.navigate(['/']);
          console.log(error);
        }
      )
    })
  }

  getCourse() {
    this._courseService.getCourseInfo(this.video.course_id, this.token).subscribe(
      response => {
        if (response.status == 'success') {
          this.course = response.course;
          this.accordion = response.accordion;
          // for the youtube video
          var results = this.course.url.match('[\\?&]v=([^&#]*)');
          var video = (results === null) ? this.course.url : results[1];
          this.course.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?controls=0');
        } else {
          this.status = 'error on getCourse()';
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  getVideosByCourse() {
    this._videoService.getVideosByCourse(this.video.course_id).subscribe(
      response => {
        if (response.status == 'success') {
          this.videos = response.videos;
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  deleteVideo(id: any) {
    this._videoService.delete(this.token, id).subscribe(
      response => {
        if (response.status =='success') {
          this.getVideosByCourse();
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          this.status = 'error on deleteVideo()';
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  getComments() {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this._commentService.getComments(id, this.token).subscribe(
        response => {
          if (response.status =='success') {
            this.comments = response.comments;
            this.response_cont = response.response_cont;            
            this.users = response.users;
          } else if (response.status == 'success' && response.state == 'empty') {
            this.comments = null;
          }
        },
        error => {
          console.log(error);
        }
      );
    });
  }

  // Method to show Questions and Answers
  show_chat() {
    $('#multiCollapseDescription').hide();
    $('#multiCollapseChat').show();
  }

  // Method to show Description
  show_des() {
    $('#multiCollapseChat').hide();
    $('#multiCollapseDescription').show();
  }

  // method to show the form to create a comment
  showForm() {
    if(this.show === true) {
      $('#multiCollapseComment').hide();
      this.show = false;
    } else {
      $('#multiCollapseComment').show();
      this.show = true;
    }
  }

  // method to show the image of the comment
  showImage(id: any) {
    if(this.showImg === true) {
      $('#imageComment').hide();
      this.showImg = false;
    } else {
      $('#imageComment' + id).show();
      this.showImg = true;
    }
  }

  stripHtml(html: string): string {
    if (!html) return '';
    const temporalElement = document.createElement('div');
    temporalElement.innerHTML = html;
    return temporalElement.textContent || temporalElement.innerText || '';
  }

  async onSubmit(form: any) {
    try {
      if (this.files && this.files.length > 0) {
        this.uploading = true;
        await this.uploadComment();
      }
      
      this.comment.user_id = Number(this.comment.user_id);
      this.comment.video_id = Number(this.comment.video_id);
      
      if(form.valid) {
        this.comment.comment = this.stripHtml(this.comment.comment);
      }

      this._commentService.create(this.token, this.comment).subscribe({
        next: (response) => {
          if (response.status == 'success') {
            this.comment = response.comment;
            this.getComments();
            this.handleSuccess('Comment created successfully');
            setTimeout(() => {
              // Scroll to the top of the page in a smooth way
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // wait to reload the page
              setTimeout(() => {
                this._router.navigate(['/video-detail/', this.video.id]).then(() => {
                  window.location.reload();
                  localStorage.removeItem('Comment');
                });
              }, 1000);
            }, 100);
          } else {
            this.status = 'error';
            this.handleError('Error creating comment');
          }
        },
        error: (error) => {
          this.status = 'error';
          console.log(error);
        }
      });
    } catch (error) {
      console.error('Error uploading comment:', error);
      this.status = 'error';
      this.handleError('Error uploading comment');
    }
  }
}
