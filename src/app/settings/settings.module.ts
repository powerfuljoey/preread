import { NgModule } from '@angular/core';
import {MaterialModule} from '@angular/material';

import {SettingsComponent} from './settings.component';
import {SettingsRoutingModule} from './settings-routing.module';

@NgModule({
    imports: [
        MaterialModule,
        SettingsRoutingModule,
    ],
    exports: [
  
    ],
    declarations: [
        SettingsComponent,
    ],
    providers: [
    ]
  })
  // tslint:disable-next-line:eofline
  export class SettingsModule { }