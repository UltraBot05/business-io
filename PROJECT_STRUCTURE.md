# 📁 business.io - Project Structure

```
monopoly/
│
├── 📄 .gitignore                    # Git ignore file
├── 📄 README.md                     # Main project documentation
├── 📄 QUICKSTART.md                 # Quick setup guide
├── 📄 HOW_TO_PLAY.md               # Game rules & mechanics
├── 📄 TODO.md                       # Feature roadmap
├── 📄 PROJECT_STATUS.md            # Current implementation status
│
├── 📂 client/                       # React Frontend (Port 3000)
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 vite.config.js           # Vite configuration
│   ├── 📄 eslint.config.js         # ESLint configuration
│   ├── 📄 index.html               # HTML entry point
│   │
│   ├── 📂 public/                  # Static assets
│   │   ├── 🖼️ image.png            # Custom logo
│   │   ├── 🖼️ dice.svg             # Dice icon
│   │   └── 🖼️ vite.svg             # Vite logo
│   │
│   └── 📂 src/                     # Source code
│       ├── 📄 main.jsx             # React entry point
│       ├── 📄 App.jsx              # Main app component with routes
│       ├── 📄 App.css              # Global app styles
│       ├── 📄 index.css            # Global CSS reset & base styles
│       │
│       ├── 📂 components/          # Reusable components
│       │   ├── 📂 auth/            # Authentication components
│       │   │   ├── Login.jsx       # Login form
│       │   │   ├── Register.jsx    # Registration form
│       │   │   └── Auth.css        # Auth styles
│       │   │
│       │   └── 📂 game/            # Game components
│       │       ├── Board.jsx       # Monopoly board
│       │       ├── Board.css
│       │       ├── PlayerList.jsx  # Player sidebar
│       │       ├── PlayerList.css
│       │       ├── GameControls.jsx # Dice, buttons
│       │       ├── GameControls.css
│       │       ├── PropertyCard.jsx # Property details modal
│       │       └── PropertyCard.css
│       │
│       ├── 📂 pages/               # Route pages
│       │   ├── Home.jsx            # Landing page
│       │   ├── Home.css
│       │   ├── Lobby.jsx           # Room creation/joining
│       │   ├── Lobby.css
│       │   ├── TestLobby.jsx      # Test page (bypass auth)
│       │   ├── TestLobby.css
│       │   ├── GameRoom.jsx       # Main game interface
│       │   └── GameRoom.css
│       │
│       ├── 📂 contexts/            # React contexts
│       │   └── AuthContext.jsx    # Authentication state
│       │
│       ├── 📂 data/                # Static game data
│       │   └── maps.js            # 8 Monopoly board layouts
│       │
│       └── 📂 utils/               # Utility functions
│           └── socket.js          # Socket.io client singleton
│
└── 📂 server/                      # Node.js Backend (Port 5000)
    ├── 📄 package.json             # Backend dependencies
    ├── 📄 index.js                 # Express + Socket.io server
    ├── 📄 .env.example             # Environment variables template
    │
    ├── 📂 config/                  # Configuration files
    │   ├── passport.js             # Passport.js OAuth setup
    │   └── multer.js               # File upload config
    │
    ├── 📂 models/                  # MongoDB schemas
    │   └── User.js                 # User model
    │
    ├── 📂 middleware/              # Express middleware
    │   └── auth.js                 # JWT authentication
    │
    ├── 📂 routes/                  # API routes
    │   └── auth.js                 # Auth endpoints
    │
    ├── 📂 game/                    # Game logic
    │   ├── roomManager.js          # Room creation/management
    │   ├── gameLogic.js            # Core game rules
    │   └── maps.js                 # Server-side map data
    │
    └── 📂 uploads/                 # User uploaded files (avatars, etc.)
```

## 📊 File Count Summary

### Frontend (`client/`)
- **React Components**: 11 files
- **CSS Files**: 10 files
- **Pages**: 4 routes
- **Utilities**: 2 files
- **Total Frontend**: ~30 source files

### Backend (`server/`)
- **Main Server**: 1 file (index.js)
- **Models**: 1 file
- **Routes**: 1 file
- **Middleware**: 1 file
- **Game Logic**: 3 files
- **Config**: 2 files
- **Total Backend**: ~10 source files

### Documentation
- **MD Files**: 6 documentation files

### Configuration
- **Config Files**: 5 files (package.json, vite.config, eslint, etc.)

## 🔑 Key Files by Purpose

### **Entry Points**
- `client/src/main.jsx` - Frontend entry
- `server/index.js` - Backend entry
- `client/index.html` - HTML template

### **Routing**
- `client/src/App.jsx` - React Router setup
- `server/routes/auth.js` - API routes

### **Real-time Communication**
- `client/src/utils/socket.js` - Socket.io client
- `server/index.js` - Socket.io event handlers (lines 50-150)

### **Game State Management**
- `server/game/roomManager.js` - Room lifecycle
- `server/game/gameLogic.js` - Turn logic, dice rolls, property purchases
- `client/src/pages/GameRoom.jsx` - Client-side game state

### **Data**
- `client/src/data/maps.js` - 8 board layouts (Classic, Tech Valley, etc.)
- `server/game/maps.js` - Server-side board data

### **Styling**
- `client/src/index.css` - Global styles, Orbitron font import
- `client/src/pages/Home.css` - Landing page gradient

### **Authentication**
- `server/config/passport.js` - OAuth strategies
- `client/src/contexts/AuthContext.jsx` - Auth state provider
- `server/models/User.js` - User schema

## 📦 Dependencies

### Frontend (client/package.json)
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.1.1",
  "socket.io-client": "^4.7.2",
  "vite": "^7.2.2"
}
```

### Backend (server/package.json)
```json
{
  "express": "^4.18.2",
  "socket.io": "^4.7.2",
  "mongoose": "^8.0.0",
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "passport-discord": "^0.1.4",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "express-session": "^1.17.3",
  "multer": "^1.4.5-lts.1"
}
```

## 🎯 Active Development Areas

**Currently Working On:**
- Socket connection persistence (TestLobby → GameRoom)
- Registration endpoint 500 error fix

**Next Up:**
- Chance & Community Chest cards
- House/hotel building
- Player trading
- 7 additional themed maps

---

**Total Lines of Code:** ~5,700+  
**Languages:** JavaScript (JSX), CSS  
**Frameworks:** React, Express, Socket.io  
**Database:** MongoDB  
