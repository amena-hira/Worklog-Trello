import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../service/projects/project.service';
import { TaskService } from '../../../../service/tasks/task.service';
import { UsersService } from '../../../../service/users/users.service';

@Component({
  selector: 'app-team-members',
  standalone: false,
  templateUrl: './team-members.html',
  styleUrl: './team-members.css',
})
export class TeamMembers implements OnInit {
  members: any[] = [];
  loading = true;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private usersService: UsersService,
  ) {}

  ngOnInit(): void {
    this.fetchTeamMembers();
  }

  fetchTeamMembers() {
    const currentUserEmail = sessionStorage.getItem('email');
    console.log(currentUserEmail);
    if (!currentUserEmail) {
      this.loading = false;
      return;
    }

    // Run API calls sequentially (nested)
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.projectService.getAllProjects().subscribe({
          next: (projects) => {
            this.taskService.getAllTasks().subscribe({
              next: (tasks) => {
                const relatedEmails = new Set<string>();
                const fallbackDetails = new Map<string, any>();

                console.log(users, projects, tasks);

                // 1. Check Projects for teammates
                projects.forEach((project: any) => {
                  const projectMembers = project.members || [];
                  const isCreator = project.createdByUserEmail === currentUserEmail;
                  const isMember = projectMembers.some(
                    (m: any) => m.userEmail === currentUserEmail || m.email === currentUserEmail,
                  );

                  if (isCreator || isMember) {
                    if (project.createdByUserEmail) relatedEmails.add(project.createdByUserEmail);

                    projectMembers.forEach((m: any) => {
                      const email = m.userEmail || m.email;
                      if (email) {
                        relatedEmails.add(email);
                        fallbackDetails.set(email, m);
                      }
                    });
                  }
                });

                // 2. Check Tasks for teammates
                tasks.forEach((task: any) => {
                  const taskAssignees = task.assignees || [];
                  const isCreator = task.createdByUserEmail === currentUserEmail;
                  const isAssignee = taskAssignees.some(
                    (a: any) => a.userEmail === currentUserEmail || a.email === currentUserEmail,
                  );

                  if (isCreator || isAssignee) {
                    if (task.createdByUserEmail) relatedEmails.add(task.createdByUserEmail);

                    taskAssignees.forEach((a: any) => {
                      const email = a.userEmail || a.email;
                      if (email) {
                        relatedEmails.add(email);
                        fallbackDetails.set(email, a);
                      }
                    });
                  }
                });

                // Remove current user from the list
                relatedEmails.delete(currentUserEmail);

                const userMap = new Map<string, any>();
                users.forEach((u: any) => userMap.set(u.email, u));

                // 3. Map unique users to UI models
                this.members = Array.from(relatedEmails).map((email, index) => {
                  const user = userMap.get(email) || fallbackDetails.get(email) || {};

                  let displayRole = 'Team Member';
                  if (user.role) {
                    const roleUpper = user.role.toUpperCase();
                    if (roleUpper.includes('ADMIN')) displayRole = 'Administrator';
                    else if (roleUpper.includes('MANAGER')) displayRole = 'Project Manager';
                  }

                  const name =
                    user.name ||
                    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                    user.userName ||
                    email;

                  return {
                    image:
                      user.avatarUrl ||
                      `https://i.pravatar.cc/80?u=${user.id || user.userId || index}`,
                    name: name,
                    role: displayRole,
                    isActive: true,
                  };
                });

                console.log(this.members);

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
}
