import { Component, OnInit } from '@angular/core';
import { FeesService } from './fees-details.service';

@Component({
  selector: 'app-fees-details',
  templateUrl: './fees-details.component.html',
  styleUrls: ['./fees-details.component.css'],
  providers: [FeesService]
})
export class FeesDetailsComponent implements OnInit {
  public currencyId: any;
  public withdrawFee: any;

  constructor(private feesService: FeesService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
   
   
  }


 


}
