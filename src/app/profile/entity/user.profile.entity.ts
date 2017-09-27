export class UserProfile {
  firstName: String;
  middleName: String;
  lastName: String;
  profileImage:String
  country: String;
  city: String;
  state: String;
  mobileNumber: any;;
  gender: String;
  address: String;
  dob: any;


  constructor() {

  }

  setCountry(country: String) {
    this.country = country;
  }

  setState(state: String) {
    this.state = state;
  }

  setDob(dob: any){
    this.dob = dob;
  }
}
