import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

@Injectable()
export class NotificationService {
  private notificationService: NotificationsService;
  constructor(notificationService: NotificationsService) {

    this.notificationService = notificationService;
  }

  error(err: string) {
    this.notificationService.error(
      'Error',
      err,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true
      }
    )
  }

  success(title:string,msg: string) {
    this.notificationService.success(
      title,
      msg,
      {
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true
      }
    )
  }

  // success(detail: string, summary?: string): void {
  //     this.message.push({
  //         severity: 'success', summary: summary, detail: detail
  //     });
  // }

  // info(detail: string, summary?: string): void {
  //     this.message.push({
  //         severity: 'info', summary: summary, detail: detail
  //     });
  // }

  // warning(detail: string, summary?: string): void {
  //     this.message.push({
  //         severity: 'warn', summary: summary, detail: detail
  //     });
  // }

  // error(detail: string, summary?: string): void {
  //     this.message.push({
  //         severity: 'error', summary: summary, detail: detail
  //     });
  // }
}