import { Component } from '@angular/core';
import { GLOBAL } from '../../services/global';
import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../services/comment.service';
// jQuery is already declared globally via 'declare var $: any'

declare var $: any;

@Component({
  selector: 'app-video-detail',
  imports: [RouterModule, CommonModule],
  templateUrl: './video-detail.component.html',
  styleUrl: './video-detail.component.css',
  providers: [VideoService, CourseService, UserService, CommentService]
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
  public comments: any;
  public response_cont: any;
  public users: any;
  public url: any;

  constructor(
    private _videoService: VideoService,
    private _courseService: CourseService,
    private _userService: UserService,
    private _commentService: CommentService,
    private _route: ActivatedRoute,
    private _router: Router,
    private sanitizer: DomSanitizer
  ){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.getVideo();
  }

  getVideo() {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this._videoService.getVideo(id).subscribe(
        response => {
          if (response.status == 'success') {
            this.video = response.video;
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
  hide_d() {
    $('#multiCollapseChat').hide();
    $('#multiCollapseDescription').show();
  }
}
