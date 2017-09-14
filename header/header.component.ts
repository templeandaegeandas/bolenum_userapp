import {Component,NgZone } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private showDropdown = false;
  constructor(private ngZone:NgZone){
   window.onresize = (e) =>
    {
        ngZone.run(() => {
         this.isOnmobile();
        });
    };
    this.isOnmobile();
  }
  private togglemenu = false;
  
  isOnmobile()
  {
     if(window.innerWidth > 767)
          {
            this.togglemenu = true;
          }
          else
          {
            this.togglemenu = false;
          }
  }
  
}
