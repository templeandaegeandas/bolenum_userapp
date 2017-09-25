import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tradeNow',
  templateUrl: './tradeNow.component.html',
  styleUrls: ['./tradeNow.component.css']
})
export class TradeNowComponent implements OnInit {
    public beforeLogin:boolean=true;
    public afterLogin:boolean=false;
  options :any;
  constructor() {
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
      this.isLogIn();
  }

  isLogIn(){

      if(localStorage.getItem("token")==null) {
      return;
    }
    else{
        this.beforeLogin = false;
        this.afterLogin = true;

    }

  }




}
