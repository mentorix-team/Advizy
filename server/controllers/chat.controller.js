import {
    createOrGetChatRoom,
    fetchChatRooms,
    fetchChatMessages,
    markMessagesRead,
} from '../services/chat.service.js';

export async function createChatRoom(req, res, next) {
    try {
        const { bookingId } = req.body || {};
        const userId = req.user?.id || req.user?._id;
        const room = await createOrGetChatRoom(userId, bookingId);
        return res.status(200).json({ success: true, room });
    } catch (err) {
        return next(err);
    }
}

export async function getChatRooms(req, res, next) {
    try {
        const userId = req.user?.id || req.user?._id;
        const role = req.user?.role;
        const rooms = await fetchChatRooms(userId, role);
        return res.status(200).json({ success: true, rooms });
    } catch (err) {
        return next(err);
    }
}

export async function getChatMessages(req, res, next) {
    try {
        const { roomId } = req.params;
        const userId = req.user?.id || req.user?._id;
        const { page = 1, limit = 20 } = req.query;

        const { messages, pagination } = await fetchChatMessages(roomId, userId, { page, limit });
        return res.status(200).json({ success: true, messages, pagination });
    } catch (err) {
        return next(err);
    }
}

export async function markMessagesAsRead(req, res, next) {
    try {
        const { roomId } = req.params;
        const userId = req.user?.id || req.user?._id;
        const result = await markMessagesRead(roomId, userId);
        return res.status(200).json({ success: true, ...result });
    } catch (err) {
        return next(err);
    }
}

export default {
    createChatRoom,
    getChatRooms,
    getChatMessages,
    markMessagesAsRead,
};
