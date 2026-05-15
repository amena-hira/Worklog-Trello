import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../service/projects/project.service';

@Component({
  selector: 'app-overdue-projects-list',
  standalone: false,
  templateUrl: './overdue-projects-list.html',
  styleUrl: './overdue-projects-list.css',
})
export class OverdueProjectsList implements OnInit {
  priority_Tasks: any[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.fetchOverdueProjects();
  }

  fetchOverdueProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        const currentUserEmail = sessionStorage.getItem('email');
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize time to start of today

        const filteredProjects = projects.filter(project => {
          // Only include incomplete projects that have a due date
          if (project.completed || !project.dueDate) return false;
          
          if (currentUserEmail) {
            const isCreator = project.createdByUserEmail === currentUserEmail;
            const isMember = (project.members || []).some((m: any) => m.userEmail === currentUserEmail);
            if (!isCreator && !isMember) return false;
          }

          const dueDate = new Date(project.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          const diffTime = dueDate.getTime() - today.getTime();
          const dueDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          // Include projects that are overdue (< 0) or due within the next 3 days
          return dueDays <= 3;
        });

        // Sort them so the most overdue/urgent appear first
        filteredProjects.sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

        this.priority_Tasks = filteredProjects.map((project, index) => {
          const dueDate = new Date(project.dueDate!);
          dueDate.setHours(0, 0, 0, 0);
          const diffTime = dueDate.getTime() - today.getTime();
          const dueDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          const isOverdue = dueDays < 0;
          const isToday = dueDays === 0;
          const isTomorrow = dueDays === 1;

          let dueDateStr = `In ${dueDays} days`;
          if (isOverdue) dueDateStr = `Overdue by ${-dueDays} days!`;
          else if (isToday) dueDateStr = 'Today!';
          else if (isTomorrow) dueDateStr = 'Tomorrow!';

          return {
            name: project.name,
            project: 'Project',
            dueDate: dueDateStr,
            dueDays: dueDays,
            bgColor: project.color ? `bg-${project.color}-100` : 'bg-gray-100',
            textColor: project.color ? `text-${project.color}-700` : 'text-gray-700'
          };
        });
      },
      error: (err) => console.error('Error fetching overdue projects:', err)
    });
  }
}
