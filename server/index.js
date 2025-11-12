// server/index.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import './config/passport.js';
import { createRoom, getRoom, deleteRoom, scheduleDelete, cancelScheduledDelete } from './game/roomManager.js';
import { rollDice, movePlayer, getSpaceAt, canBuyProperty, buyProperty, calculateRent, payRent, handleSpecialSpace } from './game/gameLogic.js';
import { getMap } from './game/maps.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Socket.io connection handling with socket -> player mapping
const socketToPlayer = new Map(); // socketId -> { roomCode, playerId }

// Helper: register socket mapping after adding player to room
function registerSocketPlayer(socketId, roomCode, playerId) {
  socketToPlayer.set(socketId, { roomCode, playerId });
  // Someone joined => cancel scheduled deletion for that room
  cancelScheduledDelete(roomCode);
}

// Helper: unregister mapping and schedule deletion if room empty
function handleSocketLeave(socketId, explicit = false) {
  const mapping = socketToPlayer.get(socketId);
  if (!mapping) return;
  const { roomCode, playerId } = mapping;
  const room = getRoom(roomCode);
  if (!room) {
    socketToPlayer.delete(socketId);
    return;
  }

  // Remove player from room state
  room.removePlayer(playerId);

  // Remove mapping
  socketToPlayer.delete(socketId);

  if (room.players.length === 0) {
    // schedule delete with grace period
    scheduleDelete(roomCode, 10000); // 10 seconds
    console.log(`Room ${roomCode} scheduled for deletion (empty)`);
  } else {
    // notify remaining players
    io.to(roomCode).emit('player-left', {
      players: room.players,
      username: playerId // best effort - server may not have username easily here
    });
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create room
  socket.on('create-room', ({ userId, username, mapId }) => {
    try {
      const room = createRoom(userId, username, mapId || 'classic');
      const player = room.addPlayer(userId, username, socket.id);

      socket.join(room.roomCode);

      // Register mapping and cancel scheduled deletion if any
      registerSocketPlayer(socket.id, room.roomCode, userId);

      socket.emit('room-created', {
        roomCode: room.roomCode,
        room: room.toJSON(),
        player
      });

      console.log(`Room ${room.roomCode} created by ${username}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Join room
  socket.on('join-room', ({ roomCode, userId, username }) => {
    try {
      const room = getRoom(roomCode);
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }

      // If playerId already present (e.g., reconnect attempt) and same id exists, treat specially
      if (room.players.find(p => p.id === userId)) {
        // Update socketId if rejoining after temporary disconnect
        const existing = room.players.find(p => p.id === userId);
        existing.socketId = socket.id;
        registerSocketPlayer(socket.id, roomCode, userId);
      } else {
        const player = room.addPlayer(userId, username, socket.id);
        registerSocketPlayer(socket.id, roomCode, userId);
      }

      socket.join(roomCode);

      const map = getMap(room.mapId);

      socket.emit('room-joined', {
        gameState: {
          ...room.toJSON(),
          map
        },
        players: room.players
      });

      // Notify others
      socket.to(roomCode).emit('player-joined', {
        players: room.players,
        username
      });

      console.log(`${username} joined room ${roomCode}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Rejoin handler (client reconnect case or page refresh)
  socket.on('rejoin-room', ({ roomCode, userId, username }) => {
    try {
      const room = getRoom(roomCode);
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }

      // If user exists, update socketId; otherwise add
      const existing = room.players.find(p => p.id === userId);
      if (existing) {
        existing.socketId = socket.id;
      } else {
        room.addPlayer(userId, username, socket.id);
      }

      registerSocketPlayer(socket.id, roomCode, userId);
      socket.join(roomCode);

      const map = getMap(room.mapId);

      // Send full game state including current turn info
      socket.emit('room-joined', {
        gameState: {
          ...room.toJSON(),
          map
        },
        players: room.players,
        currentPlayer: room.getCurrentPlayer()?.id
      });

      // Only notify others if this is a new player
      if (!existing) {
        socket.to(roomCode).emit('player-joined', {
          players: room.players,
          username
        });
      }

      console.log(`${username} ${existing ? 'rejoined' : 'joined'} room ${roomCode}`);
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  // Leave room (explicit)
  socket.on('leave-room', ({ roomCode }) => {
    try {
      const mapping = socketToPlayer.get(socket.id);
      if (!mapping) return;
      const { playerId } = mapping;
      const room = getRoom(roomCode);
      if (!room) return;

      room.removePlayer(playerId);
      socket.leave(roomCode);
      socketToPlayer.delete(socket.id);

      if (room.players.length === 0) {
        scheduleDelete(roomCode, 10000);
        console.log(`Room ${roomCode} scheduled for deletion (explicit leave)`);
      } else {
        io.to(roomCode).emit('player-left', {
          players: room.players,
          username: playerId
        });
      }
    } catch (err) {
      socket.emit('error', { message: err.message });
    }
  });

  // Start game
  socket.on('start-game', ({ roomCode }) => {
    try {
      const room = getRoom(roomCode);
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return socket.emit('error', { message: 'Player not found in room' });
      if (player.id !== room.host) {
        return socket.emit('error', { message: 'Only host can start' });
      }

      room.start();
      const map = getMap(room.mapId);

      io.to(roomCode).emit('game-started', {
        gameState: {
          ...room.toJSON(),
          map
        },
        players: room.players,
        currentPlayer: room.getCurrentPlayer().id
      });

      console.log(`Game started in room ${roomCode}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Roll dice
  socket.on('roll-dice', ({ roomCode }) => {
    try {
      const room = getRoom(roomCode);
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return socket.emit('error', { message: 'Player not found in room' });

      const currentPlayer = room.getCurrentPlayer();

      if (player.id !== currentPlayer.id) {
        return socket.emit('error', { message: 'Not your turn' });
      }

      if (room.turnPhase !== 'roll') {
        return socket.emit('error', { message: 'Already rolled' });
      }

      const dice = rollDice(player.id);
      const total = dice[0] + dice[1];
      room.lastDiceRoll = dice;
      room.turnPhase = 'buy';

      const moveResult = movePlayer(player, total);
      const map = getMap(room.mapId);
      const space = getSpaceAt(player.position, map);

      io.to(roomCode).emit('dice-rolled', {
        dice,
        total,
        username: player.username
      });

      io.to(roomCode).emit('player-moved', {
        gameState: {
          ...room.toJSON(),
          map
        },
        players: room.players,
        space,
        passedGo: moveResult.passedGo
      });

      if (space.type !== 'property') {
        const actions = handleSpecialSpace(player, space);
        io.to(roomCode).emit('special-space', {
          space,
          actions,
          player: player.username
        });
      }

      console.log(`${player.username} rolled ${total} in room ${roomCode}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Buy property
  socket.on('buy-property', ({ roomCode }) => {
    try {
      const room = getRoom(roomCode);
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return socket.emit('error', { message: 'Player not found in room' });

      const currentPlayer = room.getCurrentPlayer();

      if (player.id !== currentPlayer.id) {
        return socket.emit('error', { message: 'Not your turn' });
      }

      const map = getMap(room.mapId);
      const space = getSpaceAt(player.position, map);

      if (!canBuyProperty(player, space)) {
        return socket.emit('error', { message: 'Cannot buy this property' });
      }

      buyProperty(player, space);

      io.to(roomCode).emit('property-bought', {
        gameState: {
          ...room.toJSON(),
          map
        },
        players: room.players,
        property: space,
        username: player.username
      });

      console.log(`${player.username} bought ${space.name} in room ${roomCode}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // End turn
  socket.on('end-turn', ({ roomCode }) => {
    try {
      const room = getRoom(roomCode);
      if (!room) {
        return socket.emit('error', { message: 'Room not found' });
      }

      const player = room.players.find(p => p.socketId === socket.id);
      if (!player) return socket.emit('error', { message: 'Player not found in room' });

      const currentPlayer = room.getCurrentPlayer();

      if (player.id !== currentPlayer.id) {
        return socket.emit('error', { message: 'Not your turn' });
      }

      room.nextTurn();
      const nextPlayer = room.getCurrentPlayer();

      io.to(roomCode).emit('turn-changed', {
        currentPlayer: nextPlayer.id,
        username: nextPlayer.username,
        turnPhase: room.turnPhase
      });

      console.log(`Turn changed to ${nextPlayer.username} in room ${roomCode}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Disconnect handler: remove player mapping and schedule room deletion if empty
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Handle leaving
    handleSocketLeave(socket.id, /*explicit=*/ false);
  });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Socket.io ready for connections`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

export { io };
