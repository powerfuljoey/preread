import { Component, OnInit, Input, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk';
import { MdPaginator, MdSort, MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { NotificationService } from '../service/notification.service'
import { User } from './user';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserService } from './user.service';
import { ApiResponse } from '../model/apiresponse';
import { PagedResult } from '../model/pagedresult';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  providers: [
    UserService,
    NotificationService,
  ],
  styleUrls: ['./users.component.scss']
})

export class UsersComponent implements OnInit {

  displayedColumns = ['actions', 'userName', 'firstName', 'lastName', 'role', 'status'];
  userDatabase: UserDatabase = new UserDatabase([]);
  dataSource: UserDataSource | null;

  @Input() public user_input: User;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('filter') filter: ElementRef;

  loadingIndicator: boolean = true;
  userlist: User[];
  user: User = new User;
  loading: boolean;
  options = {
    position: ["bottom", "right"],
    timeOut: 5000,
    lastOnBottom: true
  };
  state: string;
  closeResult: string;

  constructor(
    private userService: UserService,
    public dialog: MdDialog) {

  }

  new() {
    let dialogRef = this.dialog.open(UserDetailsComponent, {
      disableClose: true,
      data: {
        user: null
      }
    });
  }

  edit(user: any) {
    let dialogRef = this.dialog.open(UserDetailsComponent, {
      disableClose: true,
      data: {
        user: user
      }
    });
  }

  delete() {
    let dialogRef = this.dialog.open(DialogResultDelete);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  getAllUser() {
    this.userService.getAllUsers()
      .subscribe(r => {
        let apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          this.userlist = JSON.parse(JSON.stringify(apiresp.payload));
          console.log(this.userlist);
        }
        else {
          // this.notificationService.error(apiresp.message);
        }
      }, (error: any) => {
        if (!error.ok) {
          this.state = error.status;
          if (error.status == 0) {
            // this.notificationService.error('Connection Refused');
          } else {
            // this.notificationService.error(error.statusText);
          }

        }
      }, () => {
        console.log('Completed');
        this.userDatabase = new UserDatabase(this.userlist);
        this.dataSource = new UserDataSource(this.userDatabase, this.sort, this.paginator);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
        this.loadingIndicator = false;
        console.log(this.userDatabase.data.length);
      });
  }

  ngOnInit() {
    this.getAllUser();
  }
}

export class UserDatabase {
  users: User[];
  dataChange: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  get data(): User[] {
    return this.dataChange.value;
  }
  constructor(userlist: User[]) {
    this.dataChange.next(userlist);
    console.log(this.dataChange);
  }
}

export class UserDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(
    private _exampleDatabase: UserDatabase,
    private _sort: MdSort,
    private _paginator: MdPaginator
  ) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<User[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData().slice().filter((item: User) => {
        let searchStr = (item.firstName + item.lastName).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    });

  }

  disconnect() { }

  getSortedData(): User[] {
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

    const data = this._exampleDatabase.data.slice().splice(startIndex, this._paginator.pageSize).slice();

    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'userName': [propertyA, propertyB] = [a.userName, b.userName]; break;
        case 'firstName': [propertyA, propertyB] = [a.firstName, b.firstName]; break;
        case 'lastName': [propertyA, propertyB] = [a.lastName, b.lastName]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

}

@Component({
  selector: 'dialog-delete',
  template: `<h1 md-dialog-title>Delete</h1>
<div md-dialog-content>Delete user?</div>
<div md-dialog-actions>
  <button md-button md-dialog-close="Yes">Yes</button>
  <button md-button md-dialog-close="No">No</button>
</div>`,
})
export class DialogResultDelete {
  constructor(public dialogRef: MdDialogRef<DialogResultDelete>) { }
}