import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {AuthenticationDto} from '../../../data-types/AuthenticationDto';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-login-form',
  standalone: false,

  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  hidePassword = true;
  showPasswordErrorMessage = false;
  loginUserDataFormGroup!: FormGroup;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.loginUserDataFormGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  resetWarnings() {
    this.showPasswordErrorMessage = false;
  }

  loginUser() {
    const formValues = this.loginUserDataFormGroup.value;

    const loginData: AuthenticationDto = {
      username: formValues.email!,
      password: formValues.password!,
    };

    if (!this.loginUserDataFormGroup.invalid) {
      this.userService.login(loginData).subscribe({
        next: (result: any) => {
          this.cookieService.set('Token', result['accessToken']);
          this.router.navigate(['/main']);
          console.log(result);
        },
        error: (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error && errorResponse.error.errorMessage) {
            this.errorMessage = errorResponse.error.errorMessage;
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
          this.showPasswordErrorMessage = true;
        }
      });
    }
  }
}
