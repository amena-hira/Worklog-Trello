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

  private readonly taskColors = [
    'bg-blue-700',
    'bg-violet-700',
    'bg-emerald-700',
    'bg-rose-700',
  ];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.fetchUpcomingDeadlines();
  }

  fetchUpcomingDeadlines(): void {
    const currentUserEmail = sessionStorage.getItem('email');

    const today = this.startOfDay(new Date());
    const tomorrow = this.addDays(today, 1);
    const nextWeek = this.endOfDay(this.addDays(today, 7));

    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.priority_Tasks = tasks
          .filter((task: any) =>
            this.isValidUpcomingTask(task, tomorrow, nextWeek, currentUserEmail)
          )
          .sort(
            (a: any, b: any) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
          .map((task: any, index: number) =>
            this.mapTaskToDeadlineView(task, today, index)
          );
      },
      error: (err) => console.error('Error fetching upcoming deadlines:', err),
    });
  }

  private isValidUpcomingTask(
    task: any,
    startDate: Date,
    endDate: Date,
    currentUserEmail: string | null
  ): boolean {
    if (task.isCompleted || task.completed || !task.dueDate) return false;

    const dueDate = new Date(task.dueDate);
    const isInRange = dueDate >= startDate && dueDate <= endDate;

    if (!isInRange) return false;
    if (!currentUserEmail) return true;

    return this.isTaskOwnerOrAssignee(task, currentUserEmail);
  }

  private isTaskOwnerOrAssignee(task: any, email: string): boolean {
    const isCreator = task.createdByUserEmail === email;

    const isAssignee = (task.assignees || []).some(
      (assignee: any) =>
        assignee.userEmail === email || assignee.email === email
    );

    return isCreator || isAssignee;
  }

  private mapTaskToDeadlineView(task: any, today: Date, index: number) {
    const dueDate = this.startOfDay(new Date(task.dueDate));
    const diffDays = this.getDayDifference(today, dueDate);
    const isTomorrow = diffDays === 1;

    return {
      name: task.name,
      dueDate: isTomorrow ? 'Tomorrow!' : `In ${diffDays} days`,
      bgColor: this.taskColors[index % this.taskColors.length],
      dueColor: isTomorrow ? 'bg-red-600' : 'bg-teal-600',
      textColor: isTomorrow ? 'text-red-800' : 'text-teal-800',
    };
  }

  private startOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  private endOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }

  private addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  }

  private getDayDifference(startDate: Date, endDate: Date): number {
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.round((endDate.getTime() - startDate.getTime()) / oneDay);
  }
}
