import { Component, OnDestroy } from '@angular/core';
import { GLOBAL } from '../../services/global';
import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { ReponseService } from '../../services/reponse.service';
import { FileUploadService } from '../../services/file.upload.service';
import { ProgressService } from '../../services/progress.service';
import { CheckboxService } from '../../services/checkbox.service';
import { SaleService } from '../../services/sale.service';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/Comment';
import { Responxe } from '../../models/Responxe';
import { Checkbox } from '../../models/Checkbox';
import { ChartData, ChartEvent, ChartType } from 'chart.js';

declare const bootstrap: any;

// jquery variable
declare var $: any;
// this is a global variable for iziToast
declare var iziToast: any;

@Component({
  selector: 'app-video-detail',
  imports: [RouterModule, CommonModule, FormsModule, NgxDropzoneModule, FroalaEditorModule, FroalaViewModule],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.css',
  providers: [VideoService, CourseService, UserService, CommentService, FileUploadService, ReponseService, CheckboxService, SaleService]
})
export class VideoDetailComponent implements OnDestroy {
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
  public uploading = false;
  public show = false;
  public showImg = false;
  public showResponse = false;
  public showCommentEdit = false;
  public answers: any[] = [];
  public activeResponses: { [key: number]: boolean } = {};
  public responxe_: any;
  public responxe: any;
  public responses: any;
  public users_responses: any[] = [];
  public comment_user: any = {};
  public user_comment: any;
  public created_at: any;
  public responseToEdit: any;
  public checkbox_: any;
  public checkbox: any;
  public checkboxes: any;

  // for the progress
  public sale: any;
  public progress_: any;

  // chart graph
  public ChartLabels: string[] = ['', 'Progress'];
  public ChartData: ChartData<'doughnut'> = {
    labels: this.ChartLabels,
    datasets: [
      { data: [ ] }
    ]
  };
  public ChartType: ChartType = 'doughnut';

  // events of the chart
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }
  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

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
    private _responseService: ReponseService,
    private _progressService: ProgressService,
    private _checkboxService: CheckboxService,
    private _saleService: SaleService,
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

    this.responxe = {
      id: null,
      user_id: this.identity?.sub || null,
      comment_id: null,
      response: '',
      image: null
    };
    
    this.responxe_ = new Responxe(
      0,
      0,
      0,
      '',
      ''
    );

    this.checkbox = {
      id: null,
      user_id: this.identity?.sub || null,
      course_id: null,
      video_id: null,
      checkbox: 0,
    }

    this.checkbox_ = new Checkbox(
      0,
      0,
      0,
      0,
      0
    )
  }

  ngOnInit(): void {
    this.getVideo();
  }

  ngOnDestroy(): void {
    this._progressService.setProgress(0);
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

  public newResponse() {
    this.responxe_ = new Responxe (
      this.responxe.id,
      this.responxe.user_id = this.identity.sub,
      this.responxe.comment_id,
      this.responxe.response,
      this.responxe.image
    )
  }

  public newCheckbox() {
    this.checkbox_ = new Checkbox (
      this.checkbox.id,
      this.checkbox.user_id = this.identity.sub,
      this.checkbox.course_id,
      this.checkbox.video_id,
      this.checkbox.checkbox
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

  uploadCommentEdit(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if files are selected
      this.fileUploadService.uploadComment(this.files[0]).subscribe({
        next: (response: any) => {
          // Check if the response contains an image
          if (response.image) {
            // Update the user object with the new image
            this.comment_user.image = response.image;
            // Save the new image in local storage
            localStorage.setItem('Comment', JSON.stringify(this.comment_user));
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

  uploadResponse(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if files are selected
      this.fileUploadService.uploadResponse(this.files[0]).subscribe({
        next: (response: any) => {
          // Check if the response contains an image
          if (response.image) {
            // Update the user object with the new image
            this.responxe_.image = response.image;
            this.responxe.image = response.image;
            // Save the new image in local storage
            localStorage.setItem('Response', JSON.stringify(this.responxe));
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

  uploadResponseEdit(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if files are selected
      this.fileUploadService.uploadResponse(this.files[0]).subscribe({
        next: (response: any) => {
          // Check if the response contains an image
          if (response.image) {
            // Update the user object with the new image
            for (let i = 0; i < this.responses.length; i++) {
              if (this.responses[i].id === this.responseToEdit.id) {
                this.responses[i].image = response.image;
                break;
              }
            }
            // Save the new image in local storage
            localStorage.setItem('Comment', JSON.stringify(this.responses));
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
            this.checkbox.video_id = this.video.id;
            // initialize the comment
            this.newComment();
            // initialize the response
            this.newResponse();

            // initialize the checkbox
            this.newCheckbox();

            // for the youtube video
            var results = this.video.url.match('[\\?&]v=([^&#]*)');
            var video = (results === null) ? this.video.url : results[1];
            this.video.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?controls=0');

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
          this.sale = response.sales;
          this.checkbox.course_id = this.course.id;

          if (this.sale) {
            if (this.sale.progress == null || this.sale.progress == 0) {
              this.sale.progress = 0;
              this.progress_ = 0;
            } else {
              this.progress_ = this.sale.progress;
            }
          } else {
            this.progress_ = 0;
            this.sale = { progress: 0 };
          }

          this._progressService.setProgress(this.progress_);

          if (this.course.buy && this.course.buy == 1 && this.identity.sub && this.token) {
            this.getVideoWithProgress();
          } else {
            this.getVideosByCourse();
          }

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

  getVideoWithProgress() {
    this._videoService.getVideoWithProgress(this.token, this.video.course_id).subscribe(
      response => {
        if (response.status =='success') {
          this.videos = response.videos;
          this.videos.result = response.result;          
        } else {
          this.status = 'error';
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

  loadAnswersForComment(commentId: number) {
    this._responseService.getReponses(this.token, commentId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.responses = response.responses;
          this.users_responses = response.users;
          this.comment_user = response.comment;
          this.user_comment = response.user;
          this.created_at = response.created_at;
          // Actualizar las respuestas para este comentario específico
          //this.updateAnswersForComment(commentId, response.answers);
          // initialize the response
          this.newResponse();
          this.responxe.comment_id = this.comment_user.id;
        }
      },
      error: (error) => {
        console.log('Error loading answers:', error);
      }
    });
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

  deleteComment(id: any) {
    this._commentService.delete(this.token, id).subscribe(
      response => {
        if (response.status =='success') {
          this.getComments();
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          this.status = 'error on deleteComment()';
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  deleteResponse(id: any) {
    this._responseService.deleteResponse(this.token, id).subscribe(
      response => {
        if (response.status =='success') {
          this.getComments();
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          this.status = 'error on deleteResponse()';
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  // Method to show Questions and Answers
  show_chat(id: any) {
    $('#multiCollapseDescription').hide();
    $('#multiCollapseChat').show();
    this.loadAnswersForComment(id);
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

  // method to show the form to create a response
  showFormResponse(commentId: any) {
    this.responxe.comment_id = commentId;
    if(this.show === true) {
      $('#multiCollapseResponse' + commentId).hide();
      this.show = false;
    } else {
      $('#multiCollapseResponse' + commentId).show();
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

  // method to show the image of the response
  showImageResponse(id: any) {
    if(this.showResponse === true) {
      $('#imageResponse').hide();
      this.showResponse = false;
    } else {
      $('#imageResponse' + id).show();
      this.showResponse = true;
    }
  }

  // method to show the reponses
  showResponses(commentId: any) {
    const id = Number(commentId);
    const targetId = `#responsesCollapse${id}`;
    
    if(this.activeResponses[id]) {
      $(targetId).hide();
      this.activeResponses[id] = false;
    } else {
      // Close all other answers
      Object.keys(this.activeResponses).forEach(key => {
        const keyNum = Number(key);
        if(this.activeResponses[keyNum] && keyNum !== id) {
          $(`#responsesCollapse${keyNum}`).hide();
          this.activeResponses[keyNum] = false;
        }
      });
      
      $(targetId).show();
      this.activeResponses[id] = true;

      // Load answers for the comment
      this.loadAnswersForComment(id);
    }
  }
  
  // method to show the form to edit a comment
  showFormEditComment(id: number): void {
    this.comment_user = this.comments.find((c: any) => c.id === id);
    this.is_edit = true;
  
    const el = document.getElementById('multiCollapseCommentEdit' + id);
    if (!el) {
      return; 
    }

    const collapse  = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });

    if (el.classList.contains('show')) {
      collapse.hide();
    } else {
      el.addEventListener('shown.bs.collapse', () => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, { once: true });

      collapse.show();
      $('#responsesCollapse' + id).hide();
    }
  }

  // method to show the form to edit a response
  showFormEditResponse(id: number): void {
    for (const response of this.responses) {
      if (response.id === id) {
        this.responseToEdit = response;
        this.is_edit = true;
        break;
      }
    }

    this.responseToEdit = this.responses.find((c: any) => c.id === id);
    this.is_edit = true;
  
    const el = document.getElementById('multiCollapseResponseEdit' + id);
    if (!el) {
      return; 
    }

    const collapse  = bootstrap.Collapse.getOrCreateInstance(el, { toggle: false });

    if (el.classList.contains('show')) {
      collapse.hide();
    } else {
      el.addEventListener('shown.bs.collapse', () => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, { once: true });

      collapse.show();
    }
  }

  stripHtml(html: string): string {
    if (!html) return '';
    const temporalElement = document.createElement('div');
    temporalElement.innerHTML = html;
    return temporalElement.textContent || temporalElement.innerText || '';
  }

  // for the new comment
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

  // for the new response
  async onSubmitResponse(form: any) {
    try {
      if (this.files && this.files.length > 0) {
        this.uploading = true;
        await this.uploadResponse();
      }
      
      this.responxe.user_id = Number(this.responxe.user_id);
      this.responxe.comment_id = Number(this.responxe.comment_id);
      
      if(form.valid) {
        this.responxe.response = this.stripHtml(this.responxe.response);
      }

      this._responseService.createResponse(this.token, this.responxe).subscribe({
        next: (response) => {
          if (response.status == 'success') {
            this.responxe = response.response;
            this.loadAnswersForComment(this.comment_user.id);
            this.handleSuccess('Response created successfully');
            setTimeout(() => {
              // Scroll to the top of the page in a smooth way
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // wait to reload the page
              setTimeout(() => {
                this._router.navigate(['/video-detail/', this.video.id]).then(() => {
                  window.location.reload();
                  localStorage.removeItem('Response');
                });
              }, 1000);
            }, 100);
          } else {
            this.status = 'error';
            this.handleError('Error creating response');
          }
        },
        error: (error) => {
          this.status = 'error';
          console.log(error);
        }
      });
    } catch (error) {
      console.error('Error uploading response:', error);
      this.status = 'error';
      this.handleError('Error uploading response');
    }
  }

  // to edit a comment
  async onSubmitEditComment(form: any) {
    try {
      if (this.files && this.files.length > 0) {
        this.uploading = true;
        await this.uploadCommentEdit();
      }
      
      this.comment_user.user_id = Number(this.comment_user.user_id);
      this.comment_user.video_id = Number(this.comment_user.video_id);
      
      if(form.valid) {
        this.comment_user.comment = this.stripHtml(this.comment_user.comment);
      }

      this._commentService.update(this.token, this.comment_user).subscribe({
        next: (response) => {
          if (response.status == 'success') {
            this.getComments();
            this.loadAnswersForComment(this.comment_user.id);
            this.handleSuccess('Comment edited successfully');
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
            this.handleError('Error editing comment');
          }
        },
        error: (error) => {
          this.status = 'error';
          console.log(error);
        }
      });
    } catch (error) {
      console.error('Error editing comment:', error);
      this.status = 'error';
      this.handleError('Error editing comment');
    }
  }

  // to edit a response
  async onSubmitEditResponse(form: any) {
    try {
      if (this.files && this.files.length > 0) {
        this.uploading = true;
        await this.uploadResponseEdit();
      }
      
      this.responseToEdit.user_id = Number(this.responseToEdit.user_id);
      this.responseToEdit.comment_id = Number(this.responseToEdit.comment_id);
      
      if(form.valid) {
        this.responseToEdit.response = this.stripHtml(this.responseToEdit.response);
      }

      this._responseService.updateResponse(this.token, this.responseToEdit).subscribe({
        next: (response) => {
          if (response.status == 'success') {
            this.getComments();
            this.handleSuccess('Response edited successfully');
            setTimeout(() => {
              // Scroll to the top of the page in a smooth way
              window.scrollTo({ top: 0, behavior: 'smooth' });
              // wait to reload the page
              setTimeout(() => {
                this._router.navigate(['/video-detail/', this.video.id]).then(() => {
                  window.location.reload();
                  localStorage.removeItem('Response');
                });
              }, 1000);
            }, 100);
          } else {
            this.status = 'error';
            this.handleError('Error editing response');
          }
        },
        error: (error) => {
          this.status = 'error';
          console.log(error);
        }
      });
    } catch (error) {
      console.error('Error editing response:', error);
      this.status = 'error';
      this.handleError('Error editing response');
    }
  }

  // store checkbox
  storeCheckbox(id: any) {
    this.checkbox.user_id = this.sale.user_id;
    this.checkbox.course_id = this.sale.course_id;
    this.checkbox.video_id = id;
    this.checkbox.checkbox = 1;

    this._checkboxService.storeCheckbox(this.token, this.checkbox).subscribe(
      response => {
        if (response.status =='success') {
          var courseid = this.video.course_id;
          this._checkboxService.getCheckboxes(this.token, courseid).subscribe(
            response => {
              if (response.status =='success') {
                this.checkbox = response.checkbox || [];
                this.progress_ = 0;

                for (let i = 0; i < this.checkbox.length; i++) {
                  this.progress_ = this.videos.result + this.progress_;
                }

                this.sale.progress = this.progress_;

                this._progressService.setProgress(this.progress_);

                this.updateSaleProgress(this.token, this.sale);
              } else {
                this.status = 'error on indexCheckbox()';
              }
            },
            error => {
              console.log(error);
            }
          )
        } else {
          this.status = 'error on storeCheckbox()';
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  // update sale progress
  updateSaleProgress(token: any, sale: any): void {
    var id = this.sale.id;
    this._saleService.updateSaleProgress(token, sale, id).subscribe(
      response => {
        if (response.status == 'success') {
          this.sale = response.sale;
          this.progress_ = this.sale.progress;
          
          setTimeout(() => {
            this._progressService.setProgress(this.progress_);
            
            
            setTimeout(() => {
              this.getVideo();
            }, 100);
          }, 0);
        } else {
          this.status = 'error on updateSaleProgress()';
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  // delete checkbox
  deleteCheckbox(id: any) {
    this._checkboxService.deleteCheckbox(this.token, id).subscribe(
      response => {
        if (response.status =='success') {
          var courseid = this.video.course_id;
          this._checkboxService.getCheckboxes(this.token, courseid).subscribe(
            response => {
              if (response.status =='success') {
                this.checkbox = response.checkbox || [];
                this.progress_ = 0;

                for (let i = 0; i < this.checkbox.length; i++) {
                  this.progress_ = this.videos.result + this.progress_;
                }

                this.sale.progress = this.progress_;

                this._progressService.setProgress(this.progress_);

                this.updateSaleProgress(this.token, this.sale);
              } else {
                this.status = 'error on indexCheckbox()';
              }
            },
            error => {
              console.log(error);
            }
          )
        } else {
          this.status = 'error on storeCheckbox()';
        }
      },
      error => {
        console.log(error);
      }
    )
  }
}
