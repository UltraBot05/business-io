// Game Room Manager
// Handles all active game rooms and their state

const rooms = new Map();

// Generate random 5-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude I, O, 0, 1 for clarity
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Player colors for tokens
const playerColors = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316'  // orange
];

class GameRoom {
  constructor(roomCode, host, mapId = 'classic') {
    this.roomCode = roomCode;
    this.host = host;
    this.mapId = mapId;
    this.status = 'waiting'; // waiting, playing, finished
    this.players = [];
    this.currentPlayerIndex = 0;
    this.turnPhase = 'roll'; // roll, buy, end
    this.lastDiceRoll = [0, 0];
    this.createdAt = Date.now();
  }

  addPlayer(playerId, username, socketId) {
    if (this.players.length >= 8) {
      throw new Error('Room is full');
    }

    if (this.players.find(p => p.id === playerId)) {
      throw new Error('Already in room');
    }

    const player = {
      id: playerId,
      username,
      socketId,
      color: playerColors[this.players.length],
      position: 0,
      money: 1500,
      properties: [],
      railroads: [],
      utilities: [],
      inJail: false,
      jailTurns: 0,
      getOutOfJailCards: 0
    };

    this.players.push(player);
    return player;
  }

  removePlayer(playerId) {
    const index = this.players.findIndex(p => p.id === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
      
      // If host left, assign new host
      if (this.host === playerId && this.players.length > 0) {
        this.host = this.players[0].id;
      }
    }
  }

  getPlayer(playerId) {
    return this.players.find(p => p.id === playerId);
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  nextTurn() {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.turnPhase = 'roll';
    this.lastDiceRoll = [0, 0];
  }

  start() {
    if (this.players.length < 2) {
      throw new Error('Need at least 2 players');
    }
    this.status = 'playing';
    this.currentPlayerIndex = 0;
  }

  toJSON() {
    return {
      roomCode: this.roomCode,
      host: this.host,
      mapId: this.mapId,
      status: this.status,
      players: this.players,
      currentPlayerIndex: this.currentPlayerIndex,
      currentPlayer: this.players[this.currentPlayerIndex]?.id,
      turnPhase: this.turnPhase,
      lastDiceRoll: this.lastDiceRoll
    };
  }
}

// Room management functions
export function createRoom(hostId, hostname, mapId) {
  let roomCode;
  do {
    roomCode = generateRoomCode();
  } while (rooms.has(roomCode));

  const room = new GameRoom(roomCode, hostId, mapId);
  rooms.set(roomCode, room);
  
  return room;
}

export function getRoom(roomCode) {
  return rooms.get(roomCode);
}

export function deleteRoom(roomCode) {
  rooms.delete(roomCode);
}

export function getRoomCount() {
  return rooms.size;
}

export function cleanupEmptyRooms() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  for (const [code, room] of rooms.entries()) {
    // Delete rooms with no players or older than 1 hour
    if (room.players.length === 0 || (now - room.createdAt > oneHour)) {
      rooms.delete(code);
    }
  }
}

// Run cleanup every 10 minutes
setInterval(cleanupEmptyRooms, 10 * 60 * 1000);
