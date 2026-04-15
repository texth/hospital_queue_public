const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

const auth = require('./middleware/auth');
const cors = require("cors");

const authController = require('./controllers/authController');
const doctorController = require('./controllers/doctorController');
const slotController = require('./controllers/slotController');


app.use(express.json());
app.use(cookieParser(process.env.COOKIE_KEY));

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};


app.use(cors(corsOptions));
app.use(fileUpload({}));

app.use('/api/auth', authController);
app.use('/api/doctors', doctorController);
app.use('/api/slots', slotController);

// Send default avatar if doctor picture is not available
app.use('/img/avatars/:id', async (req, res) => {
    try {
        // check if doctor picture exists
        const picturePath = process.cwd() + `/doctor_pictures/${req.params.id}.jpg`;
        if (!require('fs').existsSync(picturePath)) {
            throw new Error("Doctor picture not found");
        }
        res.sendFile(process.cwd() + `/doctor_pictures/${req.params.id}.jpg`);
        return;
    } catch (err) {
    }
    try {
        res.sendFile(process.cwd() + `/default-avatar.jpg`);
    } catch (err) {
        console.log(err);
    }
});

app.use('/img/avatars', async (req, res) => {
    try {
        res.sendFile(process.cwd() + `/default-avatar.jpg`);
    } catch (err) {
        console.log(err);
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});