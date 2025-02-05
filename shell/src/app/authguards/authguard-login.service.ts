import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthguardLoginService implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private router: Router,
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.cookieService.get('Token');
    if (!token) {
      return true;
    } else {
        this.router.navigate(['/main']);
    }
    return false;
  }
}
