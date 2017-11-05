import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import { UserProfile } from './entity/user.profile.entity';
import { BankDetails } from './entity/bankDetails.profile.entity';
import { ProfileService } from './profile.service';
import { IMyDpOptions } from 'mydatepicker';
import { environment } from '../../environments/environment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { Subscription } from 'rxjs/Subscription';
import { AppEventEmiterService } from '../app.event.emmiter.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
  sub: Subscription;
  public isOff:boolean = false;
  public isOn:boolean = true;
  public nationalIds: string;
  public documentType: string;
  public varificationName: string = "Enter Mobile Number";
  public userFirstName: string;
  public userLastName: string;
  public isCustomerView: boolean = true;
  public shortIfo: boolean = false;
  public getOurBankDetails: any;
  public bankCustomerDetails: any;
  public saveButton: boolean = false;
  public addNewButton: boolean = false;
  public accounDetails: boolean = false;
  @ViewChild('fileInput') fileInput;
  @ViewChild('fileInputAddress') fileInputAddress;
  @ViewChild('profileImage') profileImage;
  @ViewChild('addPopup') public addPopup: ModalDirective;
  @ViewChild('profilePicCropper') public profilePicCropper: ModalDirective;
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  loading = false;
  document: String = "assets/images/id.png";
  addressProof: String = "assets/images/id.png";
  url: any = {
    result: String
  };
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
  nationalIdPdf: Boolean = false;
  addressPdf: Boolean = false;
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
  kycDocument: any = [];
  nationalIdStatus: String = "NOT SUBMITTED";
  addressIdStatus: String = "NOT SUBMITTED";
  nationalIdKyc: any = "assets/images/id.png";
  addressIdKyc: any = "assets/images/id.png";
  nId: any;
  rId: any
  constructor(private profileService: ProfileService, private toastrService: ToastrService, private router: Router, private appEventEmiterService: AppEventEmiterService) {
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

  getKycDetailsUser() {
    this.profileService.getKycDetailUsers().subscribe(success => {
      this.kycDocument = success.data;
      if (this.kycDocument.length > 0) {
        if (this.kycDocument[0].documentType == "RESIDENCE_PROOF") {
          let dot1 = success.data[0].document.lastIndexOf(".")
          let extension1 = (dot1 == -1) ? "" : success.data[0].document.substring(dot1 + 1);
          let dot2 = success.data[1].document.lastIndexOf(".")
          let extension2 = (dot2 == -1) ? "" : success.data[1].document.substring(dot2 + 1);
          if (extension1 == "pdf") {
            this.addressPdf = true;
          }
          if (extension2 == "pdf") {
            this.nationalIdPdf = true;
          }
          this.addressIdKyc = environment.documentUrl + this.kycDocument[0].document;
          this.nationalIdKyc = environment.documentUrl + this.kycDocument[1].document;
          this.addressIdStatus = this.kycDocument[0].documentStatus;
          this.nationalIdStatus = this.kycDocument[1].documentStatus;
        }
        else {
          let dot1 = success.data[0].document.lastIndexOf(".")
          let extension1 = (dot1 == -1) ? "" : success.data[0].document.substring(dot1 + 1);
          let dot2 = success.data[1].document.lastIndexOf(".")
          let extension2 = (dot2 == -1) ? "" : success.data[1].document.substring(dot2 + 1);
          if (extension1 == "pdf") {
            this.nationalIdPdf = true;
          }
          if (extension2 == "pdf") {
            this.addressPdf = true;
          }
          this.addressIdKyc = environment.documentUrl + this.kycDocument[1].document + "?decache=" + Math.random();
          this.nationalIdKyc = environment.documentUrl + this.kycDocument[0].document + "?decache=" + Math.random();
          this.addressIdStatus = this.kycDocument[1].documentStatus;
          this.nationalIdStatus = this.kycDocument[0].documentStatus;
        }
      }

    }, error => {

    });
  }

  addPopupClose() {
    this.ngOnInit();
    this.isMobileEdit = false;
    this.isOtpEdit = false;
    this.twoFactorAuthType = 'NONE';
    this.varificationName = "";
    this.addPopup.hide();
  }

  chenge2Fa(event) {
    this.isOn = false;
    this.isOff = true;
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

  backAuth() {

    this.isMobileEdit = false;
    this.twoFactorAuthType = 'NONE';
    this.varificationName = "Enter Mobile Number";

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
    let d = new Date(this.userProfile.dob);
    if(this.userProfile.dob!=null) {
      this.dob = { date: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() } };
    }
  }


  editMobile() {
    this.isMobileEdit = true;
    this.isOtpEdit = false;
    this.resendOtp = false;
  }

  saveMobile(form) {
    this.varificationName = "Enter OTP"
    if (form.invalid) return;
    if (this.countryCode==null) {
      this.toastrService.error("Please choose country and fill profile first!", "Error!");
      return;
    }
    this.profileService.addMobileNumber(this.mobileNumber, this.countryCode).subscribe(success => {
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



    this.userProfile.dob = new Date(this.dob.jsdate).getTime();
    this.userProfile.country = this.country;
    this.userProfile.state = this.state;

    if (this.userProfile.lastName == "") {

      this.userProfile.lastName = this.userLastName = null;

    }



    this.profileService.saveUserDetails(this.userProfile).subscribe(success => {
      this.userFirstName = success.data.firstName;
      this.userLastName = success.data.lastName;
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
        this.nationalIdPdf = false;
        var reader = new FileReader();
        reader.onload = (event) => {
          this.url = event.target;
          this.nationalIdKyc = this.url.result;
        }
        reader.readAsDataURL(event.target.files[0]);
      }
      else if (extension == "pdf") {
        this.nationalIdPdf = true;
      }
      else {
        this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!')
        return;
      }
    }
  }

  uploadKyc() {
    this.loading = true;
    let fileBrowserNationalId = this.fileInput.nativeElement;
    let fileBrowserAddressProof = this.fileInputAddress.nativeElement;
    if (this.kycDocument.length > 0) {
      if ((fileBrowserNationalId.files && fileBrowserNationalId.files[0]) && (fileBrowserAddressProof.files && fileBrowserAddressProof.files[0])) {
        let nationalId = fileBrowserNationalId.files[0].name;
        let residenceProof = fileBrowserAddressProof.files[0].name;
        if (!this.validateExtension(nationalId)) {
          this.loading = false;
          this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!');
          fileBrowserNationalId.value = "";
          return;
        }
        if (!this.validateExtension(residenceProof)) {
          this.loading = false;
          this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!');
          fileBrowserNationalId.value = "";
          return;
        }
        this.uploadFile(fileBrowserNationalId.files[0], "NATIONAL_ID");
        this.uploadFile(fileBrowserAddressProof.files[0], "RESIDENCE_PROOF");
        fileBrowserNationalId.value = "";
        fileBrowserAddressProof.value = "";
        // this.getKycDetailsUser();
      }
      else if ((fileBrowserNationalId.files && fileBrowserNationalId.files[0])) {
        let fileName = fileBrowserNationalId.files[0].name;
        if (!this.validateExtension(fileName)) {
          this.loading = false;
          this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!');
          fileBrowserNationalId.value = "";
          return;
        }
        this.uploadFile(fileBrowserNationalId.files[0], "NATIONAL_ID");
        fileBrowserNationalId.value = "";
        fileBrowserAddressProof.value = "";
        // this.getKycDetailsUser();
      }
      else if ((fileBrowserAddressProof.files && fileBrowserAddressProof.files[0])) {
        let fileName = fileBrowserAddressProof.files[0].name;
        if (!this.validateExtension(fileName)) {
          this.loading = false;
          this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!');
          fileBrowserAddressProof.value = "";
          return;
        }
        this.uploadFile(fileBrowserAddressProof.files[0], "RESIDENCE_PROOF");
        fileBrowserNationalId.value = "";
        fileBrowserAddressProof.value = "";
        // this.getKycDetailsUser();
      }
      else {
        this.toastrService.error("Please choose a national id or address proof", 'Error!');
        this.loading = false;
        return;
      }

    }
    else {

      if (fileBrowserNationalId.files && fileBrowserNationalId.files[0]) {
        let fileName = fileBrowserNationalId.files[0].name;
        if (!this.validateExtension(fileName)) {
          this.loading = false;
          this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!');
          fileBrowserNationalId.value = "";
          return;
        }
      }
      else {
        this.toastrService.error("Please choose national id for uploading!", 'Error!')
        this.loading = false;
        return;
      }

      if (fileBrowserAddressProof.files && fileBrowserAddressProof.files[0]) {
        let fileName = fileBrowserAddressProof.files[0].name;
        if (!this.validateExtension(fileName)) {
          this.loading = false;
          this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!');
          fileBrowserAddressProof.value = "";
          return;
        }

      }
      else {
        this.toastrService.error("Please choose address proof for uploading!", 'Error!');
        this.loading = false;
        return;
      }
      this.uploadFile(fileBrowserNationalId.files[0], "NATIONAL_ID");
      this.uploadFile(fileBrowserAddressProof.files[0], "RESIDENCE_PROOF");
      fileBrowserNationalId.value = "";
      fileBrowserAddressProof.value = "";
      // this.getKycDetailsUser();
    }
  }

  validateExtension(fileName) {
    let dot = fileName.lastIndexOf(".")
    let extension = (dot == -1) ? "" : fileName.substring(dot + 1);
    if (extension != "png" && extension != "jpeg" && extension != "jpg" && extension != "pdf") {
      return false;
    }
    else {
      return true;
    }
  }

  uploadFile(file, documentType) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);
    this.profileService.upload(formData).subscribe(success => {
      this.getKycDetailsUser();
      this.loading = false;
      this.toastrService.success(success.message, 'Success!')
    }, error => {
      this.toastrService.error(error.json().message, 'Error!')
      this.loading = false;
    })
  }


  // for uploading address proof

  readUrlAddress(event) {
    if (event.target.files && event.target.files[0]) {
      let fileName = event.target.files[0].name;
      let dot = fileName.lastIndexOf(".")
      let extension = (dot == -1) ? "" : fileName.substring(dot + 1);
      if (extension == "png" || extension == "jpeg" || extension == "jpg") {
        this.addressPdf = false;
        var reader = new FileReader();
        reader.onload = (event) => {
          this.url = event.target;
          this.addressIdKyc = this.url.result;
        }
        reader.readAsDataURL(event.target.files[0]);
      }
      else if (extension == "pdf") {
        this.addressPdf = true;
      }
      else {
        this.toastrService.error("Please choose a valid file (image/pdf)", 'Error!')
        return;
      }
    }
  }

  getLoggedInUserDetails() {
    this.profileService.getUserDetails().subscribe(success => {
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
      this.userFirstName = success.data.firstName;
      this.userLastName = success.data.lastName;
      this.userProfile = success.data;
      this.emailId = success.data.emailId;
      if (success.data.dob != null) {
        this.userProfile.dob = success.data.dob;
      }
      if (success.data.country != null) {
        this.getAllCountries();
        this.country = success.data.country;
        this.state = success.data.state;
        setTimeout(() => {
          this.getStatesByCountryId(this.country);
        }, 1500);
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
      this.ngOnInit();
      this.profilePicCropper.hide();
      this.appEventEmiterService.changeMessage("upload");
      this.loading = false;
    }, error => {
      console.log(error);
      this.loading = false;
    });
  }

  addNew() {
    this.isCustomerView = false;
    this.accounDetails = true;
    this.saveButton = true;
    this.addNewButton = false;

  }
  locate(data) {
    this.profileService.locate(data).subscribe(success => {
      this.bankCustomerDetails = success;
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
    if (customerDetaisForm.invalid) return;

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
      customerDetaisForm.resetForm();
      this.getUserBankDetails();
      this.bankDetails.accountHolderName = '';
      this.bankDetails.bankName = '';
      this.bankDetails.accountNumber = '';
      this.bankDetails.ifscCode = '';

    }, errorData => {
    })
  }

  getUserBankDetails() {
    this.profileService.getUserBankDetails().subscribe(successData => {
      this.getOurBankDetails = successData.data;
      let customerDta = this.getOurBankDetails;
      if (customerDta.length === 2) {
        this.addNewButton = false;
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
    dateFormat: 'yyyy/mm/dd',
    width: '200px',
    editableDateField: false,
  }
}
