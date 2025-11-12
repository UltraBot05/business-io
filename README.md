# 🎲 Monopoly - Free Online Multiplayer Game

A modern, web-based Monopoly game with multiplayer support, customizable rules, and multiple themed maps!

## ✨ Features

- **🎮 Multiplayer**: Play with up to 8 friends in real-time
- **🗺️ Multiple Maps**: 4 free maps + 4 unlockable premium maps
- **⚙️ Custom Rules**: Customize gameplay rules before each game
- **💰 Progression System**: Win games to earn coins and unlock maps
- **🔐 Multiple Auth Options**: Email/password, Google, and Discord login
- **👤 Profile System**: Customizable avatars and stats tracking
- **🎲 Fair Dice System**: Smart balancing to prevent extreme luck/unluck
- **📱 Responsive**: Play on desktop, tablet, or mobile

## 🚀 Tech Stack

### Frontend
- React 18+ with Vite
- React Router for navigation
- Socket.io Client for real-time updates
- Modern CSS3 with gradients and animations

### Backend
- Node.js + Express
- Socket.io for multiplayer
- MongoDB with Mongoose
- Passport.js for OAuth
- BCrypt for password hashing
- Multer for file uploads

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- (Optional) Google OAuth credentials
- (Optional) Discord OAuth credentials

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd monopoly
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure Environment Variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

   Required variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `SESSION_SECRET`: Random secret key for sessions
   - (Optional) Google OAuth credentials
   - (Optional) Discord OAuth credentials

5. **Start MongoDB**
   ```bash
   # Windows
   mongod

   # Linux/Mac
   sudo systemctl start mongod
   ```

6. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the Frontend (in a new terminal)**
   ```bash
   cd client
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 How to Play

1. **Create an Account**
   - Sign up with email/password, Google, or Discord

2. **Create or Join a Game**
   - Create a new game and get a 5-character room code
   - Or join an existing game with a room code

3. **Customize Rules** (Host only)
   - Choose a map
   - Enable/disable gameplay rules
   - Set starting money and other options

4. **Play!**
   - Roll dice, buy properties, pay rent
   - Build houses and hotels
   - Trade with other players
   - Bankrupt your opponents!

5. **Earn Coins**
   - Win games to earn coins
   - Build hotels for bonus coins
   - Complete weekly challenges

6. **Unlock Maps**
   - Use coins to unlock premium maps
   - 4 free maps + 4 premium unlockables

## 🗺️ Available Maps

### Free Maps
- **Classic** - Traditional Monopoly board
- **Tech Valley** - Tech companies themed
- **College Campus** - University life themed
- **Fantasy Realm** - Magical lands themed

### Premium Maps (Unlockable)
- **Space Station** - 200 coins
- **Ocean World** - 350 coins
- **Movie Studios** - 500 coins
- **Historic Cities** - 750 coins

## ⚙️ Customizable Rules

- ✅ Double rent on complete property sets
- ✅ Vacation cash (Free Parking pool)
- ✅ Auction system for unpurchased properties
- ✅ Rent collection while in jail
- ✅ Mortgage properties
- ✅ Even building requirement
- ✅ GO landing bonus
- ✅ Starting cash amount
- ✅ Randomize player order

## 📊 Progression System

### Earning Coins
- 🥇 1st place: 50 coins
- 🥈 2nd place: 25 coins
- 🥉 3rd place: 10 coins
- 🏨 Build a hotel: 5 coins
- 📅 First game of the day: 10 coins

### Weekly Challenges
- Play 10 games: 30 coins
- Win 3 games: 50 coins
- Build 10 hotels: 25 coins
- Complete 2 color sets: 40 coins

## 🛠️ Development

### Project Structure
```
monopoly/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # Context providers
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   └── package.json
├── server/              # Node.js backend
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── game/            # Game logic
│   │   └── maps/        # Map configurations
│   └── package.json
└── README.md
```

### Key Files
- `client/src/App.jsx` - Main React app with routing
- `client/src/contexts/AuthContext.jsx` - Authentication state
- `server/index.js` - Express server + Socket.io setup
- `server/models/User.js` - User database schema
- `server/routes/auth.js` - Authentication endpoints

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder to Vercel or Netlify
3. Set environment variables in hosting dashboard

### Backend (Render/Railway)
1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy!

### MongoDB Atlas
1. Create a free cluster on MongoDB Atlas
2. Get your connection string
3. Update `MONGODB_URI` in environment variables

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

MIT License - feel free to use this project for learning or personal use!

## 🎉 Credits

Created with ❤️ for everyone who loves Monopoly!

---

**Have fun playing! 🎲🏠💰**
