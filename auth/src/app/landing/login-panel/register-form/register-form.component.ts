import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../service/user.service';
import {Router} from '@angular/router';
import {RegisterUserDto} from '../../../data-types/RegisterUserDto';
import {HttpErrorResponse} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-register-form',
  standalone: false,

  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {
  hidePassword1 = true;
  hidePassword2 = true;

  showCreateAccountErrorMessage = false;
  errorMessage = '';

  registerFormGroup!: FormGroup;



  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
  ) {
    this.registerFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
    });
  }


  createAccount() {
    const valuesFromForm = this.registerFormGroup.value;

    const passwordDoNotMatch =
      valuesFromForm.password1 !== valuesFromForm.password2;

    if (this.registerFormGroup.invalid || passwordDoNotMatch) {
      if (this.registerFormGroup.get('email')?.invalid) {
        this.errorMessage = 'Please enter a valid email address.';
      } else if (passwordDoNotMatch) {
        this.errorMessage = 'Passwords must match.';
      } else {
        this.errorMessage = 'Please fill out all required fields.';
      }

      this.showCreateAccountErrorMessage = true;
      return;
    }

    const registerData: RegisterUserDto = {
      name: valuesFromForm.name,
      username: valuesFromForm.username,
      password: valuesFromForm.password1,
    };

    this.userService.register(registerData).subscribe({
      next: (result: any) => {
        console.log(result);
      },
      error: (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.errorMessage) {
          this.errorMessage = errorResponse.error.errorMessage;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
        this.showCreateAccountErrorMessage = true;
      }
    });
  }

  resetWarnings() {
    this.showCreateAccountErrorMessage = false;
  }

}
