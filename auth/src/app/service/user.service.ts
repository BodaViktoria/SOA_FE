import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, Subject, tap } from 'rxjs';
import {AuthenticationDto} from '../data-types/AuthenticationDto';
import {RegisterUserDto} from '../data-types/RegisterUserDto';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loginStatusSource = new Subject<boolean>();
  loginStatus$ = this.loginStatusSource.asObservable();

  private loginUrl= 'http://localhost:8030/api/user/login';
  private registerUdl = 'http://localhost:8030/customer/api/register';

  constructor(private httpClient: HttpClient) {}

  login(loginData: AuthenticationDto): Observable<any> {
    return this.httpClient.post(this.loginUrl, loginData).pipe(
      tap((response: any) => {
        // Handle successful login response (e.g., save token)
        if (response.accessToken) {
          localStorage.setItem('authToken', response.token); // Save token to localStorage
          this.loginStatusSource.next(true); // Update login status to true
        }
      }),
      catchError((error) => {
        // Handle error (e.g., show error messages)
        this.loginStatusSource.next(false);
        throw error; // Rethrow the error to be handled by the component
      })
    );
  }
  public register(registerData: RegisterUserDto): Observable<any> {
    return this.httpClient.post(this.registerUdl, registerData);
  }
}
