import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { SystemService } from '../services/system.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective], 
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' },
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ 
      data: [],
      backgroundColor: [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'
      ],
      borderWidth: 0,
      hoverOffset: 4
    }] 
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { 
        grid: { display: false }
      },
      y: { 
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        border: { display: false }
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [], 
    datasets: [
      { 
        data: [], 
        label: 'Articole', 
        backgroundColor: '#3b82f6',
        hoverBackgroundColor: '#2563eb',
        borderRadius: 6
      }
    ]
  };

  constructor(private systemService: SystemService) {}

  ngOnInit(): void {
    this.systemService.getAnalytics().subscribe({
      next: (data) => {
        if (data.sourceDistribution) {
          this.pieChartData.labels = data.sourceDistribution.map((item: any) => item.source);
          this.pieChartData.datasets[0].data = data.sourceDistribution.map((item: any) => item.count);
          this.pieChartData = { ...this.pieChartData };
        }
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