import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../service/tasks/task.service';
import { ProjectService } from '../../../../service/projects/project.service';
import { UsersService } from '../../../../service/users/users.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  totalUsers = 0;
  totalProjects = 0;
  activeProjects = 0;
  completedProjects = 0;

  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;

  recentTasks: any[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.fetchSystemStats();
  }

  fetchSystemStats() {
    this.loading = true;
    this.errorMessage = null;
    let completed = 0;
    const checkDone = () => {
      completed++;
      if (completed === 3) {
        this.loading = false;
      }
    };

    // 1. Fetch Users
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users?.length || 0;
        checkDone();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = err?.error?.message || 'Failed to fetch user stats.';
        checkDone();
      },
    });

    // 2. Fetch Projects
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.totalProjects = projects?.length || 0;
        this.completedProjects = projects?.filter((p: any) => p.completed).length || 0;
        this.activeProjects = this.totalProjects - this.completedProjects;
        checkDone();
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.errorMessage = err?.error?.message || 'Failed to fetch project stats.';
        checkDone();
      },
    });

    // 3. Fetch Tasks
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.totalTasks = tasks?.length || 0;
        this.completedTasks = tasks?.filter((t: any) => t.isCompleted || !!t.completed).length || 0;
        this.pendingTasks = this.totalTasks - this.completedTasks;

        // Sort tasks by most recently updated or created first, then take top 5
        const sortedTasks = [...(tasks || [])].sort((a, b) => {
          const dateA = new Date(a?.modified || a?.created  || 0).getTime();
          const dateB = new Date(b?.modified || b?.created ||0).getTime();
          return dateB - dateA; // Descending order (newest first)
        }).slice(0, 5);
        this.recentTasks = this.mapTasksData(sortedTasks);
        checkDone();
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.errorMessage = err?.error?.message || 'Failed to fetch task stats.';
        checkDone();
      },
    });
  }

  private mapTasksData(tasks: any[]): any[] {
    return tasks.map((task, index) => {
      const mappedAssignees = (task.assignees || []).map((a: any, i: number) => ({
        ...a,
        name: a.userName || a.name,
        avatarUrl: `https://i.pravatar.cc/150?u=${a.userName || i}`,
      }));

      return {
        ...task,
        canEdit: true, // Admin can edit all on the dashboard
        assigneeAvatar: {
          images: mappedAssignees.map((a: any) => a.avatarUrl),
          assignees: mappedAssignees,
        },
        bgColor: ['bg-red-100', 'bg-sky-100', 'bg-emerald-100', 'bg-rose-100'][index % 4],
        textColor: ['text-red-700', 'text-sky-700', 'text-emerald-700', 'text-rose-700'][index % 4],
        priority: task.priority || 'Low',
        project: task.projectName || 'General',
      };
    });
  }
}
