# 🎲 Monopoly Game - Quick Start Guide

## ✅ Setup Complete!

Your Monopoly game project is now ready! Here's how to run it:

## 🚀 Running the Application

### Step 1: Start MongoDB
Make sure MongoDB is running on your system:

**Windows (if MongoDB is installed):**
```bash
# Start MongoDB service
net start MongoDB

# OR if installed manually, run:
mongod
```

**Linux/Mac:**
```bash
sudo systemctl start mongod
# OR
mongod
```

### Step 2: Start the Backend Server
Open a terminal and run:
```bash
cd server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📡 Socket.io ready for connections
```

### Step 3: Start the Frontend (New Terminal)
Open a **new** terminal and run:
```bash
cd client
npm run dev
```

You should see:
```
  VITE ready in XXX ms

  ➜  Local:   http://localhost:3000/
```

### Step 4: Open Your Browser
Navigate to: **http://localhost:3000**

## 🎮 Test the Application

1. **Create an Account**
   - Click "Create Account"
   - Enter username, email, password
   - Click "Create Account"

2. **You're In!**
   - You'll be redirected to the lobby
   - You can create games or join with room codes

## 📝 Current Status

### ✅ Completed
- ✅ Frontend React app with Vite
- ✅ Authentication system (email/password + OAuth)
- ✅ User profile system
- ✅ Backend Express server
- ✅ MongoDB database integration
- ✅ Socket.io setup for multiplayer
- ✅ Login/Register pages
- ✅ Lobby page

### 🚧 To Be Implemented (Phase 2)
- Game board UI
- Game room functionality
- Dice rolling system
- Property buying/trading
- Map system (8 maps)
- Coin/progression system
- Weekly challenges
- Profile customization

## 🔧 Troubleshooting

### MongoDB Connection Error
**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
- Make sure MongoDB is installed and running
- Check if MongoDB is listening on port 27017
- Try: `mongosh` to test connection

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
- Kill the process using that port
- Or change the port in `client/vite.config.js`

### OAuth Not Working
**Note:** Google and Discord login require API credentials.
- For now, use email/password registration
- OAuth can be set up later by getting credentials from:
  - Google: https://console.cloud.google.com
  - Discord: https://discord.com/developers

## 📂 Project Structure

```
monopoly/
├── client/           # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page views
│   │   ├── contexts/    # React contexts
│   │   └── utils/       # Utilities
│   └── package.json
│
├── server/           # Backend (Node.js + Express)
│   ├── config/       # Configuration
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── game/         # Game logic
│   └── index.js      # Server entry
│
└── README.md
```

## 🎯 Next Steps

To continue development:

1. **Game Board Component**
   - Create game board layout (40 spaces)
   - Add player tokens
   - Dice rolling animation

2. **Room System**
   - Real-time room management
   - Player joining/leaving
   - Game state synchronization

3. **Game Logic**
   - Property system
   - Money management
   - Turn system
   - Building houses/hotels

4. **Maps**
   - Create 8 themed maps
   - Map selection UI
   - Unlock system

## 💡 Tips

- Frontend runs on **http://localhost:3000**
- Backend runs on **http://localhost:5000**
- MongoDB stores data at **mongodb://localhost:27017/monopoly**
- Check `server/.env` for configuration
- Press `Ctrl+C` to stop servers

## 🎉 You're All Set!

The foundation is complete. Start the servers and test the authentication flow!

**Happy Coding! 🚀**
