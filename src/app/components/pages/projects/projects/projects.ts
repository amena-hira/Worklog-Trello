import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../service/projects/project.service';
import { Project } from '../../../../model/project';

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

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  openCreateModal() {
    this.selectedProjectForEdit = null;
    const modal = document.getElementById('add_task') as HTMLDialogElement;
    modal?.showModal();
  }

  openEditModal(project: any) {
    this.selectedProjectForEdit = project;
    const modal = document.getElementById('add_task') as HTMLDialogElement;
    modal?.showModal();
  }

  fetchProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        const currentUserEmail = sessionStorage.getItem('email');
        
        // Filter for projects created by the user, where they are a member, or an assignee of any of its tasks
        const relevantProjects = projects.filter((project: any) => {
          if (!currentUserEmail) return true;
          
          const isCreator = project.createdByUserEmail === currentUserEmail;
          const isMember = (project.members || []).some((m: any) => m.userEmail === currentUserEmail || m.email === currentUserEmail);
          const isTaskAssignee = (project.tasks || []).some((task: any) => 
            (task.assignees || []).some((a: any) => a.userEmail === currentUserEmail || a.email === currentUserEmail)
          );

          return isCreator || isMember || isTaskAssignee;
        });

        // Calculate dynamic counts
        this.totalProjectsCount = relevantProjects.length;
        this.completedProjectsCount = relevantProjects.filter((p: any) => p.completed).length;
        this.activeProjectsCount = relevantProjects.filter((p: any) => !p.completed).length;

        // Show only active ones in the recent list
        let filteredProjects = relevantProjects.filter((project: any) => !project.completed);

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
      },
      error: (err) => console.error('Error fetching projects:', err)
    });
  }

  deleteProject(project: any) {
    if (!project || !project.id) return;

    this.projectService.deleteProject(project.id).subscribe({
      next: () => {},
      error: (err) => console.error('Error deleting project:', err)
    });
  }
}
