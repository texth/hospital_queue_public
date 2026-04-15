const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

function generateCode() {
    let code = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 8; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return code;
}

async function wrapedSendMail(mailOptions) {
    // return new Promise((resolve, reject) => {

    //     transporter.sendMail(mailOptions, function (error, info) {
    //         if (error) {
    //             resolve(false);
    //         }
    //         else {
    //             resolve(true);
    //         }
    //     });
    // });
    console.log("Sending email to " + mailOptions.to + " with text: " + mailOptions.text);
    return true;
}


const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, full_name, password, confirm } = req.body;

        if (!(email && full_name && password && confirm)) {
            return res.status(400).send("All input is required");
        }

        if (password !== confirm) {
            return res.status(400).send("Password does not match");
        }

        const emailCheck = await User.findByEmail(email);

        if (emailCheck.id != 0) {
            let encryptedPassword = await bcrypt.hash(password, 10);
            if (emailCheck.password != encryptedPassword) {
                return res.status(409).send("Email Already Exist. Please Login");
            }
            else {
                emailCheck.email = email;
                emailCheck.email_code = generateCode();
                emailCheck = await User.save(emailCheck);
                let mailOptions = {
                    from: process.env.MAIL_USER,
                    to: emailCheck.email,
                    subject: 'Your registration code',
                    text: 'Your registration code is ' + emailCheck.email_code
                };
                if (!await wrapedSendMail(mailOptions)) {
                    return res.status(500).send("Email sending error");
                }
                return res.status(201).send("Email is not confirmed! New code was sent to your email");
            }
        }

        let encryptedPassword = await bcrypt.hash(password, 10);

        let email_code = generateCode();

        let mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Your registration code',
            text: 'Your registration code is ' + email_code
        };

        if (!await wrapedSendMail(mailOptions)) {
            return res.status(500).send("Email sending error");
        }

        let user = await User.save({
            password: encryptedPassword,
            email,
            email_code,
            full_name
        });

        res.status(201).json(user.safe());
    } catch (err) {
        console.log(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }

        let user = await User.findByEmail(email);

        if (user.id == 0) {
            return res.status(400).send("Invalid Credentials");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send("Invalid Credentials");
        }

        if (user.email_code != "" && user.email_code != null) {
            user.email_code = generateCode();
            user = await User.save(user);
            let mailOptions = {
                from: process.env.MAIL_USER,
                to: user.email,
                subject: 'Your registration code',
                text: 'Your registration code is ' + user.email_code
            };
            if (!await wrapedSendMail(mailOptions)) {
                return res.status(500).send("Email sending error");
            }
            return res.status(400).send("Email is not confirmed! New code was sent to your email");
        }

        const token = jwt.sign(
            { user_id: user.id, role: user.role },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        res.cookie('token', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
        user = user.safe();
        user.token = token;

        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id);
        if (user.id == 0) {
            return res.status(404).send("User not found");
        }
        user.password = "";
        user.email_code = "";
        user.reset_code = "";
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).send("User was logged out");
        
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/refresh', auth,  async (req, res) => {
    try {
        const token = jwt.sign(
            { user_id: req.user.user_id, role: req.user.role },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        res.cookie('token', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
        let user = await User.findById(req.user.user_id);
        user = user.safe();
        user.token = token;
        res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
    }
});

router.post('/verify-email', async (req, res) => {
    try {
        const { email, password, code } = req.body;

        if (!(email && password && code)) {
            return res.status(400).send("All input is required");
        }

        let user = await User.findByEmail(email);

        if (user.id == 0) {
            return res.status(400).send("Invalid Email");
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).send("Invalid Password");
        }

        if (user.email_code != code) {
            return res.status(400).send("Invalid Code");
        }

        user.email_code = "";
        user = await User.save(user);
        const token = jwt.sign(
            { user_id: user.id, role: user.role },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        res.cookie('token', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
        user = user.safe();
        user.token = token;
        
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
    }
});

router.post("/password-reset", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send("All input is required");
        }

        let user = await User.findByEmail(email);

        if (user.id == 0) {
            return res.status(400).send("No such user");
        }

        user.reset_code = generateCode();
        user = await User.save(user);
        let mailOptions = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject: 'Your reset code',
            text: 'Your reset code is ' + user.reset_code
        };
        if (!await wrapedSendMail(mailOptions)) {
            return res.status(500).send("Email sending error");
        }
        res.status(200).send("Reset code was sent to your email");
    }
    catch (err) {
        console.log(err);
    }
});

router.post("/password-reset-confirm", async (req, res) => {
    try {
        const { email, password, code } = req.body;

        if (!((email && password && code))) {
            return res.status(400).send("All input is required");
        }

        let user = await User.findByEmail(email);

        if (user.id == 0) {
            return res.status(400).send("No such user");
        }

        if (user.reset_code != code) {
            return res.status(400).send("Invalid Code");
        }

        user.reset_code = "";
        user.password = await bcrypt.hash(password, 10);
        user = await User.save(user);
        res.status(200).send("Password was changed");
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;