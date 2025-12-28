import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, fetchMessages, setActiveRoom, selectRooms, selectActiveRoom, selectMessages, selectTypingUsers, selectOnlineUsers } from '@/Redux/Slices/chatSlice';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
    const dispatch = useDispatch();
    const rooms = useSelector(selectRooms);
    const activeRoom = useSelector(selectActiveRoom);
    const messages = useSelector(selectMessages);
    const typingUsers = useSelector(selectTypingUsers);
    const onlineUsers = useSelector(selectOnlineUsers);
    const authUser = useSelector((state) => state.auth?.user);
    const role = 'expert';
    const currentUserId = authUser?._id || authUser?.id || localStorage.getItem('userId');

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
        // Socket send handled elsewhere; placeholder hook
        console.log('Send message', { roomId: activeRoom?._id, text });
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row bg-gray-50">
            <div className="md:w-1/3 w-full border-r bg-white">
                <ChatList
                    rooms={rooms}
                    activeRoom={activeRoom}
                    onlineUsers={onlineUsers}
                    role={role}
                    onSelectRoom={handleSelectRoom}
                />
            </div>
            <div className="md:w-2/3 w-full">
                <ChatWindow
                    room={activeRoom}
                    messages={messages}
                    typingUsers={typingUsers}
                    onlineUsers={onlineUsers}
                    currentUserId={currentUserId}
                    onSendMessage={handleSendMessage}
                    onTyping={() => { }}
                    onStopTyping={() => { }}
                />
            </div>
        </div>
    );
};

export default ChatPage;
