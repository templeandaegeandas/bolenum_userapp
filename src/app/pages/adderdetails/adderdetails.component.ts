import { Component } from '@angular/core';
import { NgUploaderOptions } from 'ngx-uploader';


@Component({
  selector: 'adderdetails',
  styleUrls: ['./adderdetails.scss'],
  templateUrl: './adderdetails.html',
})
export class Adderdetails {
  
constructor() {}
   public defaultPicture = 'assets/img/theme/no-photo.png';
   public profile:any = {
   picture: 'assets/img/app/profile/Nasta.png',
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
