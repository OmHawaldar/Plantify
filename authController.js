const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async(req, res) => {
    const { username, email, password } = req.body;
    
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();
        console.log("Account created succesfully")

        
        res.status(201).json({ message: 'User created successfully'});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login an existing user
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });

        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};