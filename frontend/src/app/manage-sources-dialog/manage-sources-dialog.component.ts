import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AddSourceDialogComponent } from '../components/add-source-dialog/add-source-dialog.component';

export interface RssSource {
  name: string;
  url: string;
}

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
export class ManageSourcesDialogComponent { 
  sources: RssSource[] = [
    { name: 'HotNews', url: 'https://www.hotnews.ro/rss' },
    { name: 'Digi24', url: 'https://www.digi24.ro/rss' },
    { name: 'Adevărul', url: 'https://adevarul.ro/rss' },
    { name: 'Ziare.com', url: 'https://ziare.com/rss' },
    { name: 'SpotMedia', url: 'https://spotmedia.ro/rss' }
  ];

  displayedColumns: string[] = ['name', 'url', 'actions'];
  dataSource = [...this.sources]; 

  constructor(private dialog: MatDialog) {}

  openAddSourceDialog(): void {
    const dialogRef = this.dialog.open(AddSourceDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sources.push(result);
        this.refreshTable();
      }
    });
  }

  deleteSource(sourceToDelete: RssSource): void {
    this.sources = this.sources.filter(s => s !== sourceToDelete);
    this.refreshTable();
  }

  private refreshTable(): void {
    this.dataSource = [...this.sources];
  }
}