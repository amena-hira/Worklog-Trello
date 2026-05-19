import { Component, OnInit } from '@angular/core';
import { TeamMemberService } from '../../../../service/team-member/team-member-service';

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
    private teamMemberService: TeamMemberService,
  ) {}

  ngOnInit(): void {
    this.fetchTeamMembers();
  }

  fetchTeamMembers() {
    this.loading = true;
    this.teamMemberService.getTeamMembers().subscribe({
      next: (members) => {
        this.members = members;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching team members:', err);
        this.loading = false;
      },
    });
  }
}
