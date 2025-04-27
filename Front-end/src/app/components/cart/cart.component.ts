import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { GLOBAL } from '../../services/global';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SaleService } from '../../services/sale.service';

// this is a global variable for iziToast
declare var iziToast: any;

@Component({
  selector: 'app-cart',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  providers: [UserService, CartService, SaleService]
})
export class CartComponent {
  public identity: any;
  public token: any;
  public url: string;
  public status: any;

  // cart
  public courses: any;
  public quantity: any;
  public quantities: Array<any> = [];
  public total: any;
  public cart_courses: any;
  public subtotals: Array<any> = [];

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private saleService: SaleService,
    private router: Router
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
        setTimeout(() => {
          window.location.reload();
        }, 100);
      },
      error => {
        console.log(error);
      }
    );
  }

  // delete all cart
  deleteAllCart(){
    this.cartService.deleteAll(this.token).subscribe(
      response => {
        this.indexCart();
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    // try catch is used to handle errors that may occur during the execution of the code inside the try block
    try {
      // Save the user data
      this.saleService.createSale(this.token, this.identity).subscribe({
        next: (response) => {
          if (!response && response.status != 'success') {
            this.status = 'error';
            // iziToast
            iziToast.show({
              title: 'Error',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message: 'The sale has not been created.'
            });
          } else {
            this.status = 'success';
            // iziToast
            iziToast.show({
              title: 'Success',
              titleColor: '#1DC74C',
              color: '#FFF',
              class: 'text-success',
              position: 'topRight',
              message: 'The sale has been created'
            });
            this.deleteAllCart();
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setTimeout(() => {
                this.router.navigate(['/home']).then(() => {
                  window.location.reload();
                });
              }, 1000)
            }, 100);
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
