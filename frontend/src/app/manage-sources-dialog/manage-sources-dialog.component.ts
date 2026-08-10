import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AddSourceDialogComponent } from '../components/add-source-dialog/add-source-dialog.component';
import { SourceService, RssSource } from '../services/source.service';

@Component({
  selector: 'app-manage-sources-dialog',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './manage-sources-dialog.component.html',
  styleUrls: ['./manage-sources-dialog.component.scss']
})
export class ManageSourcesDialogComponent implements OnInit {
  sources: RssSource[] = [];
  displayedColumns: string[] = ['name', 'url', 'actions'];
  dataSource: RssSource[] = [];

  constructor(private dialog: MatDialog, private sourceService: SourceService) {}

  ngOnInit(): void {
    this.loadSources();
  }

  loadSources(): void {
    this.sourceService.getSources().subscribe({
      next: (data) => {
        this.sources = data;
        this.refreshTable();
      },
      error: (err) => console.error(err)
    });
  }

  openAddSourceDialog(): void {
    const dialogRef = this.dialog.open(AddSourceDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sourceService.addSource(result).subscribe({
          next: (newSource) => {
            this.sources.push(newSource);
            this.refreshTable();
          },
          error: (err) => console.error(err)
        });
      }
    });
  }

  deleteSource(sourceToDelete: RssSource): void {
    if (sourceToDelete.id) {
      this.sourceService.deleteSource(sourceToDelete.id).subscribe({
        next: () => {
          this.sources = this.sources.filter(s => s.id !== sourceToDelete.id);
          this.refreshTable();
        },
        error: (err) => console.error(err)
      });
    }
  }

  private refreshTable(): void {
    this.dataSource = [...this.sources];
  }
}