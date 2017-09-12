import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { AdderDetails } from './adderDetails.component';
import { TabViewModule } from 'primeng/primeng';
import { routing } from './adderDetails.routing';

@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing,
    TabViewModule,
   
  ],
  declarations: [
  AdderDetails,
  ],
})
export class AdderDetailsModule {}
