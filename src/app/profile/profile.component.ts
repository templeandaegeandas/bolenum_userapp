import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'toastr-ng2';
import { UserProfile } from './entity/user.profile.entity';
import { BankDetails } from './entity/bankDetails.profile.entity';
import { ProfileService } from './profile.service';
import { IMyDpOptions } from 'mydatepicker';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})
export class ProfileComponent implements OnInit {
  public shortIfo: boolean = false;

  public getOurBankDetails: any;
  // public isverifyed:boolean = false;
  // public isBankFound:boolean = false;


  public bankCustomerDetails: any;

  public saveButton: boolean = false;
  public addNewButton: boolean = true;
  public accounDetails: boolean = false;
  @ViewChild('fileInput') fileInput;
  @ViewChild('profileImage') profileImage;
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
  constructor(private profileService: ProfileService, private toastrService: ToastrService) { }

  ngOnInit() {
    console.log(environment)
    this.getLoggedInUserDetails();
    this.getAllCountries();
    // this.locate();
  }

  chenge2Fa(event) {

  }

  editDetails() {
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
      let fileExtension = event.target.files[0].type;
      if (fileExtension == "image/png" || fileExtension == "image/jpeg") {
        this.pdf = false;
        var reader = new FileReader();
        reader.onload = (event) => {
          this.url = event.target;
          this.document = this.url.result;
        }
        reader.readAsDataURL(event.target.files[0]);
      }
      else if (fileExtension == "application/pdf") {
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
      let fileExtension = fileBrowser.files[0].type;
      if (fileExtension == "image/png" || fileExtension == "image/jpeg" || fileExtension == "application/pdf") {
        console.log("123456")
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
      this.mobileNumber = success.data.mobileNumber;
      this.userProfile = success.data;
      this.emailId = success.data.emailId;
      this.userKyc = success.data.userKyc;
      if (success.data.country != null) {
        this.getAllCountries();
        this.country = success.data.country;
        this.state = success.data.state;
        setTimeout(() => {
          this.getStatesByCountryId(this.country);
        }, 1000);
      }

      if (success.data.profileImage != null) {
        this.profilePic = environment.profilePicUrl + success.data.profileImage + "?decache=" + Math.random();
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
  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'yyyy/mmm/dd',
    width: '200px',
    editableDateField: false,
    // disableSince: {year: new Date().getFullYear(), month: new Date().getMonth()+2, day: new Date().getDay()}

  };

  // Initialized to specific date (09.10.2018).
  // public model: any = new Date();


  addNew() {
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
    this.profileService.customerBankData(this.bankDetails).subscribe(successData => {
      this.accounDetails = false;

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
         this.addNewButton = true;
        console.log("array data", customerDta.length);
        return;
      }
      // else {
      //   this.addNewButton = true;
      // }


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

  onChange(event) {
   let files = event.srcElement.files;
   if(files.length>0) {
   let fileBrowser = this.profileImage.nativeElement;
    const formData = new FormData();
      formData.append("file", fileBrowser.files[0]);
      this.profileService.uploadProfileImage(formData).subscribe(success => {
        console.log(success);
        this.ngOnInit();
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;
      });
    }
    
   }
}
