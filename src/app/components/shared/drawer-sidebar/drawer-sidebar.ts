import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drawer-sidebar',
  standalone: false,
  templateUrl: './drawer-sidebar.html',
  styleUrl: './drawer-sidebar.css',
})
export class DrawerSidebar implements OnInit {
  isAdmin = false;
  menuItems: any[] = [];

  ngOnInit(): void {
    this.isAdmin = sessionStorage.getItem('authRole') === 'ROLE_ADMIN';

    this.menuItems = [
      { label: 'Dashboard', icon: 'fa-regular fa-house', route: this.isAdmin ? '/admin/dashboard' : '/' },
      { label: 'Tasks', icon: 'fa-regular fa-circle-check', route: '/tasks' },
      { label: 'Projects', icon: 'fa-brands fa-trello', route: '/projects' },
      this.isAdmin 
        ? { label: 'Users', icon: 'fa-solid fa-users', route: '/admin/users' }
        : { label: 'Calendar', icon: 'fa-regular fa-calendar', route: '/calendar' },
        
      { label: 'Inbox', icon: 'fa-regular fa-message', route: '/inbox' },
    ];
  }
}
