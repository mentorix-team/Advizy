import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, fetchMessages, setActiveRoom, addMessage, selectRooms, selectActiveRoom, selectMessages, selectOnlineUsers } from '@/Redux/Slices/chatSlice';
import { socketClient } from '@/socket/socket';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
    const dispatch = useDispatch();
    const [socketConnected, setSocketConnected] = useState(false);
    const rooms = useSelector(selectRooms);
    const activeRoom = useSelector(selectActiveRoom);
    const messages = useSelector(selectMessages);
    const onlineUsers = useSelector(selectOnlineUsers);
    const authUserRaw = useSelector((state) => state.auth?.data);
    
    // Parse authUser if it's a string (from localStorage)
    const authUser = typeof authUserRaw === 'string' ? JSON.parse(authUserRaw || '{}') : authUserRaw;
    const currentUserId = authUser?._id || authUser?.id;
    const role = authUser?.role?.toLowerCase() || 'user';
    
    // Get typing users for active room - memoize to prevent rerenders
    const activeRoomId = activeRoom?._id;
    const typingUsersMap = useSelector((state) => state.chat.typingUsers);
    const typingUsers = activeRoomId ? (typingUsersMap[activeRoomId] || []) : [];

    // Connect socket on mount (uses cookies for auth)
    useEffect(() => {
        const socket = socketClient.connect();
        
        // Listen for connection
        const checkConnection = () => {
            if (socketClient.isConnected()) {
                setSocketConnected(true);
            }
        };
        
        // Check immediately and set up listener
        checkConnection();
        const instance = socketClient.getInstance();
        if (instance) {
            instance.on('connect', () => setSocketConnected(true));
            instance.on('disconnect', () => setSocketConnected(false));
        }
        
        return () => {
            // Don't disconnect on unmount to keep presence
        };
    }, []);

    // Join room when active room changes AND socket is connected
    useEffect(() => {
        if (activeRoom?._id && socketConnected) {
            console.log('[ChatPage] Joining room:', activeRoom._id);
            socketClient.joinRoom(activeRoom._id);
        }
    }, [activeRoom?._id, socketConnected]);

    useEffect(() => {
        dispatch(fetchChatRooms());
    }, [dispatch]);

    useEffect(() => {
        if (activeRoom?._id) {
            dispatch(fetchMessages({ roomId: activeRoom._id }));
        }
    }, [dispatch, activeRoom?._id]);

    const handleSelectRoom = (room) => {
        dispatch(setActiveRoom(room));
    };

    const handleSendMessage = (text) => {
        if (!activeRoom?._id || !text.trim()) return;
        
        // Send via socket
        socketClient.sendMessage({
            roomId: String(activeRoom._id),
            content: text.trim(),
            messageType: 'text'
        });
        
        // Optimistically add message to UI with string IDs
        const optimisticMsg = {
            _id: `temp-${Date.now()}`,
            chatRoomId: String(activeRoom._id),
            senderId: String(currentUserId),
            senderRole: role,
            content: text.trim(),
            messageType: 'text',
            isRead: false,
            createdAt: new Date().toISOString(),
        };
        dispatch(addMessage(optimisticMsg));
    };

    const handleTyping = () => {
        if (activeRoom?._id) {
            socketClient.typing({ roomId: activeRoom._id });
        }
    };

    const handleStopTyping = () => {
        if (activeRoom?._id) {
            socketClient.stopTyping({ roomId: activeRoom._id });
        }
    };

    // Debug log
    useEffect(() => {
        console.log('[ChatPage] authUser:', authUser);
        console.log('[ChatPage] currentUserId:', currentUserId);
        console.log('[ChatPage] role:', role);
        console.log('[ChatPage] rooms:', rooms);
        console.log('[ChatPage] messages:', messages);
    }, [authUser, currentUserId, role, rooms, messages]);

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-gray-50">
            <div className="md:w-1/3 w-full border-r bg-white">
                <ChatList
                    rooms={rooms}
                    activeRoom={activeRoom}
                    onlineUsers={onlineUsers}
                    role={role}
                    currentUserId={currentUserId}
                    onSelectRoom={handleSelectRoom}
                />
            </div>
            <div className="md:w-2/3 w-full">
                <ChatWindow
                    room={activeRoom}
                    messages={messages}
                    typingUsers={typingUsers}
                    role={role}
                    currentUserId={currentUserId}
                    onlineUsers={onlineUsers}
                    onSendMessage={handleSendMessage}
                    onTyping={handleTyping}
                    onStopTyping={handleStopTyping}
                />
            </div>
        </div>
    );
};

export default ChatPage;
