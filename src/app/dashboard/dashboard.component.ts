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
  constructor( private router: Router,private dashBoardService:DashBoardService) {
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
  }

  getTradingCountofUser(){

    this.dashBoardService.getUserTradingCount().subscribe(successData => {
    this.tradingCountData = successData.data;
     console.log("successData.data >>>>>>>>"+successData.data);
    },errorData => {

    })
  }


}
