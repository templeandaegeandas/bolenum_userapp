
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { TradeNowComponent } from './tradeNow/tradeNow.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetComponent } from './forget/forget.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { HeadComponent } from './head/head.component';
import { ProfileComponent } from './profile/profile.component';
import { WalletComponent } from './wallet/wallet.component';
import 'rxjs/add/operator/switchMap';

export const APP_ROUTES: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tradeNow', component: TradeNowComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forget', component: ForgetComponent },
  { path: 'head', component: HeadComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'resetpassword', component: ResetpasswordComponent },
];


// export const routing = RouterModule.forRoot();
