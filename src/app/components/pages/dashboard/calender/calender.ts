import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../service/tasks/task.service';

@Component({
  selector: 'app-calender',
  standalone: false,
  templateUrl: './calender.html',
  styleUrl: './calender.css',
})
export class Calender implements OnInit{
  priority_Tasks: any[] = [];

  // Calendar Logic
  currentDate = new Date(); // Initialized to match sample data
  today = new Date();
  calendarDays: any[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.priority_Tasks = tasks;
        this.generateCalendar(); // Re-generate calendar once tasks load
      },
      error: (err) => console.error('Error fetching tasks for calendar:', err)
    });
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
      const tasks = this.priority_Tasks.filter(t => {
        if (!t.dueDate) return false;
        // Ensure backend dates match the 'YYYY-MM-DD' comparison
        return this.formatDate(new Date(t.dueDate)) === dateString;
      });
      const isToday = date.toDateString() === this.today.toDateString();
      days.push({ 
        date, 
        isCurrentMonth: true, 
        tasks: tasks,
        displayTasks: tasks.slice(0, 1),
        hasMore: tasks.length > 1,
        isToday 
      });
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
