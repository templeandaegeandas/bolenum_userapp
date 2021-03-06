import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule,Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'toastr-ng2';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppHeaderComponent } from './appheader/app.header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { TradeNowComponent } from './tradeNow/tradeNow.component';
import { BeforLoginTradeNowComponent } from './beforeLoginTradeNow/beforelogin.tradeNow.component';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { APP_ROUTES } from './app.routes';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ProfileComponent } from './profile/profile.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { WalletComponent } from './wallet/wallet.component';
import { HttpClient } from './app.client.interceptor';
import { LoadingModule } from 'ngx-loading';
import { NoNumberDirective } from './directives/no.number.directive';
import { NoSpecialCharacterDirective } from './directives/no.special.character.directive';
import { OnlyNumberDirective } from './directives/only.number.directive';
import { NoNumberSpecialCharacterDirective } from './directives/no.number.special.character.directive';
import { DepositComponent } from './deposit/deposit.component';
import { QRCodeModule } from 'angular2-qrcode';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { MyDatePickerModule } from 'mydatepicker';
import { PrivateRouteAuthGuard } from './auth-guard/private.route.auth.guard.service';
import { PublicRouteAuthGuard } from './auth-guard/public.route.auth.guard.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FaqComponent } from './faq/faq.component';
import { TermsServiceComponent } from './terms-service/terms-service.component';
import { AboutBolenumExchangeComponent } from './about-bolenum-exchange/about-bolenum-exchange.component';
import { TeamComponent } from './team/team.component';
import { HowToUseComponent } from './how-to-use/how-to-use.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HistoryComponent } from './history/history.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ImageCropperModule } from 'ng2-img-cropper';
import { AppEventEmiterService } from './app.event.emmiter.service';
import { StompService } from 'ng2-stomp-service';
import { ClipboardModule } from 'ngx-clipboard';
import { TradingComponent } from './trading/trading.component';
import { SellComponent } from './sell/sell.component';
import { CreateAdvertiesmentComponent } from './create-advertiesment/create-advertiesment.component';
import { DisputeComponent } from './dispute/dispute.component';
import {RecaptchaModule, RECAPTCHA_SETTINGS} from 'ng-recaptcha';
// import { AuthenticatedHttpService } from './interceptor';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { CancelTradeComponent } from './cancel-trade/cancel-trade.component';
import { FeesDetailsComponent } from './fees-details/fees-details.component';
import { IntTelInputDirective } from  './directives/int.tel.input.directive';
import { NotifyUserComponent } from './notify-user/notify-user.component';
import { UserNotificationComponent } from './user-notification/user-notification.component';
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
    BeforLoginTradeNowComponent,
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
    OnlyNumberDirective,
    DepositComponent,
    FaqComponent,
    TermsServiceComponent,
    AboutBolenumExchangeComponent,
    TeamComponent,
    HowToUseComponent,
    PrivacyPolicyComponent,
    HistoryComponent,
    TradingComponent,
    SellComponent,
    CreateAdvertiesmentComponent,
    DisputeComponent,
    CancelTradeComponent,
    FeesDetailsComponent,
    IntTelInputDirective,
    NotifyUserComponent,
    UserNotificationComponent

  ],
  imports: [
    BrowserModule,
    ChartModule,
    HttpModule,
    AccordionModule.forRoot(),
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(APP_ROUTES, {useHash: true}),
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot( {preventDuplicates: true}),
    LoadingModule,
    QRCodeModule,
    MyDatePickerModule,
    BsDropdownModule.forRoot(),
    Ng2DeviceDetectorModule.forRoot(),
    ImageCropperModule,
    ClipboardModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule
  ],
  providers: [{ provide: HighchartsStatic, useFactory: highchartsFactory },
     HttpClient,
   { provide: Http, useClass: HttpClient },
    PrivateRouteAuthGuard,
    PublicRouteAuthGuard,
    AppEventEmiterService,
    StompService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LfRizsUAAAAAMmHVQLEhlIrCgfelUbAqNlibfPg',
      },
    },
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
