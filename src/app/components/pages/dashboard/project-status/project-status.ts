import { Component } from '@angular/core';

@Component({
  selector: 'app-project-status',
  standalone: false,
  templateUrl: './project-status.html',
  styleUrl: './project-status.css',
})
export class ProjectStatus {
  projectStatus = [
    {
      icon: 'fa-regular fa-circle-check',
      name: 'Project Delta',
      phase: 'Development',
      progress: 80,
      status: 'On Track',
      dueDate: 'Oct 20',
      background: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      icon: 'fa-solid fa-triangle-exclamation',
      name: 'Project Beta',
      phase: 'Testing',
      progress: 45,
      status: 'At Risk',
      dueDate: 'Aug 15',
      background: 'bg-amber-100',
      textColor: 'text-amber-600',
    },
    {
      icon: 'fa-regular fa-circle-xmark',
      name: 'Project Gamma',
      phase: 'Planning',
      progress: 20,
      status: 'Delayed',
      dueDate: 'Sep 23',
      background: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      icon: 'fa-regular fa-circle-check',
      name: 'Project Alpha',
      phase: 'Development',
      progress: 60,
      status: 'Completed',
      dueDate: 'Jul 26',
      background: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
  ];
}
