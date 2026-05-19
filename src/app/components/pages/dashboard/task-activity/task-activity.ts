import { Component, OnInit } from '@angular/core';
import { TeamMemberService } from '../../../../service/team-member/team-member-service';

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
    private teamMemberService: TeamMemberService,
  ) {}

  ngOnInit(): void {
    this.fetchActivities();
  }

  fetchActivities() {
    this.loading = true;
    this.teamMemberService.getTeamMembers().subscribe({
      next: (members) => {
        let allActivities: any[] = [];
        
        // Extract all nested activities from team members
        members.forEach((member) => {
          (member.activities || []).forEach((activity: any) => {
            allActivities.push({
              image: member.image,
              name: member.name,
              isActive: member.isActive,
              task: `${activity.action}: ${activity.name}`,
              date: activity.date,
            });
          });
        });

        // Sort chronologically by most recent date
        allActivities.sort((a, b) => b.date.getTime() - a.date.getTime());

        // Map the top 10 most recent updates to your UI structure
        this.activities = allActivities.slice(0, 10).map((activity) => ({
          ...activity,
          time: this.timeSince(activity.date),
        }));

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching activities:', err);
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
