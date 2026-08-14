import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { SystemService, SystemStats } from '../../services/system.service';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, BaseChartDirective],
  templateUrl: './system-status.component.html',
  styleUrls: ['./system-status.component.scss']
})
export class SystemStatusComponent implements OnInit {
  systemStats?: SystemStats; 
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { display: false } }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [], 
    datasets: [
      { 
        data: [], 
        label: 'Articole Colectate', 
        backgroundColor: '#0ea5e9', 
        hoverBackgroundColor: '#0284c7',
        borderRadius: 6
      }
    ]
  };

  constructor(private systemService: SystemService) {}

  ngOnInit(): void {

    this.systemService.getStats().subscribe({
      next: (data) => {
        this.systemStats = data;
      },
      error: (err) => console.error(err)
    });
    this.systemService.getAnalytics().subscribe({
      next: (data) => {
        if (data.dailyActivity) {
          this.barChartData.labels = data.dailyActivity.map((item: any) => item.date);
          this.barChartData.datasets[0].data = data.dailyActivity.map((item: any) => item.count);
          this.barChartData = { ...this.barChartData };
        }
      },
      error: (err) => console.error(err)
    });
  }
}