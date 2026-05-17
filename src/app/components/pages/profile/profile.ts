import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../service/tasks/task.service';
import { ProjectService } from '../../../service/projects/project.service';
import { UsersService } from '../../../service/users/users.service';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  currentUser: any = {};

  taskStats: any = null;
  totalProjects: number = 0;
  activeProjects: number = 0;
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private usersService: UsersService,
    private authService: AuthService,
    public route: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = null;
    let completeCount = 0;
    const checkDone = () => {
      completeCount++;
      if (completeCount === 3) this.loading = false;
    };

    this.fetchUserInfo(checkDone);
    this.fetchTaskStats(checkDone);
    this.fetchProjectStats(checkDone);
  }

  fetchUserInfo(checkDone?: () => void) {
    this.usersService.getMe().subscribe({
      next: (user: any) => {
        this.currentUser = {
          ...user,
          email: user.email || 'Unknown Email',
          displayRole: user?.role === 'ROLE_ADMIN' ? "Admin" : 'User',
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          gender: user.gender || 'Not specified',
          userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || (user.email || 'Unknown').split('@')[0],
          avatarUrl: user.avatarUrl || `https://i.pravatar.cc/150?u=${user.email}`
        };
        if (checkDone) checkDone();
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
        this.errorMessage = err?.error?.message || 'Failed to fetch user info.';
      }
    });
  }

  fetchTaskStats(checkDone?: () => void) {
    this.taskService.getUserTaskStats().subscribe({
      next: (stats) => {
        this.taskStats = stats;
        if (checkDone) checkDone();
      },
      error: (err) => {
        console.error('Error fetching user task stats:', err);
        this.errorMessage = err?.error?.message || 'Failed to fetch task stats.';
        if (checkDone) checkDone();
      }
    });
  }

  fetchProjectStats(checkDone?: () => void) {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.totalProjects = projects.length;
        this.activeProjects = projects.filter((p: any) => !p.completed).length;
        if (checkDone) checkDone();
      },
      error: (err) => {
        console.error('Error fetching user project stats:', err);
        this.errorMessage = err?.error?.message || 'Failed to fetch project stats.';
        if (checkDone) checkDone();
      }
    });
  }

  openEditModal() {
    const modal = document.getElementById('edit_profile_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  logout() {
    this.authService.updateAuthState(); // clears session & resets booleans
    this.route.navigateByUrl('/login'); // or homepage
  }
}
