const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require("../models/user.model");

const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Checks if user with given email address exists or not
        const existingUser = await User.findOne({ email });
        if (existingUser) res.status(400).json({ message: 'User with this email already exists!' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with given credentials
        const newUser = new User({ email: email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User is registered with given crendetials" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

// Login User
router.post('/login', async (req, res) => {
    const { email, passwsord } = req.body;
    try {

        // Find User in database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Comapre password to login
        const isMatch = await user.comparePassword(passwsord);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate new JWT token
        const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
})

module.exports = router;