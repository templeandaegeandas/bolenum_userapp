export class User {
  emailId: String;
  firstName: String;
  lastName: String;
  password: String;
  repassword: String;
  termConditions: Boolean;
  constructor(emailId: String, firstName: String, lastName: String, password: String, repassword: String, termConditions: Boolean) {
    this.emailId = emailId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.repassword = repassword;
    this.termConditions = termConditions;
  }
  setLastName(lastName: String) {
    this.lastName = lastName;
  }
}
