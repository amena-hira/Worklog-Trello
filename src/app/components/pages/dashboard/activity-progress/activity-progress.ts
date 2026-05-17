import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TaskService } from '../../../../service/tasks/task.service';

Chart.register(...registerables);

@Component({
  selector: 'app-activity-progress',
  standalone: false,
  templateUrl: './activity-progress.html',
  styleUrl: './activity-progress.css',
})
export class ActivityProgress implements AfterViewInit, OnDestroy {
  @ViewChild('taskChart') private chartRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  totalTasks: number = 0;
  completedTasks: number = 0;
  incompleteTasks: number = 0;
  overdueTasks: number = 0;
  loading = true;
  errorMessage: string | null = null;

  constructor(private taskService: TaskService) {}

  ngAfterViewInit() {
    if (!this.chartRef) return;
    const canvas = this.chartRef.nativeElement;

    this.chart?.destroy();

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Pending', 'Delayed'],
        datasets: [
          {
            data: [0, 0, 0, 0], // Start with 0, update from backend
            backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#f5365c'], // Colors matching labels
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
      },
    });

    this.fetchUserTaskStatus();
  }

  fetchUserTaskStatus() {
      this.loading = true;
      this.errorMessage = null;
      this.taskService.getUserTaskStats().subscribe({
        next: (stats: any) => {
          this.totalTasks = stats.totalTasks || 0;
          this.completedTasks = stats.completedTasks || 0;
          this.incompleteTasks = stats.incompleteTasks || 0;
          this.overdueTasks = stats.overdueTasks || 0;

          if (this.chart) {
            this.chart.data.datasets[0].data = [this.completedTasks, this.incompleteTasks, this.incompleteTasks, this.overdueTasks];
            this.chart.update();
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching user task stats for chart:', err);
          this.errorMessage = err?.error?.message || 'Failed to fetch chart statistics.';
          this.loading = false;
        }
      });
    
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
