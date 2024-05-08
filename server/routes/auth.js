const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const { body, validationResult } = require('express-validator');

const User = require('../model/users');
const Course = require('../model/courses');
const Enrollment = require('../model/enrollments');
const fetchUser = require("../middleware/fetchUser");

// ROUTE 1 - Create a user with endpoint (POST : '/auth/newuser').
router.post("/newuser", fetchUser, [
    body('name', "Name should not be less than 3 characters.").isLength({ min: 3 }),
    body('email', "Enter a valid email address.").isEmail(),
    body('password', "Password should not be less than 8 characters.").isLength({ min: 8 })
], async (req, res) => {
    // Return bad requests for errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            type: "error",
            message: error.array()
        });
    }

    const { name, email, unique_id, password, role } = req.body;
    try {
        if(req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        if(!name || !email || !unique_id || !password || !role)
            return res.status(400).json({
                type: "error",
                message: "Please fill all the fields."
            });

        let existingUser = await User.findOne({ unique_id });
        if (existingUser)
            return res.status(409).json({
                type: "error",
                message: "User already used."
            });

        // Send value in Database
        const user = await User.create({
            name,
            email,
            unique_id,
            password: CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET_KEY).toString(),
            role
        });

        // If user created successfully, then send a mail to user
        if (user.id)
            return res.status(200).json({
                type: "success",
                message: "Account created successfully.",
            });

    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong.",
        });
    }
});

// ROUTE 2 - Authenticate a user with endpoint (POST : '/auth/login')
router.post('/login', [
    body('unique_id', "Username should not be blank").exists(),
    body('password', "Password should not be blank").exists()
], async (req, res) => {
    // Return bad requests for errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            type: "error",
            message: error.array()
        });
    }

    const { unique_id, password } = req.body;
    try {
        // Check if the user exist or not
        let user = await User.findOne({ unique_id });
        if (!user) {
            return res.status(400).json({
                type: "error",
                message: "Invalid Credentials."
            });
        }

        // Check if the password is correct or not
        let pass = CryptoJS.AES.decrypt(user.password, process.env.CRYPTOJS_SECRET_KEY);
        let decryptedPassword = pass.toString(CryptoJS.enc.Utf8);
        if (password !== decryptedPassword) {
            return res.status(400).json({
                type: "error",
                message: "Invalid Credentials."
            });
        }

        // Create a token and send it to user
        const user_data = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.unique_id,
                role: user.role
            }
        }
        const authToken = jwt.sign(user_data, process.env.JWT_SECRET_KEY);
        res.status(200).json({
            type: "success",
            message: "Loggedin successfully.",
            data: authToken,
            role: user.role
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 3 - Get loggedin user details with endpoint (POST : '/auth/getuser')
router.post('/get', fetchUser, async (req, res) => {
    try {
        // Get user details
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: user
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 4 - Get all user details with endpoint (POST : '/auth/users')
router.post('/users', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const users = await User.find();
        if (users.length === 0)
            return res.status(200).json({
                type: "success",
                message: "No users found.",
                data: []
            });

        res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: users
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 5 - Get the user details from ID with endpoint (POST : '/auth/user/:id')
router.post('/user/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        return res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: user
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 6 - Update the user details with endpoint (PUT : '/auth/update/:id')
router.put('/update/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        const { name, email, unique_id, password, role } = req.body;

        if (name && name.length < 3)
            return res.status(400).json({
                type: "error",
                message: "Name should be more than 3 characters."
            });

        if (password && password.length < 8)
            return res.status(400).json({
                type: "error",
                message: "Password should be more than 8 characters."
            });

        const hashPass = password && CryptoJS.AES.encrypt(password, process.env.CRYPTOJS_SECRET_KEY).toString();

        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        user.name = name || user.name;
        user.email = email || user.email;
        user.unique_id = unique_id || user.unique_id;
        user.password = password && hashPass || user.password;
        user.role = role || user.role;

        await user.save();

        return res.status(200).json({
            type: "success",
            message: "User details updated successfully."
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 7 - Delete the user details with endpoint (DELETE : '/auth/delete/:id')
router.delete('/delete/:id', fetchUser, async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(401).json({
                type: "error",
                message: "You are not authorized to perform this action."
            });

        let user = await User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({
                type: "error",
                message: "User not found."
            });

        // if user is student then delete the enrollment details
        if (user.role === "student") {
            await Enrollment.deleteMany({ student_id: user.id });
        }

        // if user is faculty then delete the course details and enrollment details
        if (user.role === "faculty") {
            const courses = await Course.find({ faculty_id: user.id });
            if (courses.length > 0) {
                let course_ids = [];
                courses.forEach(course => {
                    course_ids.push(course.id);
                });
                await Enrollment.deleteMany({ course_id: {$in: course_ids} });
                await Course.deleteMany({ faculty_id: user.id });
            }
        }

        return res.status(200).json({
            type: "success",
            message: "User details deleted successfully."
        });
    } catch (err) {
        return res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;