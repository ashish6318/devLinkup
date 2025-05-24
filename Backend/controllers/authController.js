// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Required if not using user.comparePassword directly for some reason, but good to have for direct comparison if needed.

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, skills, experience, githubLink, projectInterests, techStacks } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please enter name, email, and password' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      skills,
      experience,
      githubLink,
      projectInterests,
      techStacks
    });

    await user.save(); // Password hashing happens in pre-save hook

    // Optionally create a token on registration, or just send success
    // For this example, we'll send a success message. User can log in separately.
    res.status(201).json({ msg: 'User registered successfully. Please login.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        name: user.name,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { // Sending back some user info can be helpful for the frontend
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get logged in user's data (alternative to a /users/me if focused on auth status)
// @route   GET /api/auth/me
// @access  Private
exports.getLoggedInUser = async (req, res) => {
    try {
        // req.user is set by authMiddleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
