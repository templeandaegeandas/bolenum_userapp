import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
    
  },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'users', loadChildren: './users/users.module#UserModule' },
      { path: 'orderbook', loadChildren: './orderbook/orderbook.module#OrderbookModule' },
      { path: 'usersqueries', loadChildren: './usersqueries/usersqueries.module#UsersqueriesModule' },
      { path: 'pendingkyc', loadChildren: './pendingkyc/pendingkyc.module#PendingkycModule' },
      { path: 'adderc20', loadChildren: './Adderc20/adderc20.module#Adderc20Module' },
      { path: 'kycDetails', loadChildren: './KycDetails/kycDetails.module#kycDetailsModule' },
      { path: 'userdetails', loadChildren: './userDetails/userDetail.module#UserDetailModule' },
      { path: 'orderdetails', loadChildren: './orderDetails/orderDetails.module#OrderDetailsModule' },
      { path: 'reply', loadChildren: './reply/reply.module#ReplyModule' },
      { path: 'adderdetails', loadChildren: './adderdetails/adderdetails.module#AdderdetailsModule' },
    //   { path: 'editors', loadChildren: './editors/editors.module#EditorsModule' },
    //   { path: 'components', loadChildren: './components/components.module#ComponentsModule' },
    //   { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
    //   { path: 'ui', loadChildren: './ui/ui.module#UiModule' },
    //   { path: 'forms', loadChildren: './forms/forms.module#FormsModule' },
    //   { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
    //   { path: 'maps', loadChildren: './maps/maps.module#MapsModule' },
    // 
    ]  
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
