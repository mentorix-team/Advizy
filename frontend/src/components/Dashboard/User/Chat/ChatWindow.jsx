import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

const ChatWindow = ({
  room,
  messages,
  typingUsers,
  onlineUsers,
  currentUserId,
  onSendMessage,
  onTyping,
  onStopTyping,
}) => {
  const listRef = useRef(null);

  useEffect(() => {
    // scroll to bottom on messages update
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const participantId = room && (String(room.userId) === String(currentUserId) ? room.expertId : room.userId);
  const isParticipantOnline = participantId && onlineUsers?.[participantId];

  return (
    <div className="flex flex-col h-full">
      {room ? (
        <>
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Chat</h3>
              <span className={`ml-2 inline-block w-2 h-2 rounded-full ${isParticipantOnline ? 'bg-green-500' : 'bg-gray-400'}`} aria-label={isParticipantOnline ? 'Online' : 'Offline'} />
            </div>
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
            {messages?.map((m) => (
              <MessageBubble key={m._id} message={m} currentUserId={currentUserId} />
            ))}
            {typingUsers && typingUsers.length > 0 && (
              <div className="text-xs text-gray-500">{typingUsers.join(', ')} typing...</div>
            )}
          </div>
          <ChatInput onSend={onSendMessage} onTyping={onTyping} onStopTyping={onStopTyping} disabled={!room} />
        </>
      ) : (
        <div className="flex-1 grid place-items-center text-gray-500">Select a chat to start messaging</div>
      )}
    </div>
  );
};

export default ChatWindow;
