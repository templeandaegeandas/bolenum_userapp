import { Component } from '@angular/core';
import { NgUploaderOptions } from 'ngx-uploader';


@Component({
  selector: 'adderDetails',
  styleUrls: ['./adderDetails.scss'],
  templateUrl: './adderDetails.html',
})
export class AdderDetails {
  
constructor() {}
   public defaultPicture = 'assets/img/theme/no-photo.png';
   public profile: any = {
   picture: 'assets/img/app/profile/Nasta.png',
  };
  public uploaderOptions: NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };

  public fileUploaderOptions: NgUploaderOptions = {
    // url: 'http://website.com/upload'
    url: '',
  };
}
