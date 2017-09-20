import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }   from '@angular/http';
import { FormsModule }   from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'toastr-ng2';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppHeaderComponent } from './appheader/app.header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { TradeNowComponent } from './tradeNow/tradeNow.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { APP_ROUTES } from './app.routes';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ProfileComponent } from './profile/profile.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WalletComponent } from './wallet/wallet.component';
import {HttpClient} from './app.client.interceptor';
import { LoadingModule } from 'ngx-loading';
import { NoNumberDirective } from './directives/no.number.directive';
import { NoSpecialCharacterDirective } from './directives/no.special.character.directive';
import { NoNumberSpecialCharacterDirective } from './directives/no.number.special.character.directive';

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
    AppHeaderComponent,
    FooterComponent,
    DashboardComponent,
    TradeNowComponent,
    LoginComponent,
    SignUpComponent,
    ForgotComponent,
    ResetpasswordComponent,
    ProfileComponent,
    WithdrawComponent,
    WalletComponent,
    NoNumberDirective,
    NoSpecialCharacterDirective,
    NoNumberSpecialCharacterDirective
  ],
  imports: [
    BrowserModule,
    ChartModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(APP_ROUTES, {useHash: true}),
     ToastrModule.forRoot(),
     LoadingModule
  ],
  providers: [{
      provide: HighchartsStatic,
      useFactory: highchartsFactory,},HttpClient],

  bootstrap: [AppComponent]
})
export class AppModule { }
