import { Component } from '@angular/core';
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-new',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './category-new.component.html',
  styleUrl: './category-new.component.css',
  providers: [CategoryService, UserService]
})
export class CategoryNewComponent {
  public title: string;
  public identity: any;
  public token: any;
  public category: Category;
  public status: any;
  public edit: boolean;

  constructor(
    private _categoryService: CategoryService,
    private _router: Router,
    private _userService: UserService 
  ) {
    this.title = 'Create a new category';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.category = new Category(0, '');
    this.edit = false;
  }

  onSubmit(form: any) {
    // try catch is used to handle errors that may occur during the execution of the code inside the try block
    try {
      this._categoryService.createCategory(this.token, this.category).subscribe({
        next: (response) => {
          if (response.status == 'success') {
            this.status = 'success';
            setTimeout(() => {
              this._router.navigate(['/categories']).then(() => {
                window.location.reload();
              });
            }, 1000);
          } else {
            this.status = 'error';
          }
        },
        error: (error) => {
          this.status = 'error';
          console.log(error);
        }
      });
    } catch (error) {
      this.status = 'error';
      console.log(error);
    }
  }
}
