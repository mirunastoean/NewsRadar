import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageSourcesDialogComponent } from './manage-sources-dialog/manage-sources-dialog.component';
import { SystemStatusComponent } from './components/system-status/system-status.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent }, 
  { path: 'sources', component: ManageSourcesDialogComponent } ,
  { path: 'status', component: SystemStatusComponent }
]