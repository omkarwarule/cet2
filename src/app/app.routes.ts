import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { FilterComponent } from './filter/filter.component';
export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'app',
    component: HomeComponent,
    canActivate: [AuthGuard], 
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'filter', component: FilterComponent },

    ],
  },

];
