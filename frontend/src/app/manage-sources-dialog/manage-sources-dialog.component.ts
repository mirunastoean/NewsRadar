import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AddSourceDialogComponent } from '../components/add-source-dialog/add-source-dialog.component';
import { SourceService, RssSource } from '../services/source.service'; 

@Component({
  selector: 'app-manage-sources-dialog',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatDialogModule
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
      error: (err) => console.error('Eroare la încărcarea surselor:', err)
    });
  }

  openAddSourceDialog(): void {
    const dialogRef = this.dialog.open(AddSourceDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sourceService.addSource(result).subscribe({
          next: (newSource) => {
            this.sources.push(newSource);
            this.refreshTable();
          },
          error: (err) => console.error('Eroare la adăugarea sursei:', err)
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
        error: (err) => console.error('Eroare la ștergerea sursei:', err)
      });
    }
  }

  private refreshTable(): void {
    this.dataSource = [...this.sources];
  }
}