import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../service/users/users.service';
import { TaskService } from '../../../../service/tasks/task.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  user_name?: string;
  loading = true;
  errorMessage: string | null = null;

  today = new Date();
  currentYear = this.today.getFullYear();

  cards = [
    {
      title: 'Completed',
      total: 0,
      icon: 'fa-regular fa-square-check',
      color: 'text-blue-400',
    },
    {
      title: 'Incompleted',
      total: 0,
      icon: 'fa-regular fa-circle-xmark',
      color: 'text-rose-700',
    },
    {
      title: 'Overdue',
      total: 0,
      icon: 'fa-solid fa-triangle-exclamation',
      color: 'text-amber-500',
    },
    {
      title: 'Total Tasks',
      total: 0,
      icon: 'fa-solid fa-list-check',
      color: 'text-teal-500',
    },
  ];

  constructor(
    public userService: UsersService,
    public taskService: TaskService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const email = sessionStorage.getItem('email');

    this.loading = true;
    this.errorMessage = null;

    if (!email) {
      this.fetchUserTaskStatus();
      return;
    }

    forkJoin({
      user: this.userService.getUserByEmail(email),
      stats: this.taskService.getUserTaskStats(),
    }).subscribe({
      next: ({ user, stats }) => {
        this.user_name = `${user.first_name} ${user.last_name}`;
        this.updateCards(stats);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.showError(err.error?.message || 'Failed to load dashboard data.');
        this.loading = false;
      },
    });
  }

  fetchUserTaskStatus(): void {
    this.taskService.getUserTaskStats().subscribe({
      next: (stats: any) => {
        this.updateCards(stats);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching user tasks:', err);
        this.showError(err.error?.message || 'Failed to load task statistics.');
        this.loading = false;
      },
    });
  }

  updateCards(stats: any): void {
    this.cards[0].total = stats.completedTasks;
    this.cards[1].total = stats.incompleteTasks;
    this.cards[2].total = stats.overdueTasks;
    this.cards[3].total = stats.totalTasks;
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = null), 5000); // Auto-hide after 5 seconds
  }
}
