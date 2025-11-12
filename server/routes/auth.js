import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import upload from '../config/multer.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ========== CLASSIC AUTH ==========

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be 6+ characters' });
    }
    
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create user
    const user = new User({
      authProvider: 'email',
      username,
      email,
      password, // Will be hashed by pre-save hook
      avatar: '🎩' // Default
    });
    
    await user.save();
    
    // Log them in
    req.session.userId = user._id;
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        coins: user.coins,
        unlockedMaps: user.unlockedMaps
      }
    });
    
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if email auth
    if (user.authProvider !== 'email') {
      return res.status(400).json({ 
        error: `Please login with ${user.authProvider}` 
      });
    }
    
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    
    // Set session
    req.session.userId = user._id;
    
    res.json({ 
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        coins: user.coins,
        unlockedMaps: user.unlockedMaps,
        stats: user.stats
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========== OAUTH ==========

// Google Auth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.userId = req.user._id;
    res.redirect(process.env.CLIENT_URL + '/lobby');
  }
);

// Discord Auth
router.get('/discord',
  passport.authenticate('discord')
);

router.get('/discord/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }),
  (req, res) => {
    req.session.userId = req.user._id;
    res.redirect(process.env.CLIENT_URL + '/lobby');
  }
);

// ========== PROFILE ==========

// Get profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { username, avatar, avatarType } = req.body;
    
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;
    if (avatarType) user.avatarType = avatarType;
    
    await user.save();
    
    res.json({ 
      success: true, 
      user: {
        username: user.username,
        avatar: user.avatar,
        avatarType: user.avatarType
      }
    });
    
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload avatar
router.post('/upload-avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    const user = await User.findById(req.session.userId);
    user.avatar = avatarUrl;
    user.avatarType = 'upload';
    await user.save();
    
    res.json({ success: true, avatar: avatarUrl });
    
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

export default router;
