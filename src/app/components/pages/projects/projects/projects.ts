import { Component } from '@angular/core';
@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  projects = [
    {
      name: 'Project Alpha',
      progress: 60,
      totalDue: 3,
      textColor: 'text-sky-600',
    },
    {
      name: 'Project Delta',
      progress: 80,
      totalDue: 5,
      textColor: 'text-violet-500',
    },
    {
      name: 'Project Beta',
      progress: 45,
      totalDue: 2,
      textColor: 'text-green-600',
    },
    {
      name: 'Project Gamma',
      progress: 20,
      totalDue: 8,
      textColor: 'text-yellow-500',
    },

  ];
}
