import ChatRoom from '../config/model/chat/chatRoom.model.js';
import Message from '../config/model/chat/message.model.js';
import { Meeting } from '../config/model/meeting/meeting.model.js';
import redisClient from '../services/redis.service.js';
import { isParticipant, throwForbiddenIfUnauthorized } from '../utils/chatPermissions.util.js';

export async function createOrGetChatRoom(userId, bookingId) {
  if (!bookingId) {
    const err = new Error('bookingId is required');
    err.statusCode = 400;
    throw err;
  }

  const meeting = await Meeting.findById(bookingId).lean();
  if (!meeting) {
    const err = new Error('Booking not found');
    err.statusCode = 404;
    throw err;
  }

  if (meeting.status === 'cancelled') {
    const err = new Error('Booking is cancelled');
    err.statusCode = 400;
    throw err;
  }

  if (!meeting.isPayed) {
    const err = new Error('Payment not completed');
    err.statusCode = 402;
    throw err;
  }

  // Authorization: only participants may create/access chat room
  if (userId) {
    const isUserParticipant = [meeting.userId?.toString(), meeting.expertId?.toString()].includes(userId.toString());
    if (!isUserParticipant) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }
  }

  // Idempotent creation: upsert ensures single room per booking
  const now = new Date();
  try {
    const room = await ChatRoom.findOneAndUpdate(
      { bookingId },
      {
        $setOnInsert: {
          userId: meeting.userId,
          expertId: meeting.expertId,
          bookingId: meeting._id,
          lastMessage: null,
          lastMessageAt: null,
          createdAt: now,
          updatedAt: now,
        },
      },
      { new: true, upsert: true }
    ).lean();
    return room;
  } catch (err) {
    // Handle possible race conditions due to unique index
    try {
      const existing = await ChatRoom.findOne({ bookingId }).lean();
      if (existing) return existing;
    } catch (_) {
      // ignore lookup errors
    }
    throw err;
  }
}

export async function fetchChatRooms(userId, role) {
  if (!userId || !role) {
    const err = new Error('Unauthorized');
    err.statusCode = 401;
    throw err;
  }

  const filter = role === 'expert' ? { expertId: userId } : { userId };
  const rooms = await ChatRoom.find(filter)
    .sort({ lastMessageAt: -1, updatedAt: -1, createdAt: -1 })
    .populate({ path: 'userId', select: 'firstName lastName name avatar profileImage image' })
    .populate({ path: 'expertId', select: 'firstName lastName name avatar profileImage image' })
    .lean();

  // Filter out rooms with invalid bookings (cancelled/unpaid)
  const bookingIds = rooms.map(r => r.bookingId).filter(Boolean);
  const bookings = await Meeting.find({ _id: { $in: bookingIds } }).select('isPayed status').lean();
  const bookingMap = new Map(bookings.map(b => [b._id.toString(), b]));

  // Minimal shape with safe fallbacks
  return rooms
    .filter(r => {
      const b = bookingMap.get(r.bookingId?.toString());
      return b && b.isPayed && b.status !== 'cancelled';
    })
    .map(r => ({
    _id: r._id,
    userId: r.userId?._id || r.userId,
    expertId: r.expertId?._id || r.expertId,
    bookingId: r.bookingId,
    lastMessage: r.lastMessage || null,
    lastMessageAt: r.lastMessageAt || r.updatedAt || r.createdAt || null,
    user: r.userId ? {
      id: r.userId?._id,
      name: r.userId?.name || [r.userId?.firstName, r.userId?.lastName].filter(Boolean).join(' ') || null,
      avatar: r.userId?.avatar || r.userId?.profileImage || r.userId?.image || null,
    } : null,
    expert: r.expertId ? {
      id: r.expertId?._id,
      name: r.expertId?.name || [r.expertId?.firstName, r.expertId?.lastName].filter(Boolean).join(' ') || null,
      avatar: r.expertId?.avatar || r.expertId?.profileImage || r.expertId?.image || null,
    } : null,
  }));
}

export async function fetchChatMessages(roomId, userId, { page = 1, limit = 20 } = {}) {
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

  throwForbiddenIfUnauthorized(room, userId);

  // Booking validation: block cancelled/unpaid bookings
  const booking = await Meeting.findById(room.bookingId).select('isPayed status').lean();
  if (!booking || !booking.isPayed || booking.status === 'cancelled') {
    const err = new Error('Chat not available for this booking');
    err.statusCode = 403;
    throw err;
  }

  const numericPage = Math.max(parseInt(page, 10) || 1, 1);
  const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const skip = (numericPage - 1) * numericLimit;

  const [total, items] = await Promise.all([
    Message.countDocuments({ chatRoomId: roomId }),
    Message.find({ chatRoomId: roomId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(numericLimit)
      .lean(),
  ]);

  const totalPages = Math.ceil(total / numericLimit) || 1;

  return {
    messages: items,
    pagination: {
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages,
    },
  };
}

export async function markMessagesRead(roomId, userId) {
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

  throwForbiddenIfUnauthorized(room, userId);

  const result = await Message.updateMany(
    { chatRoomId: roomId, isRead: false, senderId: { $ne: userId } },
    { $set: { isRead: true } }
  );

  const lastReadAt = new Date().toISOString();
  try {
    await redisClient.set(`chat:lastRead:${roomId}:${userId}`, lastReadAt);
  } catch (err) {
    // Log but do not fail API if Redis write fails
    console.error('Redis write failed for lastRead', err?.message || err);
  }

  return { updatedCount: result.modifiedCount || 0, lastReadAt };
}

export default {
  createOrGetChatRoom,
  fetchChatRooms,
  fetchChatMessages,
  markMessagesRead,
};
