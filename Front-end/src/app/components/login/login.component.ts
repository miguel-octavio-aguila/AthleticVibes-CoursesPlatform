import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public page_title: string;
  public identity: any;
  public token: any;
  public user: any;
  public status: any;

  constructor(
    private _userSevice: UserService,
    private _router: Router,
    private _route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.page_title = 'Identify';
    // id, name, surname, role, email, password, description, image
    this.user = new User(0,'','','ROLE_USER','','','','');
  }

  ngOnInit(): void {
    this.logout();
  }

  // refresh
  refresh() {
    this.document.location.reload();
  }

  // on submit for email and password to log in
  onSubmit(form:any) {
    this._userSevice.login(this.user).subscribe(
      response => {
        if (!response.status || response.status != 'error') {
          this.status = 'success';
          this.token = response;
          // object
          this._userSevice.login(this.user, true).subscribe(
            response => {
              this.identity = response;
              // persist data
              localStorage.setItem('token', this.token);
              localStorage.setItem('identity', JSON.stringify(this.identity));
              // redirect
              this._router.navigate(['/home']).then(() => {
                this.refresh();
              });
            },
            error => {
              this.status = 'error';
              console.log(<any>error);
            }
          );
        }else {
          this.status = 'error';
        }
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }

  // logout
  logout() {
    this._route.params.subscribe(params => {
      // sure, with + to convert to number
      let logout = +params['sure'];
      if (logout == 1) {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        this.identity = null;
        this.token = null;
        // redirect
        this._router.navigate(['/home']).then(() => {
          this.refresh();
        });
      }
    });
  }
}
