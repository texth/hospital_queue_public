const express = require('express');
const Doctor = require('../models/doctor');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.findAll();
        if(doctors.length == 0){
            return res.status(404).send("Doctors not found");
        }
        res.status(200).json(doctors);
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if(doctor.id == 0){
            return res.status(404).send("Doctor not found");
        }
        res.status(200).json(doctor);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;