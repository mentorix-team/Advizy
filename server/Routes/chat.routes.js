import { Router } from 'express';
import { isLoggedIn, isUserOrExpert } from '../middlewares/auth.middleare.js';
import {
    createChatRoom,
    getChatRooms,
    getChatMessages,
    markMessagesAsRead,
} from '../controllers/chat.controller.js';

const router = Router();

// Create or get a chat room after successful booking & payment
router.post('/chat/room', isUserOrExpert, createChatRoom);

// Fetch chat rooms for logged-in user/expert
router.get('/chat/rooms', isUserOrExpert, getChatRooms);

// Fetch messages with pagination
router.get('/chat/:roomId/messages', isUserOrExpert, getChatMessages);

// Mark messages as read and store lastRead in Redis
router.patch('/chat/:roomId/read', isUserOrExpert, markMessagesAsRead);

export default router;
