import { Component } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course-detail',
  imports: [],
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

  constructor(
    private _videoService: VideoService,
    private _courseService: CourseService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private sanitizer: DomSanitizer
  ){
    this.is_course = true;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.getVideosByCourse();
    if (this.identity.sub) {
      this.getCourse();
    }
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
}