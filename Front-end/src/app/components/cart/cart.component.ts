import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { GLOBAL } from '../../services/global';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  providers: [UserService, CartService]
})
export class CartComponent {
  public identity: any;
  public token: any;
  public url: string;

  // cart
  public courses: any;
  public quantity: any;
  public quantities: Array<any> = [];
  public total: any;
  public cart_courses: any;
  public subtotals: Array<any> = [];

  constructor(
    private userService: UserService,
    private cartService: CartService
  ) {
    this.url = GLOBAL.url;
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
  }

  ngOnInit(): void {
    this.indexCart();
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
          this.subtotals = res.subTotals;
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

  onSubmit(form:any) {
    console.log(form);
  }
}
