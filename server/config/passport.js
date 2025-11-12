import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as DiscordStrategy } from 'passport-discord';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ authId: profile.id, authProvider: 'google' });
      
      if (!user) {
        // Create new user
        user = new User({
          authProvider: 'google',
          authId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName || profile.emails[0].value.split('@')[0],
          avatar: profile.photos[0]?.value || '🎩',
          avatarType: 'oauth'
        });
        await user.save();
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
}

// Discord Strategy
if (process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET) {
  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ authId: profile.id, authProvider: 'discord' });
      
      if (!user) {
        // Create new user
        const avatarUrl = profile.avatar 
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : '🎩';
          
        user = new User({
          authProvider: 'discord',
          authId: profile.id,
          email: profile.email,
          username: profile.username || profile.email.split('@')[0],
          avatar: avatarUrl,
          avatarType: 'oauth'
        });
        await user.save();
      }
      
      // Update last login
      user.lastLogin = new Date();
      await user.save();
      
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }));
}

export default passport;
