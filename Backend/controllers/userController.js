// backend/controllers/userController.js
const User = require('../models/User');
const mongoose = require('mongoose'); // Import mongoose for ObjectId if needed elsewhere

// @desc    Get user profile by ID (could be current user or another user if public)
// @route   GET /api/users/:id
// @access  Private (or Public depending on your needs)
exports.getUserProfile = async (req, res) => {
  try {
    // Validate if req.params.id is a valid ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ msg: 'Invalid user ID format.' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getUserProfile:', err.message, err.stack);
    // err.kind === 'ObjectId' check is good, but isValid check above is more proactive
    if (err.kind === 'ObjectId') { 
        return res.status(404).json({ msg: 'User not found (malformed ID).' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Update current logged-in user's profile
// @route   PUT /api/users/me/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const { name, skills, experience, githubLink, projectInterests, techStacks, profilePicture /* any other fields */ } = req.body;
  
  console.log("Backend updateUserProfile - Received data:", req.body);
  console.log("Backend updateUserProfile - Files (if any, for future image upload):", req.file || req.files);


  // Fields to update
  const profileFieldsToUpdate = {};

  // Explicitly check for undefined to allow sending empty strings to clear fields
  if (name !== undefined) profileFieldsToUpdate.name = name;
  if (skills !== undefined) {
    profileFieldsToUpdate.skills = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(skill => skill.trim()).filter(s => s) : []);
  }
  if (experience !== undefined) profileFieldsToUpdate.experience = experience;
  if (githubLink !== undefined) profileFieldsToUpdate.githubLink = githubLink; // Add validation for URL format if necessary
  if (projectInterests !== undefined) {
    profileFieldsToUpdate.projectInterests = Array.isArray(projectInterests) ? projectInterests : (typeof projectInterests === 'string' ? projectInterests.split(',').map(interest => interest.trim()).filter(s => s) : []);
  }
  if (techStacks !== undefined) {
    profileFieldsToUpdate.techStacks = Array.isArray(techStacks) ? techStacks : (typeof techStacks === 'string' ? techStacks.split(',').map(stack => stack.trim()).filter(s => s) : []);
  }
  if (profilePicture !== undefined) profileFieldsToUpdate.profilePicture = profilePicture; // For future image URL

  // Ensure updatedAt is always part of the update
  profileFieldsToUpdate.updatedAt = Date.now();

  console.log("Backend updateUserProfile - Fields to update:", profileFieldsToUpdate);

  try {
    // req.user.id comes from authMiddleware
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFieldsToUpdate },
      { new: true, runValidators: true, context: 'query' } // new:true returns the modified document, runValidators ensures schema validation
    ).select('-password'); // Exclude password from the returned user object

    if (!user) {
      console.error("Backend updateUserProfile - User not found with ID:", req.user.id);
      return res.status(404).json({ msg: 'User not found, cannot update profile.' });
    }

    console.log("Backend updateUserProfile - Profile updated successfully for user:", user._id);
    res.json(user); // Send back the updated user object
  } catch (err) {
    console.error("Backend updateUserProfile - Error updating profile:", err.message, err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json({ msg: 'Validation failed', errors: err.errors });
    }
    res.status(500).send('Server Error');
  }
};
