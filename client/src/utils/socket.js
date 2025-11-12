// client/src/utils/socket.js
// Singleton socket instance with controlled connect/disconnect and helpful logging.

import { io } from 'socket.io-client';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

let socket = null;

export function createSocket() {
  if (socket) return socket;

  socket = io(BACKEND, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.debug('[socket] connected', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.debug('[socket] disconnected', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[socket] connect_error', err?.message || err);
  });

  return socket;
}

// Return existing socket or create one lazily
export function getSocket() {
  return socket || createSocket();
}

// Explicit connect helper (idempotent)
export function ensureConnected() {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
}

// Explicit disconnect (rarely used in SPA)
export function safeDisconnect() {
  if (!socket) return;
  try {
    socket.disconnect();
  } catch (e) {
    console.warn('[socket] safeDisconnect error', e);
  }
}

// Default export for backward compat
createSocket();
export { socket as _legacySocket }; // don't rely on this - use getSocket()
