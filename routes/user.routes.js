const express = require('express')
const authMiddleware = require('../middleware/auth.middleware');
const User = require('../models/user.model');

const router = express.Router();

// Get Users
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Get a user by Id
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Update a user details by Id
router.patch('/:id', authMiddleware, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (req.user.userId !== req.params.id) return res.status(403).json({ message: "Unauthorized to update user details" });

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // Due to pre-hoook usage, password will be saved as hashed

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Delete a user by Id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.userId !== req.params.id) return res.status(403).json({ message: "Unauthorized to update user details" });

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await user.deleteOne();
        res.status(200).json({ message: "User has been deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = router;