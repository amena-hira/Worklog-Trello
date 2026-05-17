import { LOCALE_ID, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import { provideNativeDateAdapter } from '@angular/material/core';

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
import { Calendar } from './components/pages/calendar/calendar/calendar';
import { CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarDatePipe, DateAdapter, provideCalendar } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { Projects } from './components/pages/projects/projects/projects';
import { Project } from './components/pages/projects/project/project';
import { AddProject } from './components/pages/projects/add-project/add-project';
import { OverdueProjectsList } from './components/pages/projects/overdue-projects-list/overdue-projects-list';
import { Updates } from './components/pages/projects/updates/updates';
import { FormProjectTask } from './components/common/form-project-task/form-project-task';
import { authInterceptor } from './auth/auth-interceptor';
import { FormDelete } from './components/common/form-delete/form-delete';
import { Profile } from './components/pages/profile/profile';
import { EditProfile } from './components/modal/profile/edit-profile/edit-profile';
import { AdminDashboard } from './components/pages/admin/admin-dashboard/admin-dashboard';
import { WorklogUsers } from './components/pages/admin/worklog-users/worklog-users';

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
    MessageProcessing,
    Calendar,
    Projects,
    Project,
    AddProject,
    OverdueProjectsList,
    Updates,
    FormProjectTask,
    FormDelete,
    Profile,
    EditProfile,
    AdminDashboard,
    WorklogUsers
  ],
  imports: [
    MatSlideToggleModule,
    MatTabsModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule, CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarDatePipe,
  ],
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),
    provideNativeDateAdapter(),
    // localization to display in French format
    { provide: LOCALE_ID, useValue: "fr"},
    provideBrowserGlobalErrorListeners(),
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  bootstrap: [App]
})
export class AppModule { }
