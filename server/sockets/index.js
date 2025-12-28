import { Server } from 'socket.io';
import redisClient from '../services/redis.service.js';
import socketAuth from './auth.middleware.js';
import registerChatSocket from './chat.socket.js';
import registerPresenceSocket from './presence.socket.js';

export function initSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on('connection', async (socket) => {
    try {
      socket.data.joinedRooms = new Set();
      // Map socket to user in Redis
      try {
        await redisClient.set(`socket:${socket.id}:user`, socket.user?.id);
      } catch (_) {
        // Redis unavailable — proceed without mapping
      }

      registerPresenceSocket(io, socket);
      registerChatSocket(io, socket);
    } catch (err) {
      console.error('Socket connection error:', err?.message || err);
      socket.disconnect(true);
    }
  });

  return io;
}

export default initSockets;
