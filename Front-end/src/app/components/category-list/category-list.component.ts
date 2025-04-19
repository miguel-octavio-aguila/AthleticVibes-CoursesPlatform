import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { Router, RouterModule } from '@angular/router';
import { GLOBAL } from '../../services/global';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  providers: [UserService, CategoryService]
})
export class CategoryListComponent {

  public title: string;
  public categories: any;
  public identity: any;
  public status: any;
  public token: any;
  public url: any;

  constructor(
    private _router: Router,
    private userService: UserService,
    private categoryService: CategoryService 
  ) {
    this.title = 'Category list';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.getCategories();
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

  deleteCategory(id: any) {
    this.categoryService.deleteCategory(this.token, id).subscribe(
      res => {
        if (res.status == 'success') {
          this.status = 'success';
          this.getCategories();
          setTimeout(() => {
            this._router.navigate(['/categories']).then(() => {
              window.location.reload();
            });
          }, 1000);
        }
      },
      err => console.error(err)
    );
  }
}
