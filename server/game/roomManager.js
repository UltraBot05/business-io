// server/game/roomManager.js
// Game Room Manager with scheduled delete (grace period)

const rooms = new Map();
const scheduledDeletes = new Map(); // roomCode -> timeoutId

// Generate random 5-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude I, O, 0, 1 for clarity
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const playerColors = [
  '#ef4444', '#3b82f6', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
];

class GameRoom {
  constructor(roomCode, host, mapId = 'classic') {
    this.roomCode = roomCode;
    this.host = host;
    this.mapId = mapId;
    this.status = 'waiting';
    this.players = [];
    this.currentPlayerIndex = 0;
    this.turnPhase = 'roll';
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
    if (this.players.length === 0) return;
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

// Room functions
export function createRoom(hostId, hostname, mapId) {
  let roomCode;
  do {
    roomCode = generateRoomCode();
  } while (rooms.has(roomCode));

  const room = new GameRoom(roomCode, hostId, mapId);
  rooms.set(roomCode, room);

  // Cancel any scheduled delete if present (just in case)
  cancelScheduledDelete(roomCode);

  return room;
}

export function getRoom(roomCode) {
  return rooms.get(roomCode);
}

// Hard delete immediately
export function deleteRoom(roomCode) {
  if (!rooms.has(roomCode)) return;
  rooms.delete(roomCode);
  cancelScheduledDelete(roomCode);
}

// Schedule deletion after `delayMs` if still empty
export function scheduleDelete(roomCode, delayMs = 10000) {
  // If already scheduled, no-op
  if (scheduledDeletes.has(roomCode)) return;

  const timeoutId = setTimeout(() => {
    const room = rooms.get(roomCode);
    if (!room) {
      scheduledDeletes.delete(roomCode);
      return;
    }
    if (room.players.length === 0) {
      rooms.delete(roomCode);
      console.log(`Room ${roomCode} deleted after grace period`);
    }
    scheduledDeletes.delete(roomCode);
  }, delayMs);

  scheduledDeletes.set(roomCode, timeoutId);
}

// Cancel scheduled deletion (e.g., someone joined)
export function cancelScheduledDelete(roomCode) {
  const tid = scheduledDeletes.get(roomCode);
  if (tid) {
    clearTimeout(tid);
    scheduledDeletes.delete(roomCode);
    console.debug(`Canceled scheduled delete for room ${roomCode}`);
  }
}

export function getRoomCount() {
  return rooms.size;
}

export function cleanupEmptyRooms() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  for (const [code, room] of rooms.entries()) {
    if (room.players.length === 0 || (now - room.createdAt > oneHour)) {
      rooms.delete(code);
    }
  }
}

setInterval(cleanupEmptyRooms, 10 * 60 * 1000);
