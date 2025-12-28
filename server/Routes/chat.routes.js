import { Router } from 'express';
import { isLoggedIn } from '../middlewares/auth.middleare.js';
import {
    createChatRoom,
    getChatRooms,
    getChatMessages,
    markMessagesAsRead,
} from '../controllers/chat.controller.js';

const router = Router();

// Create or get a chat room after successful booking & payment
router.post('/chat/room', isLoggedIn, createChatRoom);

// Fetch chat rooms for logged-in user/expert
router.get('/chat/rooms', isLoggedIn, getChatRooms);

// Fetch messages with pagination
router.get('/chat/:roomId/messages', isLoggedIn, getChatMessages);

// Mark messages as read and store lastRead in Redis
router.patch('/chat/:roomId/read', isLoggedIn, markMessagesAsRead);

export default router;
