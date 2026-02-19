import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor() {
    if (window.innerWidth >= 1024) {
      setTimeout(() => {
        const element = document.getElementById('my-drawer') as HTMLInputElement;
        if (element) {
          element.checked = true;
        }
      });
    }
  }
}
