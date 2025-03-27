import { Component } from '@angular/core';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  providers: [UserService]
})
export class SignupComponent {
  public page_title: string;
  public user: any;
  public status: string | undefined;

  constructor(
    private _userService: UserService
  ) {
    this.page_title = 'Sign up';
    this.user = new User(0, '', '', 'ROLE_USER', '', '', '', '');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  onSubmit(form: any) {
    this._userService.signup(this.user).subscribe(
      response => {
        if (response.status == 'success') {
          this.status = response.status;
        } else {
          this.status = 'error';
        }
        console.log(response);
        form.reset();
      },
      error => {
        this.status = 'error';
        console.log(<any>error);
      }
    );
  }
}
