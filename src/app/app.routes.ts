
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
import { ForgotComponent } from './forgot/forgot.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ProfileComponent } from './profile/profile.component';
import { WalletComponent } from './wallet/wallet.component';
import { DepositComponent } from './deposit/deposit.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import 'rxjs/add/operator/switchMap';
import { PrivateRouteAuthGuard } from './auth-guard/private.route.auth.guard.service';
import { PublicRouteAuthGuard } from './auth-guard/public.route.auth.guard.service';
import { HistoryComponent } from './history/history.component';
import { FaqComponent } from './faq/faq.component';
import { TermsServiceComponent } from './terms-service/terms-service.component';
import { AboutBolenumExchangeComponent } from './about-bolenum-exchange/about-bolenum-exchange.component';
import { TeamComponent } from './team/team.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ PrivateRouteAuthGuard ] },
  { path: 'tradeNow', component: TradeNowComponent },
  { path: 'login', component: LoginComponent, canActivate: [ PublicRouteAuthGuard ] },
  { path: 'sign-up', component: SignUpComponent, canActivate: [ PublicRouteAuthGuard ] },
  { path: 'forgot', component: ForgotComponent, canActivate: [ PublicRouteAuthGuard ] },
  { path: 'profile', component: ProfileComponent },
  { path: 'wallet', component: WalletComponent,
    
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'withdraw' },
      { path: 'deposit', component: DepositComponent },
      { path: 'withdraw', component: WithdrawComponent },
      { path: 'history', component: HistoryComponent }
    ]

 },
  { path: 'resetpassword', component: ResetpasswordComponent, canActivate: [ PublicRouteAuthGuard ] },
  { path: 'deposit', component: DepositComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'team', component: TeamComponent  },
  { path: 'how-to-use', component: HowToUseComponent  },
  { path: 'terms-service', component: TermsServiceComponent  },
  { path: 'privacy-policy', component: PrivacyPolicyComponent   },
  { path: 'about-bolenum-exchange', component: AboutBolenumExchangeComponent },];
