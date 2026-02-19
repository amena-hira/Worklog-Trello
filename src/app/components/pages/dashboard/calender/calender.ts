import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calender',
  standalone: false,
  templateUrl: './calender.html',
  styleUrl: './calender.css',
})
export class Calender implements OnInit{
  priority_Tasks = [
    {
      name: 'Design Homepage',
      dueDate: '2026-02-27',
      priority: 'High',
      status: 'In Progress',
      statusColor: 'badge-success',
    },
    {
      name: 'Implement Login',
      dueDate: '2026-02-05',
      priority: 'Medium',
      status: 'Pending',
      statusColor: 'badge-warning',
    },
    {
      name: 'Write Unit Tests',
      dueDate: '2026-03-10',
      priority: 'Low',
      status: 'Overdue',
      statusColor: 'badge-error',
    },
    {
      name: 'Deploy to Staging',
      dueDate: '2026-03-15',
      priority: 'High',
      status: 'Pending',
      statusColor: 'badge-warning',
    }
  ];

  // Calendar Logic
  currentDate = new Date(); // Initialized to match sample data
  today = new Date();
  calendarDays: any[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Previous month fill (empty slots)
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = this.formatDate(date);
      const tasks = this.priority_Tasks.filter(t => t.dueDate === dateString);
      const isToday = date.toDateString() === this.today.toDateString();
      days.push({ date, isCurrentMonth: true, tasks, isToday });
    }

    this.calendarDays = days;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  changeMonth(offset: number) {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + offset, 1);
    this.generateCalendar();
  }
}
