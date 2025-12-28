import redisClient from '../services/redis.service.js';

export default function registerPresenceSocket(io, socket) {
  socket.on('disconnect', async () => {
    try {
      const userId = socket.user?.id;
      // Mark user offline in Redis
      await redisClient.del(`user:${userId}:online`);
      // Notify all joined rooms
      const rooms = Array.from(socket.data?.joinedRooms || []);
      for (const roomId of rooms) {
        socket.to(roomId).emit('offline', { userId });
      }
      // Cleanup socket mapping
      await redisClient.del(`socket:${socket.id}:user`);
    } catch (err) {
      // swallow
    }
  });
}
