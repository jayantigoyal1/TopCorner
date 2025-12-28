const router = require('express').Router();
const User = require('../models/User');

// REGISTER ENDPOINT
router.post('/signup', async (req, res) => {
  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email!" });
    }

    // 2. Create new user
    const newUser = new User({
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    // 3. Save to DB
    const savedUser = await newUser.save();
    
    // 4. Send success response
    res.status(201).json({ message: "User created successfully!", user: savedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN ENDPOINT (Placeholder)
// LOGIN ENDPOINT
router.post('/login', async (req, res) => {
  try {
    // 1. Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // 2. Check password (Plain text for now - usually we verify hash here)
    if (user.password !== req.body.password) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    // 3. Success! Send back user info (but NOT the password)
    const { password, ...others } = user._doc;
    res.status(200).json(others);
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;