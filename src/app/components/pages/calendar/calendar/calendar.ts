import { Component } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar {
  readonly CalendarView = CalendarView;
  viewDate = new Date();
  view: CalendarView = CalendarView.Week;
  events: CalendarEvent[] = [
    {
      start: new Date(),
      title: 'An event',
      end: new Date('2026-04-03'),

    },
  ];

  setView(view: CalendarView) {
    this.view = view;
  }

  currentMonth = new Date().toLocaleString('en-us', { month: 'long', year: 'numeric' });

  
}
