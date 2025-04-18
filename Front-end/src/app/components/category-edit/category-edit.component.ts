import { Component } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../models/Category';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-category-edit',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: '../category-new/category-new.component.html',
  styleUrl: '../category-new/category-new.component.css',
  providers: [UserService, CategoryService]
})
export class CategoryEditComponent {
  public category: Category;
  public token: any;
  public edit: boolean;
  public title: string;
  public status: any;

  constructor(
    private _userService: UserService,
    private _categoryService: CategoryService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.token = this._userService.getToken();
    this.edit = true;
    this.title = 'Edit Category';
    this.category = new Category(0, '');
  }

  ngOnInit(): void {
    this.getCategory(); 
  }

  onSubmit(form: any) {
    // try catch is used to handle errors that may occur during the execution of the code inside the try block
    try {
      this._categoryService.updateCategory(this.token, this.category.id, this.category).subscribe({
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

  getCategory() {
    this._route.params.subscribe(params => {
      let id = +params['id'];
      this._categoryService.getCategory(id).subscribe({
        next: (response) => {
          if (response.status == 'success') {
            this.category = response.category;
          } else {
            this._router.navigate(['/home']);
          }
        }, 
        error: (error) => {
          console.log(error);
          this.status = 'error';
        } 
      }) 
    }) 
  }

}
