import { Routes } from '@angular/router';
import { ScheduleService } from '../features/schedule/schedule.service';
import { authGuard } from '../core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/auth'
  },
  {
    path: 'auth',
    loadComponent: () => import('../pages/auth/auth-page.component')
      .then(c => c.AuthPageComponent)
  },
  {
    path: 'schedule',
    canActivate: [authGuard],
    providers: [{ provide: ScheduleService }],
    loadComponent: () => import('../pages/schedule/schedule-page.component')
      .then(c => c.SchedulePageComponent)
  }
];
