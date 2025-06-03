import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CategoryService } from './services/category.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from './services/user.service';
import { ProgressService } from './services/progress.service';
import { GLOBAL } from './services/global';
import { CartService } from './services/cart.service';
import { ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChangeDetectorRef } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [CategoryService, CartService]
})
export class AppComponent implements OnInit {
  title = 'Front-end';

  public identity:any;
  public token:any;
  public url:any;
  public url_front:any;
  public categories: any = [];

  // cart
  public courses: any;
  public quantity: any;
  public quantities: any;
  public total: any;
  public cart_courses: any;

  // chart graph
  public ChartData: ChartData<'doughnut'> = {
    datasets: [
      { data: [],
        backgroundColor: ['#007bff', '#6c757d'],
        borderColor: ['#007bff', '#6c757d'],
        hoverBackgroundColor: ['#007bff', '#6c757d'],
      }
    ]
  };
  public ChartType: ChartType = 'doughnut';

  // events of the chart
  public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }
  public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
    console.log(event, active);
  }

  constructor(
    private categoryService: CategoryService,
    public userService: UserService,
    private cartService: CartService,
    private progressService: ProgressService,
    private cdr: ChangeDetectorRef
  ) {
    this.url = GLOBAL.url;
    this.url_front = GLOBAL.url_front;
    this.loadUser();
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  
  ngOnInit(): void {
    this.getCategories();
    this.identity = this.userService.getIdentity();
    if(this.token) {
      this.indexCart();
    }
    document.onreadystatechange = function () {
      if (document.readyState == "complete") {
        AOS.init();
      }
    }
    this.progressService.progress$.subscribe(progress => {
      const progressPercentage = progress || 0;
      const remaining = 100 - progressPercentage;
      this.ChartData = {
        labels: [],
        datasets: [
          { 
            data: [progressPercentage, remaining],
            backgroundColor: ['#3c342c', '#bcb4bc'],
            borderColor: ['#3c342c', '#bcb4bc'],
            hoverBackgroundColor: ['#3c342c', '#bcb4bc'],
          }
        ]
      };
    
      if (this.chart) {
        this.chart.update();
      }
      this.cdr.detectChanges();
    });
  }

  loadUser() {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    if (Object.keys(this.identity).length === 0 || typeof this.identity === undefined) {
      this.identity = false;
    }
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      res => {
        if (res.status == 'success') {
          this.categories = res.categories
        }
      },
      err => console.error(err)
    );
  }

  indexCart() {
    this.cartService.index(this.token).subscribe(
      res => {
        if (res.status == 'success') {
          this.courses = res.courses;
          this.quantity = res.cont;
          this.quantities = res.quantities;
          this.total = res.total;
          this.cart_courses = res.carts;
          
          localStorage.setItem('cart', JSON.stringify(this.quantity));
        }
      },
      err => console.error(err)
    )
  }

  // delete cart
  deleteCart(id: any){
    this.cartService.delete(this.token, id).subscribe(
      response => {
        this.indexCart();
      },
      error => {
        console.log(error);
      }
    );
  }
}