import React from 'react';

const MessageBubble = ({ message, currentUserId }) => {
    const isMine = String(message.senderId) === String(currentUserId);
    const bubbleClass = isMine ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-900';
    const containerClass = isMine ? 'justify-end' : 'justify-start';

    const formatTs = (ts) => {
        if (!ts) return '';
        const d = new Date(ts);
        return d.toLocaleString(undefined, { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`flex ${containerClass} mb-2`}>
            <div className={`max-w-[70%] px-3 py-2 rounded-2xl ${bubbleClass}`}>
                {message.messageType === 'image' ? (
                    <img src={message.content} alt="image" className="rounded-md max-h-64" />
                ) : (
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                )}
                <div className="mt-1 text-[10px] opacity-80 text-right">{formatTs(message.createdAt)}</div>
            </div>
        </div>
    );
};

export default MessageBubble;
