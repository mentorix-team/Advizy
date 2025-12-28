import React, { useState, useRef } from 'react';

const ChatInput = ({ onSend, onTyping, onStopTyping, disabled }) => {
    const [text, setText] = useState('');
    const typingRef = useRef(false);
    const stopTimeout = useRef();

    const handleChange = (e) => {
        const val = e.target.value;
        setText(val);
        if (!typingRef.current) {
            typingRef.current = true;
            onTyping?.();
        }
        clearTimeout(stopTimeout.current);
        stopTimeout.current = setTimeout(() => {
            typingRef.current = false;
            onStopTyping?.();
        }, 800);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend?.(trimmed);
        setText('');
        typingRef.current = false;
        onStopTyping?.();
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t">
            <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Type a message"
                className="flex-1 border rounded-md px-3 py-2 focus:outline-none"
                disabled={disabled}
                aria-label="Message input"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md disabled:opacity-50" disabled={disabled}>
                Send
            </button>
        </form>
    );
};

export default ChatInput;
