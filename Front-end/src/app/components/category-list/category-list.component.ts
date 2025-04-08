import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule],
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

  constructor(
    private userService: UserService,
    private categoryService: CategoryService 
  ) {
    this.title = 'Category list';
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
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
}
