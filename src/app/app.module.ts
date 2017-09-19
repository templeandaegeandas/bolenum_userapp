import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }   from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'toastr-ng2';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { TradeNowComponent } from './tradeNow/tradeNow.component';
import { LoginComponent } from './login/login.component';
import { ForgetComponent } from './forget/forget.component';
import { APP_ROUTES } from './app.routes';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { HeadComponent } from './head/head.component';
import { ProfileComponent } from './profile/profile.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WalletComponent } from './wallet/wallet.component';

declare var require: any;
export function highchartsFactory() {
     const hc = require('highcharts');
     const dd = require('highcharts/modules/drilldown');
      dd(hc);
      return hc;
    }
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    TradeNowComponent,
    LoginComponent,
    SignUpComponent,
    ForgetComponent,
    ResetpasswordComponent,
    HeadComponent,
    ProfileComponent,
    WithdrawComponent,
    WalletComponent,
  ],
  imports: [
    BrowserModule,
    ChartModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(APP_ROUTES, {useHash: true}),
     ToastrModule.forRoot()
  ],
  providers: [{
      provide: HighchartsStatic,
      useFactory: highchartsFactory}],

  bootstrap: [AppComponent]
})
export class AppModule { }
