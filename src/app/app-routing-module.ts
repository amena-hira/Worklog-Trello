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
import { authGuard } from './auth/auth-guard';

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
      { path: '', component: Dashboard, canActivate:[authGuard] },
      { path: 'tasks', component: Tasks, canActivate:[authGuard] },
      { path: 'inbox', component: Inbox, canActivate:[authGuard] },
      { path: 'calendar', component: Calendar, canActivate:[authGuard] },
      { path: 'projects', component: Projects, canActivate:[authGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
