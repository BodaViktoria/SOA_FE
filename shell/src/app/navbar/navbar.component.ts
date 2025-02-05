import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  showTopNavBar = false;

  constructor(private cookieService: CookieService, private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateNavBar(event.url);
      }
    });

    this.updateNavBar(this.router.url);
  }

  updateNavBar(url: string) {
    this.showTopNavBar = url.includes('/main/customer');
  }

  goBackToMain() {
    this.router.navigate(['/main']);
  }

  goToTasks() {
    this.router.navigate(['/main/customer']);
  }

  logout() {
    this.cookieService.delete('Token');
    this.router.navigate(['/login']);
  }
}
