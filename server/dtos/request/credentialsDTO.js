const FileDocument = require('../../models').FileDocument;

exports.RegisterRequestDTO = class RegisterRequestDTO {
    constructor(arg) {
        this.facebookId = arg.facebookId;
        this.role = arg.role;
        this.name = arg.name;
        this.phone = arg.phone;
        this.dni = arg.dni;
        this.brand = arg.brand;
        this.model = arg.model;
        this.licensePlate = arg.licensePlate;
        this.color = arg.color;
        this.files = [];
        if (arg.files != null && arg.files != undefined) {
            arg.files.forEach(file => {
                var aFileDocument = new FileDocument();
                aFileDocument.name = file.name;
                aFileDocument.data = file.data;
                this.files.push(aFileDocument);
            });
        }
        /*
        this.photeProfile = arg.phoneProfile;
        this.photoCar = arg.photoCar;
        this.photoInsurance = arg.photoInsurance;
        this.photoLicense = arg.photoLicense;
        */
    }
}
