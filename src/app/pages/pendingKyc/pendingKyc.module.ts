import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { PendingKyc} from './pendingKyc.component';
import { routing } from './pendingKyc.routing';
import { TableFilterPipe } from './table-filter.pipe';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
     Ng2SmartTableModule,
    DataTableModule,
  ],
  declarations: [
   PendingKyc,
    TableFilterPipe,
  ],
  providers: []
})
export class PendingKycModule {}
