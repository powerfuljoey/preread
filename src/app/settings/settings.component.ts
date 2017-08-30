import { Component, OnInit,NgModule } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public isAdmin: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
