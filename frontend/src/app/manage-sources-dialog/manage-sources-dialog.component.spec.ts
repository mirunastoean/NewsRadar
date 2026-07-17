import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSourcesDialogComponent } from './manage-sources-dialog.component';

describe('ManageSourcesDialogComponent', () => {
  let component: ManageSourcesDialogComponent;
  let fixture: ComponentFixture<ManageSourcesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSourcesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSourcesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
