import React from 'react';

const ChatList = ({ rooms, activeRoom, onlineUsers, role, currentUserId, onSelectRoom }) => {
    const getParticipant = (room) => {
        if (!room) return { name: 'Unknown', avatar: null, id: null };
        
        // Show the OTHER participant, not yourself
        // Compare current user's ID with room's expertId to determine who to show
        const isCurrentUserTheExpert = currentUserId && 
            (String(room.expertId) === String(currentUserId) || 
             String(room.expert?.id) === String(currentUserId));
        
        if (isCurrentUserTheExpert) {
            // Current user is the expert, so show the user
            return room.user || { name: 'User', avatar: null, id: room.userId };
        } else {
            // Current user is the user, so show the expert
            return room.expert || { name: 'Expert', avatar: null, id: room.expertId };
        }
    };

    const formatTime = (ts) => {
        if (!ts) return '';
        const d = new Date(ts);
        return d.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
    };

    return (
        <div className="h-full overflow-y-auto">
            <div className="px-4 py-3 border-b sticky top-0 bg-white">
                <h2 className="text-lg font-semibold">Chats</h2>
            </div>

            {rooms?.length === 0 && (
                <div className="p-6 text-center text-gray-500">No chats yet</div>
            )}

            <ul className="divide-y">
                {rooms?.map((room) => {
                    const participant = getParticipant(room);
                    const isActive = activeRoom?._id === room._id;
                    const isOnline = participant?.id && onlineUsers?.[participant.id];
                    return (
                        <li
                            key={room._id}
                            className={`px-4 py-3 cursor-pointer ${isActive ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                            onClick={() => onSelectRoom?.(room)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && onSelectRoom?.(room)}
                            aria-selected={isActive}
                        >
                            <div className="flex items-start gap-3">
                                <div className="relative">
                                    <img
                                        src={participant?.avatar || '/avatar.png'}
                                        alt={participant?.name || 'Participant'}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <span className={`absolute -bottom-0 -right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} aria-label={isOnline ? 'Online' : 'Offline'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium truncate">{participant?.name || 'Unknown'}</p>
                                        <span className="text-xs text-gray-500">{formatTime(room.lastMessageAt)}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">{room.lastMessage || 'No messages yet'}</p>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ChatList;
