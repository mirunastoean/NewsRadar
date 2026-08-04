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
    plugins: {
      legend: { display: true, position: 'right' },
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [ { data: [] } ] 
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [], 
    datasets: [
      { data: [], label: 'Articole extrase pe zi', backgroundColor: '#3f51b5' }
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
      error: (err) => console.error('Eroare la preluarea datelor analitice:', err)
    });
  }
}