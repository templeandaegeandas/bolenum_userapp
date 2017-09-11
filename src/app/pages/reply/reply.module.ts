import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Reply } from './reply.component';
import { TabViewModule } from 'primeng/primeng';
import { routing } from './reply.routing';
@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing,
    TabViewModule,
   
  ],
  declarations: [
  Reply,
  ],
})
export class ReplyModule {}
