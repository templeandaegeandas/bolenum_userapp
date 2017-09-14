
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { TradeNowComponent } from './tradeNow/tradeNow.component';
import { LoginComponent } from './login/login.component';

import 'rxjs/add/operator/switchMap';

const APP_ROUTES: Routes = [
   {path: 'header', component: HeaderComponent },
   {path:'dashboard',component:  DashboardComponent}, 
   {path:'tradeNow',component:  TradeNowComponent}, 
   {path:'login',component: LoginComponent}, 
   {path:'footer',component: FooterComponent}, 
  
   { path: '**',   redirectTo: '/header',pathMatch: 'full'  },
 ];


export const routing = RouterModule.forRoot(APP_ROUTES);
