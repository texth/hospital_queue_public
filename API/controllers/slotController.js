const express = require('express');

const Slot = require('../models/slot');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/doctor/:doctor_id', async (req, res) => {
    try {
        const slots = await Slot.findByDoctorId(req.params.doctor_id);
        if(slots.length == 0){
            return res.status(404).send("Slots not found");
        }
        // remove user_id and add available field
        for(let i = 0; i < slots.length; i++){
            if(slots[i].user_id == null){
                slots[i].available = true;
            } else {
                slots[i].available = false;
            }
            delete slots[i].user_id;
        }
        res.status(200).json(slots);
    } catch (err) {
        console.log(err);
    }
});

router.get('/myslots', auth, async (req, res) => {
    try {
        const slots = await Slot.findByUserId(req.user.user_id);
        if(slots.length == 0){
            return res.status(404).send("Slots not found");
        }
        res.status(200).json(slots);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;