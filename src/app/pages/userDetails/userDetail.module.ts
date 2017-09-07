import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { UserDetail } from './userDetail.component';
import { TabViewModule } from 'primeng/primeng';
import { routing } from './userDetail.routing';
@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing,
    TabViewModule,
   
  ],
  declarations: [
    UserDetail,
  ],
})
export class UserDetailModule {}
