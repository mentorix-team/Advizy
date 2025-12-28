import redisClient from './redis.service.js';

const PRESENCE_TTL_SECONDS = 60; // refresh on activity
const TYPING_TTL_SECONDS = 10;   // short-lived typing indicator
const READ_TTL_SECONDS = 24 * 60 * 60; // 24 hours

// Presence helpers
export async function setUserOnline(userId) {
  if (!userId) return false;
  try {
    await redisClient.set(`user:${userId}:online`, '1');
    await redisClient.expire(`user:${userId}:online`, PRESENCE_TTL_SECONDS);
    return true;
  } catch (err) {
    console.error('Redis setUserOnline error:', err?.message || err);
    return false;
  }
}

export async function setUserOffline(userId) {
  if (!userId) return false;
  try {
    await redisClient.set(`user:${userId}:online`, '0');
    await redisClient.expire(`user:${userId}:online`, PRESENCE_TTL_SECONDS);
    return true;
  } catch (err) {
    console.error('Redis setUserOffline error:', err?.message || err);
    return false;
  }
}

export async function isUserOnline(userId) {
  if (!userId) return false;
  try {
    const val = await redisClient.get(`user:${userId}:online`);
    return val === '1';
  } catch (err) {
    console.error('Redis isUserOnline error:', err?.message || err);
    return false;
  }
}

// Typing helpers (SET of userIds)
export async function addTypingUser(roomId, userId) {
  if (!roomId || !userId) return false;
  try {
    await redisClient.sAdd(`chat:${roomId}:typing`, userId.toString());
    await redisClient.expire(`chat:${roomId}:typing`, TYPING_TTL_SECONDS);
    return true;
  } catch (err) {
    console.error('Redis addTypingUser error:', err?.message || err);
    return false;
  }
}

export async function removeTypingUser(roomId, userId) {
  if (!roomId || !userId) return false;
  try {
    await redisClient.sRem(`chat:${roomId}:typing`, userId.toString());
    // keep short TTL so it auto-expires if inactive
    await redisClient.expire(`chat:${roomId}:typing`, TYPING_TTL_SECONDS);
    return true;
  } catch (err) {
    console.error('Redis removeTypingUser error:', err?.message || err);
    return false;
  }
}

export async function getTypingUsers(roomId) {
  if (!roomId) return [];
  try {
    const members = await redisClient.sMembers(`chat:${roomId}:typing`);
    return Array.isArray(members) ? members : [];
  } catch (err) {
    console.error('Redis getTypingUsers error:', err?.message || err);
    return [];
  }
}

// Read receipts (timestamp per user per room)
export async function setLastRead(roomId, userId) {
  if (!roomId || !userId) return null;
  try {
    const ts = new Date().toISOString();
    await redisClient.set(`read:${roomId}:${userId}`, ts);
    await redisClient.expire(`read:${roomId}:${userId}`, READ_TTL_SECONDS);
    return ts;
  } catch (err) {
    console.error('Redis setLastRead error:', err?.message || err);
    return null;
  }
}

export async function getLastRead(roomId, userId) {
  if (!roomId || !userId) return null;
  try {
    const ts = await redisClient.get(`read:${roomId}:${userId}`);
    return ts || null;
  } catch (err) {
    console.error('Redis getLastRead error:', err?.message || err);
    return null;
  }
}

// Socket ↔ User mapping
export async function mapSocketToUser(socketId, userId) {
  if (!socketId || !userId) return false;
  try {
    await redisClient.set(`socket:${socketId}:user`, userId.toString());
    // optional safety TTL to avoid leaks; removal should happen on disconnect
    await redisClient.expire(`socket:${socketId}:user`, READ_TTL_SECONDS);
    return true;
  } catch (err) {
    console.error('Redis mapSocketToUser error:', err?.message || err);
    return false;
  }
}

export async function removeSocketMapping(socketId) {
  if (!socketId) return false;
  try {
    await redisClient.del(`socket:${socketId}:user`);
    return true;
  } catch (err) {
    console.error('Redis removeSocketMapping error:', err?.message || err);
    return false;
  }
}

export async function getUserIdBySocket(socketId) {
  if (!socketId) return null;
  try {
    const userId = await redisClient.get(`socket:${socketId}:user`);
    return userId || null;
  } catch (err) {
    console.error('Redis getUserIdBySocket error:', err?.message || err);
    return null;
  }
}

export default {
  setUserOnline,
  setUserOffline,
  isUserOnline,
  addTypingUser,
  removeTypingUser,
  getTypingUsers,
  setLastRead,
  getLastRead,
  mapSocketToUser,
  removeSocketMapping,
  getUserIdBySocket,
};
