import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageSourcesDialogComponent } from './manage-sources-dialog/manage-sources-dialog.component';
import { SystemStatusComponent } from './components/system-status/system-status.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] }, 
  { path: 'sources', component: ManageSourcesDialogComponent, canActivate: [AuthGuard] },
  { path: 'status', component: SystemStatusComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] }
];