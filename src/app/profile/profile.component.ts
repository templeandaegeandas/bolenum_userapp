import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  loading = false;
  document: String = "assets/images/id.png?decache=" + Math.random();
  documentStatus: String = "NOT SUBMITTED";
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.getLoggedInUserDetails();
  }

  uploadKyc() {
    this.loading = true;
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("file", fileBrowser.files[0]);
      this.profileService.upload(formData).subscribe(success => {
        if (success.data.userKyc != null) {
          this.document = "http://localhost:3050/static/" + success.data.userKyc.document + "?decache=" + Math.random();
          this.documentStatus = success.data.userKyc.documentStatus;
        }
        this.ngOnInit();
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;
      });
    }
  }

  getLoggedInUserDetails() {
    this.profileService.getUserDetails().subscribe(success => {
      if (success.data.userKyc != null) {
        this.document = "http://localhost:3050/static/" + success.data.userKyc.document + "?decache=" + Math.random();
        this.documentStatus = success.data.userKyc.documentStatus;
      }
    }, error => {
      console.log(error);
    })
  }

}
