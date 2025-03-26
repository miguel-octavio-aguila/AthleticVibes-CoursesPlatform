import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryService } from './services/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [CategoryService]
})
export class AppComponent {
  title = 'Front-end';

  public identity:any;
  public token:any;
  public url:any;
  public categories: any = [];

  constructor(
    private categoryService: CategoryService,
    public userService: UserService
  ) {
    this.url = GLOBAL.url;
    this.loadUser();
  }

  ngOnInit(): void {
    this.getCategories();
  }

  loadUser() {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    // console.log(this.identity.name);
    // console.log(this.token);
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      res => {
        if (res.status == 'success') {
          this.categories = res.categories
          console.log(this.categories);
        }
      },
      err => console.error(err)
    );
  }
}
