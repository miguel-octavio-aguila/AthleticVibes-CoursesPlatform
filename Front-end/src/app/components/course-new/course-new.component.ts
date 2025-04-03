import { Component, OnInit } from '@angular/core';
import { Course } from '../../models/Course';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

// this is a global variable for iziToast
declare var iziToast: any;

@Component({
  selector: 'app-course-new',
  imports: [],
  templateUrl: './course-new.component.html',
  styleUrl: './course-new.component.css',
  providers: [UserService, CourseService]
})
export class CourseNewComponent {
  public title: string;
  public identity: any;
  public token: any;
  public course: Course;
  public status: any;
  public edit: boolean;
  public url: string;
  public resetVar = true;

  constructor(
    private _courseService: CourseService,
    private _userService: UserService
  ){
    this.title = 'Create Course';
  }
}
