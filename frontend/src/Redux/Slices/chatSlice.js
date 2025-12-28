import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// API base — uses Vite env if available, else localhost
const API_BASE = import.meta?.env?.VITE_BACKEND_URL || 'http://localhost:5030';
const api = axios.create({ baseURL: API_BASE, withCredentials: true });

const initialState = {
    rooms: [],
    activeRoom: null,
    messages: [],
    typingUsers: {}, // { [roomId]: [userId] }
    onlineUsers: {}, // { [userId]: true }
    loading: false,
    error: null,
};

// Thunks (REST only)
export const fetchChatRooms = createAsyncThunk(
    'chat/fetchRooms',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('/api/v1/chat/rooms');
            const rooms = Array.isArray(res?.data?.rooms) ? res.data.rooms : [];
            // Sort DESC by lastMessageAt
            rooms.sort((a, b) => {
                const ta = a?.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                const tb = b?.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                return tb - ta;
            });
            return rooms;
        } catch (err) {
            return rejectWithValue(err?.response?.data || { message: 'Failed to fetch chat rooms' });
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async ({ roomId, page = 1, limit = 20 }, { rejectWithValue }) => {
        try {
            if (!roomId) throw new Error('roomId is required');
            const res = await api.get(`/api/v1/chat/${roomId}/messages`, { params: { page, limit } });
            const messages = Array.isArray(res?.data?.messages) ? res.data.messages : [];
            const pagination = res?.data?.pagination || { page, limit, total: messages.length, totalPages: 1 };
            return { roomId, messages, pagination };
        } catch (err) {
            return rejectWithValue(err?.response?.data || { message: 'Failed to fetch messages' });
        }
    }
);

export const markAsRead = createAsyncThunk(
    'chat/markAsRead',
    async ({ roomId }, { getState, rejectWithValue }) => {
        try {
            if (!roomId) throw new Error('roomId is required');
            const res = await api.patch(`/api/v1/chat/${roomId}/read`);
            const updatedCount = res?.data?.updatedCount || 0;
            const lastReadAt = res?.data?.lastReadAt || new Date().toISOString();

            // Optimistic update details
            const state = getState();
            const currentUserId = state?.auth?.user?._id || state?.auth?.user?.id || null;
            return { roomId, updatedCount, lastReadAt, currentUserId };
        } catch (err) {
            return rejectWithValue(err?.response?.data || { message: 'Failed to mark messages as read' });
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveRoom(state, action) {
            const nextRoom = action.payload || null;
            const currentId = state.activeRoom?._id;
            const nextId = nextRoom?._id;
            state.activeRoom = nextRoom;
            if (currentId !== nextId) {
                state.messages = [];
            }
        },
        addMessage(state, action) {
            const msg = action.payload;
            if (!msg) return;
            const activeId = state.activeRoom?._id;
            if (msg.chatRoomId && activeId && msg.chatRoomId === activeId) {
                state.messages.push(msg);
            }
            // Update lastMessage in room list and reorder
            const idx = state.rooms.findIndex(r => r._id === (msg.chatRoomId || activeId));
            if (idx !== -1) {
                state.rooms[idx].lastMessage = msg.content;
                state.rooms[idx].lastMessageAt = msg.createdAt || new Date().toISOString();
                // Move room to top by resorting
                state.rooms.sort((a, b) => {
                    const ta = a?.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
                    const tb = b?.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
                    return tb - ta;
                });
            }
        },
        setTypingUsers(state, action) {
            const { roomId, users } = action.payload || {};
            if (!roomId) return;
            const unique = Array.isArray(users) ? Array.from(new Set(users.map(String))) : [];
            state.typingUsers[roomId] = unique;
        },
        setOnlineUsers(state, action) {
            const { userId, isOnline } = action.payload || {};
            if (!userId) return;
            if (isOnline) {
                state.onlineUsers[userId] = true;
            } else {
                delete state.onlineUsers[userId];
            }
        },
        clearChatState() {
            return { ...initialState };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChatRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChatRooms.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = action.payload || [];
            })
            .addCase(fetchChatRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                const { roomId, messages } = action.payload || {};
                // Replace messages only if matches activeRoom
                if (roomId && state.activeRoom?._id === roomId) {
                    state.messages = messages || [];
                }
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const { currentUserId } = action.payload || {};
                if (!currentUserId) return;
                // Optimistically mark as read for messages not sent by current user
                state.messages = state.messages.map(m => (
                    m?.senderId && String(m.senderId) !== String(currentUserId)
                        ? { ...m, isRead: true }
                        : m
                ));
            })
            .addCase(markAsRead.rejected, (state, action) => {
                state.error = action.payload || action.error;
            });
    },
});

export const {
    setActiveRoom,
    addMessage,
    setTypingUsers,
    setOnlineUsers,
    clearChatState,
} = chatSlice.actions;

// Selectors
export const selectRooms = (state) => state.chat.rooms;
export const selectActiveRoom = (state) => state.chat.activeRoom;
export const selectMessages = (state) => state.chat.messages;
export const selectTypingUsers = (state, roomId) => state.chat.typingUsers[roomId] || [];
export const selectOnlineUsers = (state) => state.chat.onlineUsers;

export default chatSlice.reducer;
