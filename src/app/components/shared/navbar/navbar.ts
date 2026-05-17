import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(public authService: AuthService, public route: Router) {
    if (window.innerWidth >= 1024) {
      setTimeout(() => {
        const element = document.getElementById('my-drawer') as HTMLInputElement;
        if (element) {
          element.checked = true;
        }
      });
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLogin;
  }

  logout() {
    this.authService.updateAuthState(); // clears session & resets booleans
    this.route.navigateByUrl('/login'); // or homepage
  }
}
