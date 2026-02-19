import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  cards = [
    {
      title: 'Completed Tasks',
      total: '123',
      icon: 'fa-regular fa-square-check',
      color: 'text-blue-400',
    },
    {
      title: 'Incompleted Tasks',
      total: '21',
      icon: 'fa-regular fa-circle-xmark',
      color: 'text-rose-700',
    },
    {
      title: 'Overdue Tasks',
      total: '04',
      icon: 'fa-solid fa-triangle-exclamation',
      color: 'text-amber-500',
    },
    { title: 'Total Tasks', total: '148', icon: 'fa-solid fa-list-check', color: 'text-teal-500' },
  ];

}
