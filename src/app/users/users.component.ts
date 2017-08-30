import { Component, OnInit, Input, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk';
import { MdPaginator, MdSort, MdDialog, MdDialogRef, MdDialogConfig, MdSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  constructor(
    private userService: UserService,
    public dialog: MdDialog,
    public snackBar: MdSnackBar) {

  }

  new() {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      disableClose: true,
      data: {
        user: new User
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.getAllUser();
      }
    });
  }

  edit(user: any) {
    const data: User = new User;
    data.id = user.id;
    data.userName = user.userName;
    data.firstName = user.firstName;
    data.lastName = user.lastName;
    data.role = user.role;
    data.lockoutEnabled = user.lockoutEnabled;
    data.email = user.email;

    const dialogRef = this.dialog.open(UserDetailsComponent, {
      disableClose: true,
      data: {
        user: data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'save') {
        this.getAllUser();
      }
    });
  }

  delete(user: any) {
    const dialogRef = this.dialog.open(DialogResultDelete);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.user = user;
        this.user.status = 3;
        this.user.role = user.role;
        console.log('DELETE USER', this.user);
        this.userService.updateUser(this.user)
          .subscribe(r => {
            const apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
            if (apiresp.succeeded) {
              this.openSnackBar('User has been deleted', 'Delete User');
              this.user = new User;
            }
            else {
              this.openSnackBar('apiresp.message', 'Error');
            }
          },
          (error: any) => {
            this.openSnackBar('apiresp.message', 'Error');
          },
          () => {
            this.getAllUser();
          });
      }
    });
  }

  getAllUser() {
    this.userService.getAllUsers()
      .subscribe(r => {
        const apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          this.userlist = JSON.parse(JSON.stringify(apiresp.payload));
          console.log(this.userlist);
        }
        else {
          // this.notificationService.error(apiresp.message);
        }
      }, (error: any) => {
        if (!error.ok) {
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
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
      this._paginator.page
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