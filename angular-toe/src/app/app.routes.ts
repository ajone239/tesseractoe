import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PlayPageComponent } from './pages/play-page/play-page.component';
import { WaitingPageComponent } from './pages/waiting-page/waiting-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Home Page',
  },
  {
    path: 'waiting/:id',
    component: WaitingPageComponent,
    title: 'Waiting',
  },
  {
    path: 'play/:id',
    component: PlayPageComponent,
    title: 'Play',
  },
];
