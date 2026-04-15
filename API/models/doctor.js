const Model = require('./model').Model;
const Slot = require('./slot');

// CREATE TABLE doctors (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     full_name VARCHAR(255) NOT NULL,
//     description TEXT NOT NULL,
//     doctor_picture VARCHAR(255)
// );

class Doctor extends Model {
    constructor(full_name = '', description = '', doctor_picture = '') {
        super();
        this.id = 0;
        this.full_name = full_name;
        this.description = description;
        this.doctor_picture = doctor_picture;
    }

    static async findAll() {
        let results = await super.findAll('doctors');
        let doctors = [];
        for (let i = 0; i < results.length; i++) {
            let doctor = new Doctor();
            doctor.id = results[i].id;
            doctor.full_name = results[i].full_name;
            doctor.description = results[i].description;
            doctor.doctor_picture = results[i].doctor_picture;
            doctors.push(doctor);
        }
        return doctors;
    }

    static async findById(id) {
        let results = await super.find(id, 'doctors');
        let doctor = new Doctor();
        if(results[0]){
            doctor.id = results[0].id;
            doctor.full_name = results[0].full_name;
            doctor.description = results[0].description;
            doctor.doctor_picture = results[0].doctor_picture;
        }
        return doctor;
    }

    static async save(doctor) {
        await super.save(doctor, 'doctors');
        return await this.findById(doctor.id);
    }

    static async deleteById(id) {
        await Slot.deleteByDoctorId(id);
        await super.delete(id, 'doctors');
    }
}

module.exports = Doctor;