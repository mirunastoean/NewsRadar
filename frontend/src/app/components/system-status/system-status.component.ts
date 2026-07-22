import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SystemService, SystemStats } from '../../services/system.service';

@Component({
  selector: 'app-system-status',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule],
  templateUrl: './system-status.component.html',
  styleUrls: ['./system-status.component.scss']
})
export class SystemStatusComponent implements OnInit {
  systemStats?: SystemStats; 

  constructor(private systemService: SystemService) {}

  ngOnInit(): void {
    this.systemService.getStats().subscribe({
      next: (data) => {
        this.systemStats = data;
      },
      error: (err) => console.error('Eroare la aducerea statisticilor de sistem:', err)
    });
  }
}