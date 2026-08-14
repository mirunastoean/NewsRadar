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

  public sentimentOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'right' } }
  };
  public sentimentType: ChartType = 'pie';
  public sentimentData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ 
      data: [],
      backgroundColor: ['#10b981', '#ef4444', '#94a3b8', '#3b82f6', '#f59e0b'],
      borderWidth: 0, hoverOffset: 4
    }] 
  };

  public categoryOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'bottom' } }
  };
  public categoryType: ChartType = 'doughnut';
  public categoryData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ 
      data: [],
      backgroundColor: ['#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#64748b'],
      borderWidth: 0, hoverOffset: 4
    }] 
  };

  public sourcesOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    indexAxis: 'y', 
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, grid: { color: '#f1f5f9' }, border: { display: false } },
      y: { grid: { display: false } }
    }
  };
  public sourcesType: ChartType = 'bar';
  public sourcesData: ChartData<'bar'> = {
    labels: [], 
    datasets: [{ 
      data: [], label: 'Articole Extrase', 
      backgroundColor: '#3b82f6', hoverBackgroundColor: '#2563eb', borderRadius: 4
    }]
  };

  constructor(private systemService: SystemService) {}

  ngOnInit(): void {
    this.systemService.getAnalytics().subscribe({
      next: (data) => {
    
        if (data.sentimentDistribution) {
          this.sentimentData.labels = data.sentimentDistribution.map((item: any) => item.sentiment);
          this.sentimentData.datasets[0].data = data.sentimentDistribution.map((item: any) => item.count);
          this.sentimentData = { ...this.sentimentData };
        }

        if (data.categoryDistribution) {
          this.categoryData.labels = data.categoryDistribution.map((item: any) => item.category);
          this.categoryData.datasets[0].data = data.categoryDistribution.map((item: any) => item.count);
          this.categoryData = { ...this.categoryData };
        }

        if (data.topSources) {
          this.sourcesData.labels = data.topSources.map((item: any) => item.source);
          this.sourcesData.datasets[0].data = data.topSources.map((item: any) => item.count);
          this.sourcesData = { ...this.sourcesData };
        }
      },
      error: (err) => console.error(err)
    });
  }
}