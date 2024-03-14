// routes for auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authorize = require('../middleware/authorize');
const { check, validationResult } = require('express-validator');
const sendToken = require('../utils/jwtToken');

// Route 1: Create a User using: POST "/api/auth/". No login required
router.post(
    '/createuser',
    [
        check('username', 'Enter a valid username').isLength({ min: 3 }),
        check('role', 'Enter a valid role').isLength({ min: 3 }),
        check('password', 'Password must be of minimum 5 characters length').isLength({
            min: 3,
        }),
    ],
    async (req, res) => {
        let success = false;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        // Check whether the user with this username exists already


        try {
            let UserExist = await User.findOne({ username: req.body.username });
            if (UserExist) {
                return res.status(400).json({ success, error: "Sorry a user with this username already exists" });
            }
            //check email
            let emailExist = await User.findOne({ email: req.body.email });
            if (emailExist) {
                return res.status(400).json({ success, error: "Sorry a user with this email already exists" });
            }
            //validate Email
            const email = req.body.email;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ success, error: "Invalid Email" });
            }

            const {username,password,role} = req.body;
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            const user = await User.create({
                username,
                email,
                password:secPass,
                role
            })
            sendToken(user,201,res)
           
        } catch (error) {
            console.error(error.message);
            // console.log("username :",req.body.username);
            res.status(500).send(error.message);
        }
    }
);



// Route 2: Authenticate a User using: POST "/api/auth/login". No login required

router.post(
    '/login',
    [
        check('username', 'Enter a valid username').isLength({ min: 3 }),
        check('password', 'Password cannot be blank').exists(),
    ],
    async (req, res) => {
        let success = false;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        const { username, password } = req.body;
        try {
            let user = await User.findOne({
                username,
            });
            if (!user) {
                return res.status(400).json({
                    success,
                    message: "Invalid Credentials",
                });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    success,
                    message: "Invalid Pass",
                });
            }
            sendToken(user,200,res)

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

// Route 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.get('/getuser', authorize(['SuperAdmin', 'Admin', 'Client']), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}
);



// Route 4: Logout a User using: GET "/api/auth/logout". Login required

router.get('/logout', authorize(['SuperAdmin', 'Admin', 'Client']), async (req, res) => {
    try {
        res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}
);


module.exports = router;


