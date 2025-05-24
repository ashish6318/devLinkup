// backend/models/Match.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  // userOne will always be the user with the lexicographically smaller ID
  // userTwo will always be the user with the lexicographically larger ID
  // This ensures that for any pair (A,B), there's only one Match document.
  userOne: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userTwo: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Tracks the action of userOne (smaller ID user) towards userTwo
  userOneAction: {
    type: String,
    enum: ['liked', 'disliked', 'none'],
    default: 'none',
  },
  // Tracks the action of userTwo (larger ID user) towards userOne
  userTwoAction: {
    type: String,
    enum: ['liked', 'disliked', 'none'],
    default: 'none',
  },

  // Overall status of the match, derived from the actions above
  status: {
    type: String,
    enum: [
      'none',               // No significant actions taken by either user yet.
      'pending',            // One user has liked, the other has not yet responded positively (is 'none' or also 'pending' from their side).
      'matched',            // Both users have liked each other.
      'declined_by_one',    // One user liked, the other disliked. Or one user disliked while the other was 'none'.
      'mutually_declined',  // Both users have disliked each other.
      // 'blocked',         // Future: If blocking is implemented
      // 'unmatched'        // Future: If unmatching a previous match is implemented
    ],
    default: 'none', // Initial state before any likes/dislikes are recorded.
  },
  
  matchedAt: { type: Date }, // Timestamp when the status becomes 'matched'
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index to ensure uniqueness for the pair (userOne, userTwo)
MatchSchema.index({ userOne: 1, userTwo: 1 }, { unique: true });

// Middleware to set updatedAt and determine match status before saving
MatchSchema.pre('save', function (next) {
  this.updatedAt = Date.now();

  const u1Action = this.userOneAction;
  const u2Action = this.userTwoAction;

  if (u1Action === 'liked' && u2Action === 'liked') {
    // Both users like each other
    if (this.status !== 'matched') { // Only set matchedAt if it's transitioning to matched
        this.matchedAt = Date.now();
    }
    this.status = 'matched';
  } else if (u1Action === 'disliked' || u2Action === 'disliked') {
    // If at least one user has disliked
    if (u1Action === 'disliked' && u2Action === 'disliked') {
      this.status = 'mutually_declined';
    } else {
      // This covers: (liked, disliked), (disliked, liked), (none, disliked), (disliked, none)
      this.status = 'declined_by_one';
    }
    this.matchedAt = undefined; // Not a match, so clear any previous match timestamp
  } else if (u1Action === 'liked' || u2Action === 'liked') {
    // At least one user has 'liked', and NO ONE has 'disliked' (due to previous condition)
    // This means one 'liked' and the other is 'none'.
    this.status = 'pending';
    this.matchedAt = undefined;
  } else {
    // Both actions are 'none' (or any other unhandled combination, defaulting to 'none' state)
    this.status = 'none';
    this.matchedAt = undefined;
  }
  
  next();
});

module.exports = mongoose.model('Match', MatchSchema);
