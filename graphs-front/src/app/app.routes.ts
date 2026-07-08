import { Routes } from '@angular/router';
import { AnalogicPage } from './pages/analogic/analogic.page';
import { AllOrNothingPage } from './pages/all-or-nothing/all-or-nothing.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/analogic',
    pathMatch: 'full',
  },
  {
    path: 'analogic',
    component: AnalogicPage,
    title: 'Simple Analogic Graph',
  },
  {
    path: 'all-or-nothing',
    component: AllOrNothingPage,
    title: 'All-or-Nothing Signal Graph',
  },
  {
    path: '**',
    redirectTo: '/analogic',
  },
];
