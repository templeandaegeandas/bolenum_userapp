export class BankDetails {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    address: string;
    branch: string;
    city: string;
    district: string
    setBankName(bankName: string) {
        this.bankName = bankName;
    }
    setAddress(address: string) {
        this.address = address;
    }
    setBranch(branch: string) {
        this.branch = branch;
    }
    setCity(city: string) {
        this.city = city;
    }
    setDistrict(district: string) {
        this.district = district;
    }
}
