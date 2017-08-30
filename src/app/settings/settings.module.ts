import { NgModule } from '@angular/core';
import {MaterialModule} from '@angular/material';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import {SettingsComponent} from './settings.component';
import {SettingsRoutingModule} from './settings-routing.module';

@NgModule({
    imports: [
        MaterialModule,
        SettingsRoutingModule,CommonModule,BrowserModule
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