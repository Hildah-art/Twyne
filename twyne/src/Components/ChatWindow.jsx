import React, { useState } from 'react';
import mockMessages from '../data/mockMessages';
import MessageInput from './MessageInput';

const ChatWindow = ({ currentUserId = 1, matchUserId = 2 }) => {
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      senderId: currentUserId,
      receiverId: matchUserId,
      content: text,
      sentAt: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="chat-window">
      <div className="message-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${msg.senderId === currentUserId ? 'sent' : 'received'}`}
          >
            <p>{msg.content}</p>
            <span className="timestamp">
              {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
