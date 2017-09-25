export class Login {
  emailId: String;
  password: String;
  ipAddress: String;
  browserName: String;
  clientOsName: String;
  role: String;
  constructor(emailId: String, password: String) {
    this.emailId = emailId;
    this.password = password;
  }

  setIpAddress(ipAddress: String) {
    this.ipAddress = ipAddress;
  }
  setBrowserName(browserName: String) {
    this.browserName = browserName;
  }
  setClientOsName(clientOsName: String) {
    this.clientOsName = clientOsName;
  }
  setRole(role: String) {
    this.role = role;
  }
}
