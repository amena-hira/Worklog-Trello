import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../service/tasks/task.service';

@Component({
  selector: 'app-upcoming-deadline',
  standalone: false,
  templateUrl: './upcoming-deadline.html',
  styleUrl: './upcoming-deadline.css',
})
export class UpcomingDeadline implements OnInit {
  priority_Tasks: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchUpcomingDeadlines();
  }

  fetchUpcomingDeadlines() {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(today.getDate() + 3);
        threeDaysFromNow.setHours(23, 59, 59, 999); // End of the 3rd day

        // Filter for uncompleted tasks due within the next 3 days
        const upcomingTasks = tasks.filter(task => {
          if (task.isCompleted || task.completed || !task.dueDate) {
            return false;
          }
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= threeDaysFromNow;
        });

        // Sort them so the most urgent appear first
        upcomingTasks.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

        this.priority_Tasks = upcomingTasks.map((task, index) => {
          const dueDate = new Date(task.dueDate!);
          dueDate.setHours(0, 0, 0, 0);
          
          const diffTime = dueDate.getTime() - today.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          const isToday = diffDays === 0;
          const isTomorrow = diffDays === 1;

          return {
            name: task.name,
            dueDate: isToday ? 'Today!' : isTomorrow ? 'Tomorrow!' : `In ${diffDays} days`,
            bgColor: ['bg-blue-700', 'bg-violet-700', 'bg-emerald-700', 'bg-rose-700'][index % 4],
            dueColor: isToday ? 'bg-red-700' : isTomorrow ? 'bg-orange-600' : 'bg-yellow-600',
            textColor: isToday ? 'text-red-800' : isTomorrow ? 'text-orange-800' : 'text-yellow-800'
          };
        });
      },
      error: (err) => console.error('Error fetching upcoming deadlines:', err)
    });
  }
}
