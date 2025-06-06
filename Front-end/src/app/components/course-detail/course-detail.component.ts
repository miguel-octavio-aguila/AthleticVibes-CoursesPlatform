import { Component } from '@angular/core';
import { VideoService } from '../../services/video.service';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

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
  public videos: any[] = [];
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
    // Cargar ambos datos al mismo tiempo
    this.loadCourseData();
  }

  loadCourseData() {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      
      // Usar forkJoin para cargar ambos servicios al mismo tiempo
      forkJoin({
        course: this._courseService.getCourseInfo(id, this.token),
        videos: this._videoService.getVideosByCourse(id)
      }).subscribe({
        next: (result) => {
          // Procesar respuesta del curso
          if (result.course.status == 'success') {
            this.course = result.course.course;
            this.accordion = result.course.accordion;
            // Para el video de YouTube
            var results = this.course.url.match('[\\?&]v=([^&#]*)');
            var video = (results === null) ? this.course.url : results[1];
            this.course.url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video + '?controls=0');
          }

          // Procesar respuesta de videos
          if (result.videos.status == 'success') {
            this.videos = result.videos.videos || [];
          } else {
            this.videos = [];
          }

        },
        error: (error) => {
          console.log('Error loading data:', error);
          this.status = 'error loading data';
          // Asegurar que siempre tenemos arrays
          this.videos = [];
          this.accordion = [];
        }
      });
    });
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
            this.videos = response.videos || [];
          } else {
            this.status = 'error';
            this.videos = [];
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
          
          // Actualizar el iframe principal con el nuevo video
          this.course.url = this.video.url;
        } else {
          this.status = 'error on getVideo()';
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
          // Cerrar el modal manualmente
          const modal = document.getElementById('deleteVideo' + id);
          if (modal) {
            const modalInstance = (window as any).bootstrap.Modal.getInstance(modal);
            if (modalInstance) {
              modalInstance.hide();
            }
          }
        } else {
          this.status = 'error on deleteVideo()';
        }
      },
      error => {
        console.log(error);
      }
    )
  }

  // Method to show Questions and Answers
  show_chat() {
    $('#multiCollapseDescription').hide();
    $('#multiCollapseContent').hide();
    $('#multiCollapseChat').show();
  }

  // Method to show Description
  show_des() {
    $('#multiCollapseChat').hide();
    $('#multiCollapseDescription').show();
  }

  // Method to show Content
  toggleContentAccordion() {
    // Hide the other multicollapses
    $('#multiCollapseChat').hide();
    $('#multiCollapseDescription').hide();
    
    // Show the Content collapse
    $('#multiCollapseContent').show();
    
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