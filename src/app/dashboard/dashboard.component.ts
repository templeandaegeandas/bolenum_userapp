import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    options :any;
  constructor( private router: Router) {
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
    colors: ["#e42d2d","#3ad1e4"]

        };


   }

  ngOnInit() {
    this.isLoggedIn();
  }

  isLoggedIn() {
    if(localStorage.getItem("token")==null) {
      this.router.navigate(['login']);
    }
  }

}
