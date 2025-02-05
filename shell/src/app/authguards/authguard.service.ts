import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthguardService implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.cookieService.get('Token');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }
}
