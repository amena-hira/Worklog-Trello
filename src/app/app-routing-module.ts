import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/pages/login/login';
import { Register } from './components/pages/register/register';
import { Main } from './components/layout/main/main';
import { Dashboard } from './components/pages/dashboard/dashboard/dashboard';
import { Tasks } from './components/pages/tasks/tasks/tasks';
import { Inbox } from './components/pages/inbox/inbox/inbox';
import { Calendar } from './components/pages/calendar/calendar/calendar';
import { Projects } from './components/pages/projects/projects/projects';

const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: '',
    component: Main,
    children: [
      { path: '', component: Dashboard },
      { path: 'tasks', component: Tasks},
      { path: 'inbox', component: Inbox},
      { path: 'calendar', component: Calendar},
      { path: 'projects', component: Projects},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
