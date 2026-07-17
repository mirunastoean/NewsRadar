import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-manage-sources-dialog',
  imports: [MatDialogModule, MatButtonModule, MatTableModule, MatCardModule],
  templateUrl: './manage-sources-dialog.component.html',
  styleUrl: './manage-sources-dialog.component.scss'
})
export class ManageSourcesDialogComponent {
  displayedColumns: string[] = ['name', 'url', 'actions'];

  sources = [
    { name: 'HotNews', url: 'https://www.hotnews.ro/rss' },
    { name: 'Digi24', url: 'https://www.digi24.ro/rss' },
    { name: 'Adevărul', url: 'https://adevarul.ro/rss' },
    { name: 'Ziare.com', url: 'https://ziare.com/rss' },
    { name: 'SpotMedia', url: 'https://spotmedia.ro/rss' }
  ];
}