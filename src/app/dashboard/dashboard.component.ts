import { Component, OnInit, ViewChild, OnChanges, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';


import { ChartService } from '../service/chart.service';
import { ApiResponse } from '../model/apiresponse';
import { MovementLineChart } from '../model/movementlinechart';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  providers: [ChartService]
})
export class DashboardComponent implements OnInit, OnChanges {
  @ViewChild('lineChart') linechart: BaseChartDirective

  constructor(
    private chartService: ChartService
  ) { }

  docFailedPercentage: number = 0;
  watchlistFailedPercentage: number = 0;
  expiredPercentage: number = 0;
  passedPercentage: number = 0;

  docFailedTotal: number = 0;
  watchlistFailedTotal: number = 0;
  expiredTotal: number = 0;
  passedTotal: number = 0;
  lineChartTitle: string = 'Today';

  private months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];


  public showLineChartLoader: Boolean = true;

  public brandPrimary: string = '#20a8d8';
  public brandSuccess: string = '#4dbd74';
  public brandInfo: string = '#63c2de';
  public brandWarning: string = '#f8cb00';
  public brandDanger: string = '#f86c6b';

  public mainChartData: Array<any> = [
    {
      data: [],
      label: 'Doc Auth Failed'
    },
    {
      data: [],
      label: 'Watchlist Failed'
    },
    {
      data: [],
      label: 'Clearance Expired'
    },
    {
      data: [],
      label: 'Clearance Passed'
    }
  ];
  public mainChartLabels: Array<any> = [];
  public mainChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
      }],
      yAxes: [{
        ticks: {
          beginAtZero: false,
          stepSize: 1
          // maxTicksLimit: 5,
          // stepSize: Math.ceil(250 / 5),
          // max: 250
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 2,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: true
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: this.convertHex(this.brandInfo, 10),
      borderColor: 'yellow',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: 'orange',
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: 'red',
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: this.brandSuccess,
      pointHoverBackgroundColor: '#fff',
    }
  ];
  public mainChartLegend: boolean = true;
  public mainChartType: string = 'line';

  public lineChartResp: Array<MovementLineChart>;
  public type: number = 1;
  public typelabel: string = 'Today';

  public getLineChart(type: number) {
    this.type = type;
    this.showLineChartLoader = true;

    const date = new Date();
    const month_value = this.months[date.getUTCMonth() + 1];
    const year_value = date.getUTCFullYear().toString();

    this.lineChartTitle = type === 1 ? 'Today' : type === 2 ? month_value : year_value;

    this.chartService.getLineChart(type)
      .subscribe(r => {
        let apiresp: ApiResponse = JSON.parse(JSON.stringify(r));
        if (apiresp.succeeded) {
          this.lineChartResp = JSON.parse(JSON.stringify(apiresp.payload));

          const totaldocAuthFailed: number[] = this.lineChartResp.map(m => m.docAuthFailed);
          const totalwatchlistFailed = this.lineChartResp.map(m => m.watchlistFailed);
          const totalclearanceExpired = this.lineChartResp.map(m => m.clearanceExpired);
          const totalclearancePassed = this.lineChartResp.map(m => m.clearancePassed);

          this.linechart.datasets = [
            { data: totaldocAuthFailed, label: 'Doc Auth Failed' },
            { data: totalwatchlistFailed, label: 'Watchlist Failed' },
            { data: totalclearanceExpired, label: 'Clearance Expired' },
            { data: totalclearancePassed, label: 'Clearance Passed' },
          ];
          this.linechart.labels = this.lineChartResp.map(m => m.date);

          this.docFailedTotal = totaldocAuthFailed.reduce((sum, current) => sum + current);
          this.watchlistFailedTotal = totalwatchlistFailed.reduce((sum, current) => sum + current);
          this.expiredTotal = totalclearanceExpired.reduce((sum, current) => sum + current);
          this.passedTotal = totalclearancePassed.reduce((sum, current) => sum + current);

          const total = this.docFailedTotal + this.watchlistFailedTotal + this.expiredTotal + this.passedTotal;

          this.docFailedPercentage = (this.docFailedTotal / total) * 100;
          this.watchlistFailedPercentage = (this.watchlistFailedTotal / total) * 100;
          this.expiredPercentage = (this.expiredTotal / total) * 100;
          this.passedPercentage = (this.passedTotal / total) * 100;

        }
        else {
          console.log(apiresp.message);
        }
      }, (error: any) => {
        this.showLineChartLoader = false;
        if (!error.ok) {
          if (error.status == 0) {
            console.log(error)
            //this.notificationService.error('Connection Refused');
          } else {
            console.log(error.statusText)
            //this.notificationService.error(error.statusText);
          }

        }
      }, () => {
        this.linechart.ngOnChanges({});
        this.showLineChartLoader = false;
        console.log('mainChartLabels', this.lineChartResp.map(m => m.date));
      });
  }

  // convert Hex to RGBA
  public convertHex(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
    return rgba;
  }




  ngOnInit(): void {
    this.getLineChart(1);

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('ngonchanges triggered');
  }
}

