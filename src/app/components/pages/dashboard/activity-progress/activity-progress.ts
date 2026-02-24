import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-activity-progress',
  standalone: false,
  templateUrl: './activity-progress.html',
  styleUrl: './activity-progress.css',
})
export class ActivityProgress implements AfterViewInit, OnDestroy {
  private chart?: Chart;

  ngAfterViewInit() {
    const canvas = document.getElementById('taskChart') as HTMLCanvasElement | null;
    if (!canvas) return;

    this.chart?.destroy();

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Pending', 'Delayed'],
        datasets: [
          {
            data: [8, 9, 7, 8],
            backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#f5365c'],
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
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
