import { Component } from '@angular/core';

@Component({
  selector: 'app-login-panel',
  standalone: false,

  templateUrl: './login-panel.component.html',
  styleUrl: './login-panel.component.scss'
})
export class LoginPanelComponent {

  showLoginForm = true;

  goToRegister() {
    this.showLoginForm = false;
  }

  goToLogin() {
    this.showLoginForm = true;
  }

}
