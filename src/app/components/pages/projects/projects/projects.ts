import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../service/projects/project.service';
import { Project } from '../../../../model/project';
// Import your TaskService (adjust the path to match your project structure)
import { TaskService } from '../../../../service/tasks/task.service';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  projects: any[] = [];
  totalProjectsCount = 0;
  activeProjectsCount = 0;
  completedProjectsCount = 0;
  selectedProjectForEdit: any = null;
  loading = true;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService // Inject your TaskService
  ) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  openCreateModal() {
    this.selectedProjectForEdit = null;
    const modal = document.getElementById('add_project') as HTMLDialogElement;
    modal?.showModal();
  }

  openEditModal(project: any) {
    this.selectedProjectForEdit = project;
    const modal = document.getElementById('add_project') as HTMLDialogElement;
    modal?.showModal();
  }

  fetchProjects(): void {
    this.loading = true;
    this.errorMessage = null;
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        
        const currentUserEmail = sessionStorage.getItem('email');
        
        // The backend now provides exactly the projects for the logged-in user
        this.totalProjectsCount = projects.length;
        console.log(this.totalProjectsCount);
        this.completedProjectsCount = projects.filter((p: any) => p.completed).length;
        this.activeProjectsCount = projects.filter((p: any) => !p.completed).length;

        // Show only active ones in the recent list
        let filteredProjects = projects.filter((project: any) => !project.completed);

        // Sort descending by created date (newest first)
        filteredProjects.sort((a, b) => {
          const dateA = a.created ? new Date(a.created).getTime() : (a.id || 0);
          const dateB = b.created ? new Date(b.created).getTime() : (b.id || 0);
          return dateB - dateA;
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.projects = filteredProjects.map(project => {
          let dueDays = 0;
          if (project.dueDate) {
            const dueDate = new Date(project.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            const diffTime = dueDate.getTime() - today.getTime();
            dueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          return {
            ...project,
            progress: project.progress || 0,
            totalDue: project.tasksDue || 0,
            dueDays: dueDays,
            textColor: project.color ? `text-${project.color}-600` : 'text-sky-600',
            assignees: (project.members || []).map((m: any, i: number) => `https://i.pravatar.cc/150?u=${m.userId || i}`)
          };
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.errorMessage = err?.error?.message || 'An unexpected error occurred while fetching projects.';
        this.loading = false;
      }
    });
  }

  deleteProject(project: any) {
    if (!project || !project.id) return;
    this.successMessage = null;

    this.projectService.deleteProject(project.id).subscribe({
      next: () => {
        this.showSuccess(`${project.name} deleted successfully!`);
        this.fetchProjects(); // refresh list automatically
        
        // Refresh the tasks list so tasks related to this project are removed
        // We must subscribe to the Observable to execute the request
        this.taskService.getAllTasks().subscribe({
          error: (err) => {
            console.error('Error refreshing tasks after project deletion:', err);
          }
        }); 
      },
      error: (err) => {
        console.error('Error deleting project:', err);
        this.showError(err.error?.message || 'An unexpected error occurred while deleting the project.');
      }
    });
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = null, 5000); // Auto-hide after 5 seconds
  }

  showSuccess(message: string) {
      this.successMessage = message;
      setTimeout(() => this.successMessage = null, 5000); // Auto-hide after 5 seconds
    }

}
