import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

function ChatDisplay({ messages, isActiveChat = false, onRawCacheClick }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isActiveChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isActiveChat]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-800'
            }`}
          >
            {message.type === 'ai' ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              message.content
            )}
            {message.isPartial && <span className="animate-pulse">▋</span>}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
      {isActiveChat && (
        <div className="text-center mt-4">
          <a
            href="#"
            onClick={onRawCacheClick}
            className="text-blue-500 hover:underline"
          >
            View Raw Cache
          </a>
        </div>
      )}
    </div>
  );
}

export default ChatDisplay;