import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { Usersqueries} from './usersqueries.component';
import { routing } from './usersqueries.routing';
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
 Usersqueries,
    TableFilterPipe,
  ],
  providers: []
})
export class UsersqueriesModule {}
