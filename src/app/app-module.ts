import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/shared/navbar/navbar';
import { Dashboard } from './components/pages/dashboard/dashboard/dashboard';
import { Login } from './components/pages/login/login';
import { Register } from './components/pages/register/register';
import { AuthCard } from './components/shared/auth-card/auth-card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Main } from './components/layout/main/main';
import { DrawerSidebar } from './components/shared/drawer-sidebar/drawer-sidebar';
import { PriorotyTable } from './components/pages/dashboard/prioroty-table/prioroty-table';
import { TaskActivity } from './components/pages/dashboard/task-activity/task-activity';
import { Calender } from './components/pages/dashboard/calender/calender';
import { ProjectStatus } from './components/pages/dashboard/project-status/project-status';
import { UpcomingDeadline } from './components/pages/dashboard/upcoming-deadline/upcoming-deadline';
import { ActivityProgress } from './components/pages/dashboard/activity-progress/activity-progress';
import { TeamMembers } from './components/pages/dashboard/team-members/team-members';
import { Tasks } from './components/pages/tasks/tasks/tasks';
import { Task } from './components/pages/tasks/task/task';
import { AddTask } from './components/pages/tasks/add-task/add-task';
import { Inbox } from './components/pages/inbox/inbox/inbox';
import { MessageProcessing } from './components/pages/inbox/message-processing/message-processing';

@NgModule({
  declarations: [
    App,
    Navbar,
    Dashboard,
    Login,
    Register,
    AuthCard,
    Main,
    DrawerSidebar,
    PriorotyTable,
    TaskActivity,
    Calender,
    ProjectStatus,
    UpcomingDeadline,
    ActivityProgress,
    TeamMembers,
    Tasks,
    Task,
    AddTask,
    Inbox,
    MessageProcessing
  ],
  imports: [
    MatSlideToggleModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
