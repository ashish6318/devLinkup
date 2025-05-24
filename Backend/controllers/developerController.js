// backend/controllers/developerController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const Match = require('../models/Match'); // Assumes Match.js has the pre('save') hook for status

// Helper function (remains the same)
const getOrderedUserIds = (userIdA, userIdB) => {
  if (userIdA.toString() < userIdB.toString()) {
    return { userOneId: userIdA, userTwoId: userIdB };
  } else {
    return { userOneId: userIdB, userTwoId: userIdA };
  }
};

// getDiscoverableDevelopers function (remains the same from previous complete version)
exports.getDiscoverableDevelopers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    console.log("getDiscoverableDevelopers - req.user:", req.user); // Keep logs for now
    const existingInteractions = await Match.find({
      $or: [{ userOne: currentUserId }, { userTwo: currentUserId }],
    });
    const usersToExclude = new Set();
    usersToExclude.add(currentUserId.toString());
    existingInteractions.forEach(interaction => {
      const isCurrentUserUserOne = interaction.userOne.equals(currentUserId);
      const otherUserId = isCurrentUserUserOne ? interaction.userTwo : interaction.userOne;
      const currentUserAction = isCurrentUserUserOne ? interaction.userOneAction : interaction.userTwoAction;
      if (interaction.status === 'matched' || currentUserAction === 'liked' || currentUserAction === 'disliked') {
        usersToExclude.add(otherUserId.toString());
      }
    });
    const developers = await User.find({
      _id: { $nin: Array.from(usersToExclude) },
    }).select('name email skills experience githubLink projectInterests techStacks');
    res.json(developers);
  } catch (err) {
    console.error('Error in getDiscoverableDevelopers:', err.message, err.stack);
    res.status(500).send('Server Error');
  }
};

// --- UPDATED likeDeveloper to use doc.save() ensuring pre('save') hook runs ---
exports.likeDeveloper = async (req, res) => {
  console.log('--- likeDeveloper (using doc.save()) ---');
  const currentUserId = req.user?.id;
  const targetDeveloperId = req.params?.id;
  console.log('Initial currentUserId:', currentUserId, 'Initial targetDeveloperId:', targetDeveloperId);

  if (!currentUserId || !targetDeveloperId || currentUserId.toString() === targetDeveloperId.toString()) {
    return res.status(400).json({ msg: 'Invalid action: Missing IDs or cannot like self.' });
  }

  let currentUserObjectId, targetDeveloperObjectId;
  try {
    currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
    targetDeveloperObjectId = new mongoose.Types.ObjectId(targetDeveloperId);
  } catch (error) {
    return res.status(400).json({ msg: 'Invalid user ID format.' });
  }

  const { userOneId, userTwoId } = getOrderedUserIds(currentUserObjectId, targetDeveloperObjectId);
  console.log('Ordered userOneId:', userOneId.toString(), 'Ordered userTwoId:', userTwoId.toString());

  try {
    let matchDoc = await Match.findOne({ userOne: userOneId, userTwo: userTwoId });
    
    const statusBeforeThisAction = matchDoc ? matchDoc.status : 'none'; // Get status before modification

    if (!matchDoc) {
      console.log('No existing matchDoc, creating new one.');
      matchDoc = new Match({
        userOne: userOneId,
        userTwo: userTwoId,
        // userOneAction, userTwoAction, status will use schema defaults initially ('none')
      });
    }

    // Update the current user's action
    if (currentUserObjectId.equals(userOneId)) {
      console.log('Current user is userOne, setting userOneAction to liked.');
      matchDoc.userOneAction = 'liked';
    } else { // currentUserId must be userTwoId
      console.log('Current user is userTwo, setting userTwoAction to liked.');
      matchDoc.userTwoAction = 'liked';
    }
    
    // Explicitly calling save() will trigger the pre('save') hook in Match.js
    // which will calculate and set the 'status' and 'matchedAt' fields.
    const savedMatchDoc = await matchDoc.save();
    console.log('MatchDoc after save (pre-save hook should have run):', savedMatchDoc.toObject());

    const newMatchFormedByThisAction = savedMatchDoc.status === 'matched' && statusBeforeThisAction !== 'matched';

    let targetUserDetailsForFrontend = null;
    if (newMatchFormedByThisAction) {
      targetUserDetailsForFrontend = await User.findById(targetDeveloperObjectId)
                                        .select('name email _id skills techStacks profilePicture');
    }

    res.json({
      msg: 'Like recorded successfully.',
      matchData: savedMatchDoc,
      isNewMatch: newMatchFormedByThisAction,
      matchedUser: targetUserDetailsForFrontend
    });

  } catch (err) {
    console.error('Error in likeDeveloper:', err.message, err.stack);
    if (err.name === 'ValidationError') return res.status(400).json({ msg: 'Validation error.', errors: err.errors });
    if (err.code === 11000) return res.status(409).json({ msg: 'Duplicate interaction record conflict.', details: err.keyValue });
    res.status(500).send('Server Error');
  }
};

// --- UPDATED dislikeDeveloper to use doc.save() ensuring pre('save') hook runs ---
exports.dislikeDeveloper = async (req, res) => {
  console.log('--- dislikeDeveloper (using doc.save()) ---');
  const currentUserId = req.user?.id;
  const targetDeveloperId = req.params?.id;
  console.log('Initial currentUserId:', currentUserId, 'Initial targetDeveloperId:', targetDeveloperId);

  if (!currentUserId || !targetDeveloperId || currentUserId.toString() === targetDeveloperId.toString()) {
    return res.status(400).json({ msg: 'Invalid action.' });
  }

  let currentUserObjectId, targetDeveloperObjectId;
  try {
    currentUserObjectId = new mongoose.Types.ObjectId(currentUserId);
    targetDeveloperObjectId = new mongoose.Types.ObjectId(targetDeveloperId);
  } catch (error) {
    return res.status(400).json({ msg: 'Invalid user ID format.' });
  }
  
  const { userOneId, userTwoId } = getOrderedUserIds(currentUserObjectId, targetDeveloperObjectId);
  console.log('Ordered userOneId:', userOneId.toString(), 'Ordered userTwoId:', userTwoId.toString());

  try {
    let matchDoc = await Match.findOne({ userOne: userOneId, userTwo: userTwoId });

    if (!matchDoc) {
      console.log('No existing matchDoc, creating new one.');
      matchDoc = new Match({
        userOne: userOneId,
        userTwo: userTwoId,
      });
    }

    // Update the current user's action
    if (currentUserObjectId.equals(userOneId)) {
      console.log('Current user is userOne, setting userOneAction to disliked.');
      matchDoc.userOneAction = 'disliked';
    } else { // currentUserId must be userTwoId
      console.log('Current user is userTwo, setting userTwoAction to disliked.');
      matchDoc.userTwoAction = 'disliked';
    }
        
    const savedMatchDoc = await matchDoc.save(); // pre('save') hook in Match.js will set status
    console.log('MatchDoc after save (pre-save hook should have run):', savedMatchDoc.toObject());

    res.json({
      msg: 'Dislike recorded successfully.',
      matchData: savedMatchDoc
    });

  } catch (err) {
    console.error('Error in dislikeDeveloper:', err.message, err.stack);
    if (err.name === 'ValidationError') return res.status(400).json({ msg: 'Validation error.', errors: err.errors });
    if (err.code === 11000) return res.status(409).json({ msg: 'Duplicate interaction record conflict.', details: err.keyValue });
    res.status(500).send('Server Error');
  }
};
