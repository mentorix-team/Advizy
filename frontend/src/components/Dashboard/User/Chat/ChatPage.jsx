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
    const onlineUsers = useSelector(selectOnlineUsers);
    const authUser = useSelector((state) => state.auth?.user);
    const role = authUser?.role || (authUser?.admin_approved_expert ? 'expert' : 'user');

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
                    role={role}
                    onlineUsers={onlineUsers}
                />
            </div>
        </div>
    );
};

export default ChatPage;
