import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { KycDetails } from './kycDetails.component';
import { TabViewModule } from 'primeng/primeng';
import { routing } from './kycDetails.routing';
@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing,
    TabViewModule,
   
  ],
  declarations: [
 KycDetails,
  ],
})
export class kycDetailsModule {}
