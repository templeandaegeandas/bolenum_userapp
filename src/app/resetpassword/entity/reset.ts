export class ResetPassword {

  newPassword: String;
  confirmPassword: String;

  constructor(newPassword: String, confirmPassword: String){
      this.newPassword = newPassword;
      this.confirmPassword = confirmPassword;

  }
}
