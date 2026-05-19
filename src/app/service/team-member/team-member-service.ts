import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectService } from '../projects/project.service';
import { TaskService } from '../tasks/task.service';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root',
})
export class TeamMemberService {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private usersService: UsersService,
  ) {}

  getTeamMembers(): Observable<any[]> {
    return new Observable((observer) => {
      const currentUserEmail = sessionStorage.getItem('email');
      if (!currentUserEmail) {
        observer.next([]);
        observer.complete();
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
                  const userActivities = new Map<string, any[]>();

                  const sevenDaysAgo = new Date();
                  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                  const addActivity = (email: string, activity: any) => {
                    if (!email) return;
                    if (!userActivities.has(email)) userActivities.set(email, []);
                    userActivities.get(email)!.push(activity);
                  };

                  const getActionAndDate = (item: any, type: string) => {
                    const createdDate = item.created ? new Date(item.created) : null;
                    const modifiedDate = item.modified ? new Date(item.modified) : null;
                    const completedDate = item.completed ? new Date(item.completed) : null;

                    let action = `Created ${type}`;
                    let date = createdDate || new Date();

                    if (item.isCompleted || item.completed) {
                      action = `Completed ${type}`;
                      date = completedDate || modifiedDate || date;
                    } else if (item.modified) {
                      action = `Updated ${type}`;
                      date = modifiedDate || date;
                    }

                    return { action, date };
                  };

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

                      // Track project activities
                      const { action, date } = getActionAndDate(project, 'project');
                      if (project.createdByUserEmail && date >= sevenDaysAgo) {
                        addActivity(project.createdByUserEmail, {
                          type: 'Project',
                          name: project.name,
                          date: date,
                          action: action
                        });
                      }
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

                      // Track task activities
                      const { action, date } = getActionAndDate(task, 'task');
                      if (task.createdByUserEmail && date >= sevenDaysAgo) {
                        addActivity(task.createdByUserEmail, {
                          type: 'Task',
                          name: task.name,
                          date: date,
                          action: action
                        });
                      }
                    }
                  });

                  // Remove current user from the list
                  relatedEmails.delete(currentUserEmail);

                  const userMap = new Map<string, any>();
                  users.forEach((u: any) => userMap.set(u.email, u));

                  // 3. Map unique users to UI models
                  const members = Array.from(relatedEmails).map((email, index) => {
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

                    const activities = userActivities.get(email) || [];
                    activities.sort((a, b) => b.date.getTime() - a.date.getTime());

                    return {
                      image:
                        user.avatarUrl ||
                        `https://i.pravatar.cc/80?u=${user.id || user.userId || index}`,
                      name: name,
                      role: displayRole,
                      isActive: true,
                      activities: activities,
                    };
                  });

                  observer.next(members);
                  observer.complete();
                },
                error: (err) => {
                  console.error('Error fetching tasks:', err);
                  observer.error(err);
                },
              });
            },
            error: (err) => {
              console.error('Error fetching projects:', err);
              observer.error(err);
            },
          });
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          observer.error(err);
        },
      });
    });
  }
}
