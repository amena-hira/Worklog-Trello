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
import { ReactiveFormsModule } from '@angular/forms';
import { Main } from './components/layout/main/main';
import { DrawerSidebar } from './components/shared/drawer-sidebar/drawer-sidebar';
import { PriorotyTable } from './components/pages/dashboard/prioroty-table/prioroty-table';
import { TaskActivity } from './components/pages/dashboard/task-activity/task-activity';
import { Calender } from './components/pages/dashboard/calender/calender';
import { ProjectStatus } from './components/pages/dashboard/project-status/project-status';

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
    ProjectStatus
  ],
  imports: [
    MatSlideToggleModule,
    MatTabsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
