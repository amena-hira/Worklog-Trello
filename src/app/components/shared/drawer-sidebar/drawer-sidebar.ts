import { Component } from '@angular/core';

@Component({
  selector: 'app-drawer-sidebar',
  standalone: false,
  templateUrl: './drawer-sidebar.html',
  styleUrl: './drawer-sidebar.css',
})
export class DrawerSidebar {
  isAdmin = sessionStorage.getItem('authRole') === 'ROLE_ADMIN'; 
  menuItems = [
    { label: 'Dashboard', icon: 'fa-regular fa-house', route: this.isAdmin ? '/admin/dashboard' : '/' },
    { label: 'Tasks', icon: 'fa-regular fa-circle-check', route: '/tasks' },
    { label: 'Projects', icon: 'fa-brands fa-trello', route: '/projects' },
    { label: 'Calendar', icon: 'fa-regular fa-calendar', route: '/calendar' },
    { label: 'Inbox', icon: 'fa-regular fa-message', route: '/inbox' },
  ];
}
