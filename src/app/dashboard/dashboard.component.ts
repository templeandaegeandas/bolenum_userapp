import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { DashBoardService } from './dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashBoardService]
})
export class DashboardComponent implements OnInit {

    options :any;

    public tradingCountData:any;
    public totalNumberOfTrading : any;
    public totalNumberOfBuy:any;
    public totalNumberOfSell:any;
  constructor( private router: Router,private dashBoardService:DashBoardService) {

    window.scrollTo(0, 0);
    this.options = {
           chart: {
        type: 'areaspline'
    },
    title: {
        },
    legend: {
       marker : {symbol : 'square',radius : 12 }

       },
    xAxis: {
        categories: [
            'JAN',
            'FEB',
            'MAR',
            'APR',
            'MAY',
            'JUN',
            'JUL',
            'AUG'
        ],

    },
    yAxis: {
        title: {
            text: ' '
        }
    },

    tooltip: {
        shared: false,
        valueSuffix: ' units'
    },

    credits: {
        enabled: false
    },

    plotOptions: {
        areaspline: {
            fillOpacity: 0.5
        },
          series: {

                marker: {

                    enabled: false

                }

            }

    },
    series: [{
        name: 'BTC',
        data: [3, 4, 3, 5, 4, 10, 12],
    }, {
        name: 'ETH',

         data: [1, 3, 4, 3, 3, 5, 4]
    }],
    colors: ["#fE6C61","#5472D2"]

        };


   }

  ngOnInit() {
     this.getTradingCountofUser();
    window.scrollTo(0, 0);
  }

  getTradingCountofUser(){

    this.dashBoardService.getUserTradingCount().subscribe(successData => {
    this.totalNumberOfTrading = successData.data.totalNumberOfTrading;
    this.totalNumberOfBuy=successData.data.totalNumberOfBuy;
    this.totalNumberOfSell=successData.data.totalNumberOfSell;

    },errorData => {

    })
  }


}
