// src/socket/socket.js
// Production-ready Socket.IO client singleton integrating with Redux

import { io } from 'socket.io-client';
import store from '@/Redux/store.js';
import {
  addMessage,
  setTypingUsers,
  setOnlineUsers,
  selectActiveRoom,
  selectTypingUsers,
} from '@/Redux/Slices/chatSlice.js';

let socket = null;
let currentToken = null;
let currentRoomId = null;
let isConnecting = false;

// Resolve SOCKET_URL from Vite or environment
const resolveSocketUrl = () => {
  try {
    const viteUrl = import.meta?.env?.VITE_SOCKET_URL || import.meta?.env?.SOCKET_URL;
    if (viteUrl) return viteUrl;
  } catch (e) {
    // ignore
  }
  const winUrl = typeof window !== 'undefined' ? window.SOCKET_URL : undefined;
  const nodeUrl = typeof process !== 'undefined' ? process.env?.SOCKET_URL : undefined;
  return winUrl || nodeUrl || 'http://localhost:5030';
};

const defaultOptions = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 500,
  reconnectionDelayMax: 5000,
  transports: ['websocket'],
};

const attachCoreListeners = () => {
  if (!socket) return;

  socket.on('connect', () => {
    // Rejoin active room on (re)connect
    const state = store.getState();
    const activeRoom = selectActiveRoom(state);
    if (activeRoom?._id) {
      tryJoinRoom(activeRoom._id);
    }
  });

  socket.on('disconnect', (reason) => {
    // Log only; do not clear Redux state
    console.warn('[socket] disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[socket] connect_error:', err?.message || err);
  });

  // --- Chat domain events ---
  socket.on('receive-message', (msg) => {
    try {
      store.dispatch(addMessage(msg));
    } catch (e) {
      console.error('[socket] receive-message dispatch failed', e);
    }
  });

  socket.on('typing', (payload) => {
    try {
      const { roomId, userId, users } = payload || {};
      if (!roomId) return;
      let nextUsers = users;
      if (!Array.isArray(nextUsers)) {
        const state = store.getState();
        const existing = selectTypingUsers(state, roomId) || [];
        const set = new Set(existing.map(String));
        if (userId) set.add(String(userId));
        nextUsers = Array.from(set);
      }
      store.dispatch(setTypingUsers({ roomId, users: nextUsers }));
    } catch (e) {
      console.error('[socket] typing dispatch failed', e);
    }
  });

  socket.on('stop-typing', (payload) => {
    try {
      const { roomId, userId, users } = payload || {};
      if (!roomId) return;
      let nextUsers = users;
      if (!Array.isArray(nextUsers)) {
        const state = store.getState();
        const existing = selectTypingUsers(state, roomId) || [];
        nextUsers = existing.filter((id) => String(id) !== String(userId));
      }
      store.dispatch(setTypingUsers({ roomId, users: nextUsers }));
    } catch (e) {
      console.error('[socket] stop-typing dispatch failed', e);
    }
  });

  socket.on('online', (payload) => {
    const { userId } = payload || {};
    if (!userId) return;
    try {
      store.dispatch(setOnlineUsers({ userId: String(userId), isOnline: true }));
    } catch (e) {
      console.error('[socket] online dispatch failed', e);
    }
  });

  socket.on('offline', (payload) => {
    const { userId } = payload || {};
    if (!userId) return;
    try {
      store.dispatch(setOnlineUsers({ userId: String(userId), isOnline: false }));
    } catch (e) {
      console.error('[socket] offline dispatch failed', e);
    }
  });

  socket.on('read-receipt', (payload) => {
    // Payload shape typically { roomId, userId, lastReadAt }
    // We keep this for future extension; chatSlice currently doesn't expose a reducer for it.
    // Intentionally avoid mutating Redux without a defined reducer.
    console.debug('[socket] read-receipt', payload);
  });
};

const ensureSingleton = () => {
  if (socket) return socket;
  const url = resolveSocketUrl();
  socket = io(url, defaultOptions);
  attachCoreListeners();
  return socket;
};

const tryConnect = (token) => {
  if (!token) {
    console.warn('[socket] No token provided; skipping connect');
    return null;
  }
  const s = ensureSingleton();
  if (s.connected || isConnecting) return s;
  isConnecting = true;
  currentToken = token;
  try {
    s.auth = { token: currentToken };
    s.connect();
  } finally {
    // Let socket.io handle the async connection; reset flag shortly after
    setTimeout(() => { isConnecting = false; }, 50);
  }
  return s;
};

const disconnect = () => {
  if (!socket) return;
  try {
    socket.disconnect();
  } catch (e) {
    console.error('[socket] disconnect error', e);
  }
};

// Room lifecycle: leave previous before joining new
const tryJoinRoom = (roomId) => {
  if (!socket || !socket.connected) return;
  if (!roomId) return;
  if (currentRoomId && currentRoomId === roomId) return;
  // If backend supports leave, emit; otherwise just join the next
  try {
    // Best-effort leave (ignored if server doesn't handle it)
    if (currentRoomId) {
      socket.emit('stop-typing', { roomId: currentRoomId });
    }
    socket.emit('join-room', { roomId });
    currentRoomId = roomId;
  } catch (e) {
    console.error('[socket] join-room error', e);
  }
};

// --- Emit helpers ---
const sendMessage = ({ roomId, content, messageType = 'text' }) => {
  if (!socket || !socket.connected) return;
  if (!roomId || !content) return;
  socket.emit('send-message', { roomId, content, messageType });
};

const typing = ({ roomId }) => {
  if (!socket || !socket.connected) return;
  if (!roomId) return;
  socket.emit('typing', { roomId });
};

const stopTyping = ({ roomId }) => {
  if (!socket || !socket.connected) return;
  if (!roomId) return;
  socket.emit('stop-typing', { roomId });
};

const readReceipt = ({ roomId }) => {
  if (!socket || !socket.connected) return;
  if (!roomId) return;
  socket.emit('read-receipt', { roomId });
};

// Public API
export const socketClient = {
  // Initialize and connect with JWT (auth.token)
  connect: (token) => tryConnect(token),
  disconnect: () => disconnect(),
  isConnected: () => !!(socket && socket.connected),
  getInstance: () => socket || null,
  // Room lifecycle
  joinRoom: (roomId) => tryJoinRoom(roomId),
  // Emitters
  sendMessage,
  typing,
  stopTyping,
  readReceipt,
};

export default socketClient;
