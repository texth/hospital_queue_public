const Model = require('./model').Model;

// CREATE TABLE slots (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     doctor_id INT,
//     -- user is not required, as the slot can be available
//     user_id INT,
//     time TEXT,
//     FOREIGN KEY (doctor_id) REFERENCES doctors(id),
//     FOREIGN KEY (user_id) REFERENCES users(id)
// );

class Slot extends Model {
    constructor(doctor_id = 0, user_id = null, time = '') {
        super();
        this.id = 0;
        this.doctor_id = doctor_id;
        this.user_id = user_id;
        this.time = time;
    }

    static async findAll() {
        let results = await super.findAll('slots');
        let slots = [];
        for (let i = 0; i < results.length; i++) {
            let slot = new Slot();
            slot.id = results[i].id;
            slot.doctor_id = results[i].doctor_id;
            slot.user_id = results[i].user_id;
            slot.time = results[i].time;
            slots.push(slot);
        }
        return slots;
    }

    static async findById(id) {
        let results = await super.find(id, 'slots');
        let slot = new Slot();
        if(results[0]){
            slot.id = results[0].id;
            slot.doctor_id = results[0].doctor_id;
            slot.user_id = results[0].user_id;
            slot.time = results[0].time;
        }
        return slot;
    }

    static async findByDoctorId(doctor_id) {
        let results = await super.find(doctor_id, 'slots', 'doctor_id');
        let slots = [];
        for (let i = 0; i < results.length; i++) {
            let slot = new Slot();
            slot.id = results[i].id;
            slot.doctor_id = results[i].doctor_id;
            slot.user_id = results[i].user_id;
            slot.time = results[i].time;
            slots.push(slot);
        }
        return slots;
    }

    static async findByUserId(user_id) {
        let results = await super.find(user_id, 'slots', 'user_id');
        let slots = [];
        for (let i = 0; i < results.length; i++) {
            let slot = new Slot();
            slot.id = results[i].id;
            slot.doctor_id = results[i].doctor_id;
            slot.user_id = results[i].user_id;
            slot.time = results[i].time;
            slots.push(slot);
        }
        return slots;
    }

    static async save(slot) {
        await super.save(slot, 'slots');
        return await this.findById(slot.id);
    }

    static async deleteById(id) {
        await super.delete(id, 'slots');
    }

    static async deleteByDoctorId(doctor_id) {
        let slots = await this.findByDoctorId(doctor_id);
        for (let i = 0; i < slots.length; i++) {
            await this.deleteById(slots[i].id);
        }
    }

    // Don't delete the slot; set user_id to NULL to make it available again
    static async deleteUserSlots(user_id) {
        let slots = await this.findByUserId(user_id);
        for (let i = 0; i < slots.length; i++) {
            slots[i].user_id = null;
            await this.save(slots[i]);
        }
    }
}

module.exports = Slot;