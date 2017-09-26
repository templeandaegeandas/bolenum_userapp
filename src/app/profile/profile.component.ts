import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import { UserProfile } from './entity/user.profile.entity';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileInput') fileInput;
  @ViewChild('profileImage') profileImage;
  loading = false;
  document: String = "assets/images/id.png?decache=" + Math.random();
  url: any = {
    result: String
  };
  documentStatus: String = "NOT SUBMITTED";
  userProfile = new UserProfile();
  userKyc: any;
  isDetailsEdit: Boolean = false;
  isMobileEdit: Boolean =false;
  emailId: String;
  profilePic:String="assets/images/default_pic.png";
  constructor(private profileService: ProfileService, private toastrService: ToastrService) { }

  ngOnInit() {
    this.getLoggedInUserDetails();
  }

  editDetails() {
    this.isDetailsEdit = true;
  }

  editMobile() {
    this.isMobileEdit = true;
  }

  saveMobile() {
    this.isMobileEdit = false;
  }

  saveDetails() {
    this.profileService.saveUserDetails(this.userProfile).subscribe(success => {
      this.ngOnInit();
      this.isDetailsEdit = false;
    }, error => {
      this.toastrService.error(error.message,"Error!")
    })

  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event) => {
        this.url = event.target;
        this.document = this.url.result;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadKyc() {
    this.loading = true;
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("file", fileBrowser.files[0]);
      this.profileService.upload(formData).subscribe(success => {
        if (success.data.userKyc != null) {
          this.document = "http://localhost:3050/static/documents/" + success.data.userKyc.document + "?decache=" + Math.random();
          this.documentStatus = success.data.userKyc.documentStatus;
        }
        this.ngOnInit();
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;
      });
    }
    else {
      this.toastrService.error("Please choose file for uploading!", 'Error!')
      this.loading = false;
    }
  }

  getLoggedInUserDetails() {
    this.profileService.getUserDetails().subscribe(success => {
      if (success.data.userKyc != null) {
        this.document = "http://localhost:3050/static/documents/" + success.data.userKyc.document + "?decache=" + Math.random();
        this.documentStatus = success.data.userKyc.documentStatus;
      }
      this.userProfile = success.data;
      this.emailId = success.data.emailId;
      this.userKyc = success.data.userKyc;
      if(success.data.profileImage!=null) {
        this.profilePic = "http://localhost:3050/static/profile-images/" + success.data.profileImage + "?decache=" + Math.random();
      }
    }, error => {
      console.log(error);
    })
  }


  uploadProfilePic() {
    this.loading = true;
    let fileBrowser = this.profileImage.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("file", fileBrowser.files[0]);
      this.profileService.uploadProfileImage(formData).subscribe(success => {
        console.log(success);
        /*if (success.data.userKyc != null) {
          this.document = "http://localhost:3050/static/" + success.data.userKyc.document + "?decache=" + Math.random();

        }*/
        this.ngOnInit();
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;
      });
    }
    else {
      this.toastrService.error("Please choose file for uploading!", 'Error!')
      this.loading = false;
    }
  }


}
