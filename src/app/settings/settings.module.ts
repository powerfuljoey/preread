import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        SettingsRoutingModule, FormsModule, ReactiveFormsModule
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