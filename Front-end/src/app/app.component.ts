import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryService } from './services/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [CategoryService]
})
export class AppComponent {
  title = 'Front-end';

  public categories: any = [];

  constructor(
    private categoryService: CategoryService
  ) {}

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
