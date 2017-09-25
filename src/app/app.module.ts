import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
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
<<<<<<< HEAD
import {HttpClient} from './app.client.interceptor';

=======
import { HttpClient } from './app.client.interceptor';
import { LoadingModule } from 'ngx-loading';
>>>>>>> 0d55cebf0f36490da2277b0087bb965ad76bbc59
import { NoNumberDirective } from './directives/no.number.directive';
import { NoSpecialCharacterDirective } from './directives/no.special.character.directive';
import { NoNumberSpecialCharacterDirective } from './directives/no.number.special.character.directive';
import { DepositComponent } from './deposit/deposit.component';
import { QRCodeModule } from 'angular2-qrcode';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { MyDatePickerModule } from 'mydatepicker';
import { PrivateRouteAuthGuard } from './auth-guard/private.route.auth.guard.service';
import { PublicRouteAuthGuard } from './auth-guard/public.route.auth.guard.service';

import { FaqComponent } from './faq/faq.component';
import { TermsServiceComponent } from './terms-service/terms-service.component';
import { AboutBolenumExchangeComponent } from './about-bolenum-exchange/about-bolenum-exchange.component';
import { TeamComponent } from './team/team.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HistoryComponent } from './history/history.component';

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
    NoNumberSpecialCharacterDirective,
    DepositComponent,
    FaqComponent,
    TermsServiceComponent,

    AboutBolenumExchangeComponent,
    TeamComponent,
    HowToUseComponent,
    PrivacyPolicyComponent,
    HistoryComponent,

  ],
  imports: [
    BrowserModule,
    ChartModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
<<<<<<< HEAD
    RouterModule.forRoot(APP_ROUTES, {useHash: true}),
     ToastrModule.forRoot(),
    
=======
    RouterModule.forRoot(APP_ROUTES, { useHash: true }),
    ToastrModule.forRoot( {preventDuplicates: true}),
    LoadingModule,
    QRCodeModule,
    MyDatePickerModule,
    Ng2DeviceDetectorModule.forRoot()
  ],
  providers: [{ provide: HighchartsStatic, useFactory: highchartsFactory },
    HttpClient,
    PrivateRouteAuthGuard,
    PublicRouteAuthGuard
>>>>>>> 0d55cebf0f36490da2277b0087bb965ad76bbc59
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
