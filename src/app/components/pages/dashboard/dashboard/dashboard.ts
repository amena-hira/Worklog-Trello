import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../service/users/users.service';
import { TaskService } from '../../../../service/tasks/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  today = new Date()
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
    { title: 'Total Tasks', total: 0, icon: 'fa-solid fa-list-check', color: 'text-teal-500' },
  ];

  currentYear = this.today.getFullYear();

  constructor(public userService:UsersService, public taskService:TaskService) {}

  user_name?: string;

  ngOnInit(): void {
    const email = sessionStorage.getItem('email');
    if (email) {
      this.userService.getUserByEmail(email).subscribe({
        next: (user) => {
          this.user_name = user.first_name+' '+ user.last_name;
        },
        error: (err) => console.error('Error fetching user:', err)
      });
    }

    this.fetchUserTaskStatus();
  }

  fetchUserTaskStatus(){
    const email = sessionStorage.getItem('email');
    if (email) {
      this.taskService.getUserTaskStats(email).subscribe({
        next: (stats: any) => {
          this.cards[0].total = stats.completedTasks;
          this.cards[1].total = stats.incompleteTasks;
          this.cards[2].total = stats.overdueTasks;
          this.cards[3].total = stats.totalTasks;
        },
        error: (err) => console.error('Error fetching user tasks:', err)
      });
    }
  }
}
