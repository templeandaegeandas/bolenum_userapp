import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import { UserProfile } from './entity/user.profile.entity';
import { BankDetails } from './entity/bankDetails.profile.entity';
import { ProfileService } from './profile.service';
import { IMyDpOptions } from 'mydatepicker';
import { environment } from '../../environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
  public isCustomerView: boolean = true;
  public shortIfo: boolean = false;
  public getOurBankDetails: any;
  public bankCustomerDetails: any;
  public saveButton: boolean = false;
  public addNewButton: boolean = false;
  public accounDetails: boolean = false;
  @ViewChild('fileInput') fileInput;
  @ViewChild('profileImage') profileImage;
  @ViewChild('addPopup') public addPopup: ModalDirective;
  @ViewChild('profilePicCropper') public profilePicCropper: ModalDirective;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  loading = false;
  document: String = "assets/images/id.png?decache=" + Math.random();
  url: any = {
    result: String
  };
  documentStatus: String = "NOT SUBMITTED";
  userProfile = new UserProfile();
  bankDetails = new BankDetails();
  userKyc: any;
  isDetailsEdit: Boolean = false;
  isMobileEdit: Boolean = false;
  isOtpEdit: Boolean = false;
  resendOtp: Boolean = false;
  emailId: String;
  profilePic: String = "assets/images/default_pic.png";
  mobileNumber: any;
  otp: any;
  pdf: Boolean = false;
  countries: any;
  states: any;
  state: String = "Choose State";
  country: String = "Choose Country";
  dob: any;
  countryError = false;
  stateError = false;
  countryCode: any;
  twoFa: any;
  lgModal: any;
  twoFactorAuthType: String = 'NONE';
  qrCodeFileName: String;
  secret: any;
  isMobileVerified: any;
  data: any;
  cropperSettings: CropperSettings;
  croppedWidth: number;
  croppedHeight: number;
  constructor(private profileService: ProfileService, private toastrService: ToastrService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 200;
    this.cropperSettings.height = 200;
    this.cropperSettings.noFileInput = true;

    this.cropperSettings.croppedWidth = 200;
    this.cropperSettings.croppedHeight = 200;

    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 300;

    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;

    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = false;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

    this.data = {};
  }
  ngOnInit() {
    this.getLoggedInUserDetails();
  }

  addPopupClose() {
    this.ngOnInit();
    this.isMobileEdit = false;
    this.isOtpEdit = false;
    this.twoFactorAuthType = 'NONE';
    this.addPopup.hide();
  }

  chenge2Fa(event) {
    if (event) {
      this.addPopup.show();
      if (this.qrCodeFileName == null) {
        this.profileService.generate2faQrCode().subscribe(success => {
          this.qrCodeFileName = environment.googleQrCodeUrl + success.data.fileName;
        }, error => {
          console.log(error)
        })
      }
    }
    else {
      this.profileService.remove2Fa().subscribe(success => {
        this.toastrService.success(success.message, "Success!");
      })
    }
  }

  openTwoFaVerification(data) {
    this.twoFactorAuthType = data;
    if (data == 'MOBILE' && !this.isMobileVerified) this.isMobileEdit = true;
  }

  set2faToMobile() {
    this.profileService.set2faToMobile().subscribe(success => {
      this.addPopup.hide();
      this.twoFactorAuthType = 'NONE';
      this.toastrService.success("Two way authentication has been set to Mobile", "Success!");
    }, error => {
      this.toastrService.error(error.json().message, "Error!")
    })
  }

  verifySecret(form) {
    if (form.invalid) return;
    this.profileService.verify2faGoogleAuthKey(this.secret).subscribe(success => {
      this.addPopup.hide();
      this.twoFactorAuthType = 'NONE';
      this.toastrService.success("Two way authentication has been set to Google authenticator", "Success!");
    }, error => {
      this.toastrService.error(error.json().message, "Error!")
    })
  }

  editDetails() {
    this.getAllCountries();
    this.isDetailsEdit = true;
  }

  editMobile() {
    this.isMobileEdit = true;
    this.isOtpEdit = false;
    this.resendOtp = false;
  }

  saveMobile(form) {
    if (form.invalid) return;
    this.profileService.addMobileNumber(this.mobileNumber).subscribe(success => {
      this.isMobileEdit = false;
      this.isOtpEdit = true;
      this.resendOtp = true;
    }, error => {
      this.toastrService.error(error.json().message, "Error!");
    })
  }

  verifyOtp(form) {
    if (form.invalid) return;
    this.profileService.verifyOtp(this.otp).subscribe(success => {
      this.toastrService.success(success.message, "Success!");
      this.isOtpEdit = false;
      this.resendOtp = false;
      this.isMobileVerified = true;
    }, error => {
      this.toastrService.error(error.json().message, "Error!");
    })
  }

  reSendOtp() {
    this.profileService.resendOtp().subscribe(success => {
      this.toastrService.success(success.message, "Success!");
    }, error => {
      console.log(error)
      this.toastrService.error(error.json().message, "Error!");
    })
  }

  saveDetails(form) {
    if (form.invalid) return;
    if (this.country == "Choose Country") {
      this.countryError = true;
      return;
    }
    if (this.state == "Choose State") {
      this.stateError = true;
      return;
    }
    this.userProfile.dob = this.dob.epoc;
    this.userProfile.country = this.country;
    this.userProfile.state = this.state;

    this.profileService.saveUserDetails(this.userProfile).subscribe(success => {
      this.ngOnInit();
      this.isDetailsEdit = false;
    }, error => {
      this.toastrService.error(error.message, "Error!")
    })
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      let fileName = event.target.files[0].name;
      let dot = fileName.lastIndexOf(".")
      let extension = (dot == -1) ? "" : fileName.substring(dot + 1);
      if (extension == "png" || extension == "jpeg" || extension == "jpg") {
        this.pdf = false;
        var reader = new FileReader();
        reader.onload = (event) => {
          this.url = event.target;
          this.document = this.url.result;
        }
        reader.readAsDataURL(event.target.files[0]);
      }
      else if (extension == "pdf") {
        this.pdf = true;
      }
      else {
        this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!')
        return;
      }
    }
  }

  uploadKyc() {
    this.loading = true;
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let fileName = fileBrowser.files[0].name;
      let dot = fileName.lastIndexOf(".")
      let extension = (dot == -1) ? "" : fileName.substring(dot + 1);
      if (extension == "png" || extension == "jpeg" || extension == "jpg" || extension == "pdf") {
        const formData = new FormData();
        formData.append("file", fileBrowser.files[0]);
        this.profileService.upload(formData).subscribe(success => {
          if (success.data.userKyc != null) {
            this.document = environment.documentUrl + success.data.userKyc.document + "?decache=" + Math.random();
            this.documentStatus = success.data.userKyc.documentStatus;
          }
          this.ngOnInit();
          fileBrowser.value = "";
          this.loading = false;
        }, error => {
          this.toastrService.error(error.json().message, 'Error!')
          fileBrowser.value = "";
          this.loading = false;
        });
      }
      else {
        this.loading = false;
        this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!');
        fileBrowser.value = "";
        return;
      }
    }
    else {
      this.toastrService.error("Please choose file for uploading!", 'Error!')
      this.loading = false;
    }
  }

  getLoggedInUserDetails() {
    this.profileService.getUserDetails().subscribe(success => {
      if (success.data.userKyc != null) {
        this.document = environment.documentUrl + success.data.userKyc.document + "?decache=" + Math.random();
        this.documentStatus = success.data.userKyc.documentStatus;
      }
      localStorage.setItem("fName", success.data.firstName);
      if (success.data.lastName != null) {
        localStorage.setItem("lName", success.data.lastName);
      }
      if (success.data.google2FaAuthKey != null) {
        this.qrCodeFileName = environment.googleQrCodeUrl + success.data.userId + ".png";
      }
      if (success.data.twoFactorAuthOption != null && success.data.twoFactorAuthOption != 'NONE') {
        this.twoFa = true;
      } else {
        this.twoFa = false;
      }
      this.mobileNumber = success.data.mobileNumber;
      this.isMobileVerified = success.data.isMobileVerified;
      this.userProfile = success.data;
      this.emailId = success.data.emailId;
      this.userKyc = success.data.userKyc;
      if (success.data.country != null) {
        this.getAllCountries();
        this.country = success.data.country;
        this.state = success.data.state;
        setTimeout(() => {
          this.getStatesByCountryId(this.country);
        }, 500);
      }

      if (success.data.profileImage != null) {
        localStorage.setItem("profilePic", success.data.profileImage + "?decache=" + Math.random());
        this.profilePic = environment.profilePicUrl + success.data.profileImage + "?decache=" + Math.random();
      }
    }, error => {
      console.log(error);
    })
  }

  onChange(event) {
    if (event.target.files && event.target.files[0]) {
      var image: any = new Image();
      var file: File = event.target.files[0];
      let fileName = event.target.files[0].name;
      let dot = fileName.lastIndexOf(".")
      let extension = (dot == -1) ? "" : fileName.substring(dot + 1);
      if (extension != "png" && extension != "jpeg" && extension != "jpg") {
        this.toastrService.error("Please choose a valid image with extension jpg, jpeg, png!", "Error!");
        return;
      }
      this.profilePicCropper.show();
      var myReader: FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function(loadEvent: any) {
        image.src = loadEvent.target.result;
        that.cropper.setImage(image);

      };
      myReader.readAsDataURL(file);
    }
  }

  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
  }

  uploadProfilePic() {
    this.loading = true;
    if (this.data.image == null) {
      this.toastrService.error("Please choose a valid file!", "Error!")
      return;
    }
    const formData = new FormData();
    formData.append("profilePic", this.data.image);
    this.profileService.uploadProfileImage(formData).subscribe(success => {
      console.log(success);
      this.ngOnInit();
      this.profilePicCropper.hide();
      this.loading = false;
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }

  addNew() {
    this.isCustomerView = false;
    console.log(".........................")
    this.accounDetails = true;
    this.saveButton = true;
    this.addNewButton = false;
  }
  locate(data) {
    console.log("ifsc code >>>", data);
    this.profileService.locate(data).subscribe(success => {
      this.bankCustomerDetails = success;
      console.log("data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>", this.bankCustomerDetails);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", success);
      this.bankDetails.setBankName(success.data.BANK);
      this.bankDetails.setAddress(success.data.ADDRESS);
      this.bankDetails.setBranch(success.data.BRANCH);
      this.bankDetails.setCity(success.data.CITY);
      this.bankDetails.setDistrict(success.data.DISTRICT);
      this.shortIfo = !this.shortIfo;
    }, errorData => {
    })
  }

  customerDetails(customerDetaisForm) {
    this.isCustomerView = true;
    this.accounDetails = false;
    if (this.getOurBankDetails.length === 2) {
      this.addNewButton = false;
      return;
    }
    else {
      this.addNewButton = true;
    }
    this.profileService.customerBankData(this.bankDetails).subscribe(successData => {
      this.getUserBankDetails();
    }, errorData => {
    })
    console.log("customer details >>>>>>>>>>>>>>>>>>>>>>>>  ", this.bankDetails);
  }

  getUserBankDetails() {
    this.profileService.getUserBankDetails().subscribe(successData => {
      console.log("data>>>>>>>>>>>>>>>>>>>>>>>>", successData);
      this.getOurBankDetails = successData.data;
      console.log("customerDetails >>>>>>>>>>>", this.getOurBankDetails);
      let customerDta = this.getOurBankDetails;
      if (customerDta.length === 2) {
        this.addNewButton = false;
        console.log("array data", customerDta.length);
        return;
      }
      else {
        this.addNewButton = true;
        this.accounDetails = false;
        this.isCustomerView = true;
      }
    }, errorData => {

    })

  }

  getAllCountries() {
    this.profileService.getAllCountries().subscribe(success => {
      this.countries = success.data;
    }, error => {
      console.log(error)
    })
  }

  getStatesByCountryId(countryName) {
    this.countryError = false;
    let c = this.countries.find(x => x.name == countryName);
    this.countryCode = c.phoneCode;
    this.profileService.getStatesByCountryId(c.countryId).subscribe(success => {
      this.states = success.data;
    }, error => {
      console.log(error);
    })
  }

  changeState(event) {
    this.stateError = false;
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'yyyy/mmm/dd',
    width: '200px',
    editableDateField: false,
  }
}
