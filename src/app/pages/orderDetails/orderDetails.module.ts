import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgaModule } from '../../theme/nga.module';
import { OrderDetails } from './orderDetails.component';
import { TabViewModule } from 'primeng/primeng';
import { routing } from './orderDetails.routing';
@NgModule({
  imports: [
    CommonModule,
    NgaModule,
    routing,
    TabViewModule,
   
  ],
  declarations: [
  OrderDetails,
  ],
})
export class OrderDetailsModule {}
