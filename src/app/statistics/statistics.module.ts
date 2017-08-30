import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {MaterialModule} from '@angular/material';

import {StatisticsComponent} from './statistics.component';
import {StatisticsRoutingModule} from './statistics-routing.module';

@NgModule({
    imports: [
        MaterialModule,
        StatisticsRoutingModule,
        ChartsModule
    ],
    exports: [
  
    ],
    declarations: [
        StatisticsComponent,
    ],
    providers: [
    ]
  })
  // tslint:disable-next-line:eofline
  export class StatisticsModule { }