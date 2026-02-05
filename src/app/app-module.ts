import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './components/shared/navbar/navbar';
import { Dashboard } from './components/pages/dashboard/dashboard/dashboard';
import { Login } from './components/pages/login/login';
import { Register } from './components/pages/register/register';
import { AuthCard } from './components/shared/auth-card/auth-card';
import { ReactiveFormsModule } from '@angular/forms';
import { Main } from './components/layout/main/main';

@NgModule({
  declarations: [
    App,
    Navbar,
    Dashboard,
    Login,
    Register,
    AuthCard,
    Main
  ],
  imports: [
    MatSlideToggleModule,
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
