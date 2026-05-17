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
import { Profile } from './components/pages/profile/profile';
import { authGuard } from './auth/auth-guard';
import { AdminDashboard } from './components/pages/admin/admin-dashboard/admin-dashboard';
import { adminGuard } from './auth/admin/admin-guard';
import { WorklogUsers } from './components/pages/admin/worklog-users/worklog-users';

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
    canActivate: [authGuard], // Protects all children inside this block
    children: [
      { path: '', component: Dashboard },
      { path: 'tasks', component: Tasks },
      { path: 'inbox', component: Inbox },
      { path: 'calendar', component: Calendar },
      { path: 'projects', component: Projects },
      { path: 'profile', component: Profile },
      // Admin only route
      { path: 'admin/dashboard', component: AdminDashboard, canActivate: [adminGuard] },
      { path: 'admin/users', component: WorklogUsers, canActivate: [adminGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
