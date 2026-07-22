import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-source-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './add-source-dialog.component.html',
  styleUrls: ['./add-source-dialog.component.scss']
})
export class AddSourceDialogComponent {
  sourceName: string = '';
  sourceUrl: string = '';

  constructor(public dialogRef: MatDialogRef<AddSourceDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.sourceName && this.sourceUrl) {
      this.dialogRef.close({ name: this.sourceName, url: this.sourceUrl });
    }
  }
}