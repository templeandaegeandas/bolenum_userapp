import { Component } from '@angular/core';
import { NgUploaderOptions } from 'ngx-uploader';


@Component({
  selector: 'orderDetails',
  styleUrls: ['./orderDetails.scss'],
  templateUrl: './orderDetails.html'
})
export class OrderDetails {
  
constructor() {}
   public defaultPicture = 'assets/img/theme/no-photo.png';
   public profile:any = {
    picture: 'assets/img/app/profile/Nasta.png'
  };
  public uploaderOptions:NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };

  public fileUploaderOptions:NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };
}
