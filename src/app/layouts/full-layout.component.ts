import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { MdIconRegistry } from '@angular/material';

import { AuthService } from '../pages/auth.service';
import { LoginPayload } from '../model/loginpayload';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[AuthService]
})
export class FullLayoutComponent implements OnInit {
  invert = false;
  public disabled: boolean = false;
  public status: { isopen: boolean } = { isopen: false };
  public username: string;
  public role: string;

  constructor(
    private authService:AuthService,
    private router: Router,
    iconRegistry: MdIconRegistry,
    sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'thumbs-up',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/favicon.svg'));
  }

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

 logout() {
    this.authService.logout()
      .subscribe(r => {
        console.log('Logout Resp:', r);
      }, (error: any) => {
        console.log('Logout Error:', error);
      }, () => {
        localStorage.removeItem('currentUser');
        this.router.navigate(['pages/login']);
      });

  }
  ngOnInit(): void {
    let currentUser: any = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.firstname;
    this.role = currentUser.role;
  }
}
