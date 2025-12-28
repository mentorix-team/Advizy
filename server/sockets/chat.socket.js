import redisClient from '../services/redis.service.js';
import ChatRoom from '../config/model/chat/chatRoom.model.js';
import Message from '../config/model/chat/message.model.js';
import { Meeting } from '../config/model/meeting/meeting.model.js';
import { isParticipant } from '../utils/chatPermissions.util.js';

const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 3000;
const RATE_LIMIT_MAX_MSGS = 5;

const sanitizeText = (input) => {
  if (typeof input !== 'string') return '';
  let s = input.replace(/<[^>]*>/g, ''); // strip HTML tags
  s = s.replace(/[\u0000-\u001f]/g, ''); // strip control chars
  s = s.trim();
  if (s.length > MAX_MESSAGE_LENGTH) s = s.slice(0, MAX_MESSAGE_LENGTH);
  return s;
};

async function ensureAuthorizedRoom(roomId, userId) {
  if (!roomId) {
    const err = new Error('roomId is required');
    err.statusCode = 400;
    throw err;
  }

  const room = await ChatRoom.findById(roomId).lean();
  if (!room) {
    const err = new Error('Chat room not found');
    err.statusCode = 404;
    throw err;
  }
  if (!isParticipant(room, userId)) {
    const err = new Error('Forbidden');
    err.statusCode = 403;
    throw err;
  }

  // Extra safety: block cancelled or unpaid bookings
  const booking = await Meeting.findById(room.bookingId).lean();
  if (!booking || booking.status === 'cancelled' || !booking.isPayed) {
    const err = new Error('Chat not available for this booking');
    err.statusCode = 403;
    throw err;
  }

  return room;
}

export default function registerChatSocket(io, socket) {
  // Join a chat room
  socket.on('join-room', async (payload = {}) => {
    try {
      const { roomId } = payload;
      const userId = socket.user?.id;

      const room = await ensureAuthorizedRoom(roomId, userId);

      // Leave any previously joined rooms to prevent duplicates
      try {
        const prevRooms = Array.from(socket.data.joinedRooms || []);
        for (const prev of prevRooms) {
          if (prev !== roomId) {
            socket.leave(prev);
            socket.data.joinedRooms.delete(prev);
          }
        }
      } catch (_) {}

      if (socket.data.joinedRooms.has(roomId)) return;

      socket.join(roomId);
      socket.data.joinedRooms.add(roomId);

      // Mark user online in Redis
      try {
        await redisClient.set(`user:${userId}:online`, '1');
      } catch (e) {
        // Redis unavailable — continue without presence
      }

      // Notify other participant
      try {
        socket.to(roomId).emit('online', { userId });
      } catch (e) {}
    } catch (err) {
      // Avoid leaking details, send a generic error event
      socket.emit('error', { message: 'Unable to join room' });
    }
  });

  // Send a message
  socket.on('send-message', async (payload = {}) => {
    try {
      const { roomId, content, messageType } = payload;
      const userId = socket.user?.id;
      const role = socket.user?.role;

      // Rate-limit basic bursts per socket
      try {
        const now = Date.now();
        socket.data.messageTimes = (socket.data.messageTimes || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
        if (socket.data.messageTimes.length >= RATE_LIMIT_MAX_MSGS) {
          socket.emit('error', { message: 'Rate limited' });
          return;
        }
        socket.data.messageTimes.push(now);
      } catch (_) {}

      const trimmed = sanitizeText(content);
      if (!trimmed) return; // Prevent empty/whitespace-only
      // Strict type: only 'text' allowed
      const safeType = messageType === 'text' ? 'text' : 'text';

      await ensureAuthorizedRoom(roomId, userId);

      const msg = await Message.create({
        chatRoomId: roomId,
        senderId: userId,
        senderRole: role,
        messageType: safeType,
        content: trimmed,
        isRead: false,
      });

      await ChatRoom.findByIdAndUpdate(roomId, {
        $set: { lastMessage: trimmed, lastMessageAt: new Date() },
      });

      // Emit only to the other participant
      try {
        socket.to(roomId).emit('receive-message', {
          _id: msg._id,
          chatRoomId: msg.chatRoomId,
          senderId: msg.senderId,
          senderRole: msg.senderRole,
          messageType: msg.messageType,
          content: msg.content,
          isRead: msg.isRead,
          createdAt: msg.createdAt,
        });
      } catch (_) {}
    } catch (err) {
      socket.emit('error', { message: 'Unable to send message' });
    }
  });

  // Typing indicator
  socket.on('typing', async (payload = {}) => {
    try {
      const { roomId } = payload;
      const userId = socket.user?.id;

      await ensureAuthorizedRoom(roomId, userId);
      try {
        await redisClient.set(`chat:${roomId}:typing`, userId);
        await redisClient.expire(`chat:${roomId}:typing`, 10);
      } catch (_) {
        // Redis unavailable — skip storing typing, but still notify
      }
      try { socket.to(roomId).emit('typing', { userId }); } catch (_) {}
    } catch (err) {
      // silent fail
    }
  });

  socket.on('stop-typing', async (payload = {}) => {
    try {
      const { roomId } = payload;
      const userId = socket.user?.id;
      await ensureAuthorizedRoom(roomId, userId);
      try { await redisClient.del(`chat:${roomId}:typing`); } catch (_) {}
      try { socket.to(roomId).emit('stop-typing', { userId }); } catch (_) {}
    } catch (err) {
      // silent fail
    }
  });

  // Read receipt
  socket.on('read-receipt', async (payload = {}) => {
    try {
      const { roomId } = payload;
      const userId = socket.user?.id;
      await ensureAuthorizedRoom(roomId, userId);
      const ts = new Date().toISOString();
      try { await redisClient.set(`chat:lastRead:${roomId}:${userId}`, ts); } catch (_) {}
      try { socket.to(roomId).emit('read-receipt', { userId, timestamp: ts }); } catch (_) {}
    } catch (err) {
      // silent fail
    }
  });
}
