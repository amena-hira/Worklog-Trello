import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../service/projects/project.service';
import { TaskService } from '../../../../service/tasks/task.service';
import { UsersService } from '../../../../service/users/users.service';

@Component({
  selector: 'app-task-activity',
  standalone: false,
  templateUrl: './task-activity.html',
  styleUrl: './task-activity.css',
})
export class TaskActivity implements OnInit {
  activities: any[] = [];
  loading = true;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.fetchActivities();
  }

  fetchActivities() {
    const currentUserEmail = sessionStorage.getItem('email');
    if (!currentUserEmail) {
      this.loading = false;
      return;
    }

    // Run API calls sequentially to combine data into a timeline
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.projectService.getAllProjects().subscribe({
          next: (projects) => {
            this.taskService.getAllTasks().subscribe({
              next: (tasks) => {
                const userMap = new Map<string, any>();
                users.forEach((u: any) => userMap.set(u.email, u));

                const allActivities: any[] = [];
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                // 1. Process relevant Projects
                projects.forEach((project: any) => {
                  const isCreator = project.createdByUserEmail === currentUserEmail;
                  const isMember = (project.members || []).some(
                    (m: any) => m.userEmail === currentUserEmail || m.email === currentUserEmail,
                  );

                  if (isCreator || isMember) {
                    const date = new Date(project.modified || project.created || new Date());
                    const email = project.createdByUserEmail;
                    
                    if (email && email !== currentUserEmail && date >= sevenDaysAgo) {
                      allActivities.push({
                        type: 'Project',
                        name: project.name,
                        email: email,
                        date: date,
                        action: project.modified ? 'Updated project' : (project.isCompleted ? 'Completed project' : 'Created project')
                      });
                    }
                  }
                });

                // 2. Process relevant Tasks
                tasks.forEach((task: any) => {
                  const isCreator = task.createdByUserEmail === currentUserEmail;
                  const isAssignee = (task.assignees || []).some(
                    (a: any) => a.userEmail === currentUserEmail || a.email === currentUserEmail,
                  );

                  if (isCreator || isAssignee) {
                    const date = new Date(task.modified || task.created || new Date());
                    const email = task.createdByUserEmail; // Assuming creator if exact modifier isn't known
                    
                    if (email && email !== currentUserEmail && date >= sevenDaysAgo) {
                      allActivities.push({
                        type: 'Task',
                        name: task.name,
                        email: email,
                        date: date,
                        action: task.isCompleted || task.completed ? 'Completed task' : (task.modified ? 'Updated task' : 'Created task')
                      });
                    }
                  }
                });

                // 3. Sort chronologically by most recent date
                allActivities.sort((a, b) => b.date.getTime() - a.date.getTime());

                // 4. Map the top 10 most recent updates to your UI structure
                this.activities = allActivities.slice(0, 10).map((activity, index) => {
                  const user = userMap.get(activity.email) || {};
                  const name =
                    user.name ||
                    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                    user.userName ||
                    activity.email ||
                    'Team Member';

                  return {
                    image:
                      user.avatarUrl ||
                      `https://i.pravatar.cc/80?u=${user.id || user.userId || index}`,
                    name: name,
                    task: `${activity.action}: ${activity.name}`,
                    time: this.timeSince(activity.date),
                    isActive: true,
                  };
                });

                this.loading = false;
              },
              error: (err) => {
                console.error('Error fetching tasks:', err);
                this.loading = false;
              },
            });
          },
          error: (err) => {
            console.error('Error fetching projects:', err);
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
      },
    });
  }

  private timeSince(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const intervals = [
      { limit: 86400, string: 'days ago' }, { limit: 3600, string: 'hours ago' }, { limit: 60, string: 'minutes ago' }
    ];
    for (let i of intervals) {
      const count = Math.floor(seconds / i.limit);
      if (count >= 1) return `${count} ${i.string}`;
    }
    return 'just now';
  }
}
