import { Component } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
  providers: [VideoService, CourseService, UserService]
})
export class CourseDetailComponent {
  public identity: any;
  public token: any;
  public course: any;
  public videos: any;
  public accordion: Array<any> = [];
  public status: any;
  public is_course: any;
  public contentAccordionOpen: boolean = false;
  public video: any;
  public is_video: any;

  constructor(
    private _videoService: VideoService,
    private _courseService: CourseService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private sanitizer: DomSanitizer
  ){
    this.is_course = true;
    this.is_video = false;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getVideosByCourse();
    this.getCourse();
  }

  getCourse() {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this._courseService.getCourseInfo(id, this.token).subscribe(
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
    })
  }

  getVideosByCourse() {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this._videoService.getVideosByCourse(id).subscribe(
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
    })
  }

  getVideo(id: any) {
    this._videoService.getVideo(id).subscribe(
      response => {
        if (response.status == 'success') {
          this.is_course = false;
          this.is_video = true;
          this.video = response.video;
          // for the youtube video
          var results = this.video.url.match('[\\?&]v=([^&#]*)');
          var video = (results === null) ? this.video.url : results[1];
          this.video.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?controls=0');
        } else {
          this.status = 'error on getVideo()';
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  hide_d() {
    $('#multiCollapseChat').hide();
    $('#multiCollapseContent').hide();
    $('#multiCollapseDescription').show();
  }

  hide_c() {
    $('#multiCollapseChat').hide();
    $('#multiCollapseContent').show();
    $('#multiCollapseDescription').hide();
  }

  toggleContentAccordion() {
    this.contentAccordionOpen = !this.contentAccordionOpen;
    
    // if the accordion is closed, we close all the accordion
    if (!this.contentAccordionOpen) {
      setTimeout(() => {
        // Wait for the transition to finish
        const detailsElements = document.querySelectorAll('details[name="courseAccordion"]');
        detailsElements.forEach(element => {
          if (element.hasAttribute('open')) {
            (element as HTMLDetailsElement).open = false;
          }
        });
      }, 100);
    } else {
      // if the accordion is opened, we open the first video 
      setTimeout(() => {
        const detailsElements = document.querySelectorAll('details[name="courseAccordion"]');
        if (detailsElements.length > 0) {
          (detailsElements[0] as HTMLDetailsElement).open = true;
        }
      }, 300);
    }
  }
}