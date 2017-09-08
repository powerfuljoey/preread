import { Component, OnInit, OnDestroy, ViewChild, TemplateRef,ElementRef } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { MdPaginator, MdSort, MdDialog, MdDialogRef, MdDialogConfig, MdSnackBar } from '@angular/material';

import { ProfileService } from './profile.service';
import { ApiResponse } from '../model/apiresponse';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    ProfileService,
  ]
})
export class ProfileComponent implements OnInit, OnDestroy {
  profilelist: any[];
  movementlist: any[];
  profile: any;
  loadingIndicator: boolean = true;
  
  totalProfile: number = 0;
  totalNew: number = 0;
  totalNearExpiry: number = 0;
  totalExpired: number = 0;

  displayedColumns = ['photo','name', 'passportno', 'nationality','status'];
  profileDatabase: ProfileDatabase = new ProfileDatabase([]);
  dataSource: ProfileDataSource | null;

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;


  constructor(
    private router: Router,
    private profileService: ProfileService,
  ) { }

  ngOnInit() {
    this.getAllMovements();

  }

  ngOnDestroy() {

  }

  getAllMovements() {
    this.profileService.getAllMovements()
      .subscribe(r => {
        let apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          this.movementlist = JSON.parse(JSON.stringify(apiresp.payload));
          if (this.movementlist.length > 0) {
            //  this.subscribeToData();
          }
          console.log(this.movementlist);
        }
        else {
        }
      }, (error: any) => {
        if (!error.ok) {
          if (error.status == 0) {
          } else {
          }

        }
      }, () => {
        console.log('Completed');
        this.countAll();
        this.countNew();
        this.countNearExpiry();
        this.countExpired();
        this.profileDatabase = new ProfileDatabase(this.movementlist);
        this.dataSource = new ProfileDataSource(this.profileDatabase, this.sort, this.paginator);
        // Observable.fromEvent(this.filter.nativeElement, 'keyup')
        //   .debounceTime(150)
        //   .distinctUntilChanged()
        //   .subscribe(() => {
        //     if (!this.dataSource) { return; }
        //     this.dataSource.filter = this.filter.nativeElement.value;
        //   });
        this.loadingIndicator = false;
      });
  }

  countAll() {
    console.log('countAll');
    if (this.movementlist !== undefined) {
      if (this.movementlist.length > 0) {
        this.totalProfile = this.movementlist.length
      }
    }
  }

  countNew() {
    console.log('countNew');
    if (this.movementlist !== undefined) {
      if (this.movementlist.length > 0) {
        this.totalNew = this.movementlist.filter(f => f.movementStatus === 1).length
      }
    }
  }

  countNearExpiry() {
    console.log('countNearExpiry');
    if (this.movementlist !== undefined) {
      if (this.movementlist.length > 0) {
        this.totalNearExpiry = this.movementlist.filter(f => f.movementStatus === 7).length
      }
    }
  }

  countExpired() {
    console.log('countExpired');
    if (this.movementlist !== undefined) {
      if (this.movementlist.length > 0) {
        this.totalExpired = this.movementlist.filter(f => f.movementStatus === 8).length
      }
    }
  }
}

export class ProfileDatabase {
  movements: any[];
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] {
    return this.dataChange.value;
  }
  constructor(userlist: any[]) {
    this.dataChange.next(userlist);
    console.log(this.dataChange);
  }
}

export class ProfileDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(
    private _exampleDatabase: ProfileDatabase,
    private _sort: MdSort,
    private _paginator: MdPaginator
  ) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.mdSortChange,
      this._filterChange,
      this._paginator.page
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData().slice().filter((item: any) => {
        let searchStr = (item.profile.firstName + item.profile.lastName).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    });

  }

  disconnect() { }

  getSortedData(): any[] {
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

    const data = this._exampleDatabase.data.slice().splice(startIndex, this._paginator.pageSize).slice();

    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'name': [propertyA, propertyB] = [a.profile.firstName, b.profile.firstName]; break;
        case 'passportno': [propertyA, propertyB] = [a.profile.passportNo, b.profile.passportNo]; break;
        case 'nationality': [propertyA, propertyB] = [a.profile.nationality, b.profile.nationality]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }

}
