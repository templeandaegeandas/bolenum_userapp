import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { Adderdetails } from './adderdetails.component';
import { TabViewModule } from 'primeng/primeng';
import { routing } from './adderdetails.routing';

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing,
    TabViewModule,
   
  ],
  declarations: [
  Adderdetails,
  ],
})
export class AdderdetailsModule {}
