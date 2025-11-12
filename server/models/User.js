import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  // Authentication
  authProvider: { 
    type: String, 
    enum: ['email', 'google', 'discord'], 
    required: true 
  },
  authId: { type: String, sparse: true }, // For OAuth
  
  // Email/Password (for classic auth)
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String }, // Hashed, only for email auth
  
  // Profile
  username: { type: String, required: true },
  avatar: { 
    type: String, 
    default: '🎩' // Default emoji avatar
  },
  avatarType: {
    type: String,
    enum: ['emoji', 'upload', 'url', 'oauth'],
    default: 'emoji'
  },
  
  // Game Data
  coins: { type: Number, default: 0 },
  unlockedMaps: { 
    type: [String], 
    default: ['classic', 'techValley', 'campus', 'fantasy'] 
  },
  
  // Stats
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    gamesSecond: { type: Number, default: 0 },
    gamesThird: { type: Number, default: 0 },
    hotelsBuilt: { type: Number, default: 0 },
    totalCoinsEarned: { type: Number, default: 0 },
    totalCoinsSpent: { type: Number, default: 0 },
    lastPlayedDate: Date,
    firstGameToday: { type: Boolean, default: true }
  },
  
  // Weekly Challenges
  weeklyProgress: {
    weekStart: Date,
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    hotelsBuilt: { type: Number, default: 0 },
    monopoliesCompleted: { type: Number, default: 0 },
    completedChallenges: [String]
  },
  
  // Account Settings
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = new Date();
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if first game today
UserSchema.methods.isFirstGameToday = function() {
  const today = new Date().toDateString();
  const lastPlayed = this.stats.lastPlayedDate ? new Date(this.stats.lastPlayedDate).toDateString() : null;
  return today !== lastPlayed;
};

export default mongoose.model('User', UserSchema);
