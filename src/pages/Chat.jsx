import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

function Chat() {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const websocketRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  
  const sendHeartbeat = useCallback(() => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ type: 'heartbeat', sessionId }));
    }
  }, [sessionId]);

  const terminateSession = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/terminate`,
        { session_id: sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  }, [getAccessTokenSilently, sessionId]);

  useEffect(() => {
    const connectWebSocket = async () => {
      const token = await getAccessTokenSilently();
      const ws = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}/ws?token=${token}`);

      ws.onopen = () => {
        console.log('WebSocket connected');
        // Start sending heartbeats
        heartbeatIntervalRef.current = setInterval(sendHeartbeat, 30000);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'ai') {
          if (message.content === '[END]') {
            // End of message signal
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.type === 'ai' && lastMessage.isPartial) {
                newMessages[newMessages.length - 1] = { 
                  ...lastMessage, 
                  isPartial: false,
                  content: lastMessage.content.trim() // Trim any trailing space
                };
              }
              return newMessages;
            });
            setIsLoading(false);
          } else {
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.type === 'ai' && lastMessage.isPartial) {
                // Append new chunk to the existing message
                newMessages[newMessages.length - 1] = {
                  ...lastMessage,
                  content: lastMessage.content + message.content,
                };
              } else {
                // Start a new AI message
                newMessages.push({ 
                  type: 'ai', 
                  content: message.content, 
                  isPartial: true 
                });
              }
              return newMessages;
            });
          }
        } else if (message.type === 'user') {
          setMessages(prev => [...prev, { type: 'user', content: message.content }]);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Clear heartbeat interval on disconnect
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
      };

      websocketRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [getAccessTokenSilently, sendHeartbeat, terminateSession, sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !websocketRef.current) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { type: 'user', content: inputMessage }]);

    const message = {
      type: 'message',
      content: inputMessage,
      sessionId: sessionId
    };

    websocketRef.current.send(JSON.stringify(message));
    setInputMessage('');
  };

  const handleTerminateChat = async () => {
    try {
      const token = await getAccessTokenSilently();
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/terminate`,
        {
          session_id: sessionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Error terminating chat:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Session</h1>
        <button
          onClick={() => setIsTerminateModalOpen(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Terminate Chat
        </button>
      </div>
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
      </div>
      <form onSubmit={sendMessage} className="p-4 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
  
      {/* Terminate Chat Confirmation Modal */}
      {isTerminateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Termination</h3>
            <p className="mb-4">
              Are you sure you want to terminate this chat session? The cached data will be deleted and cannot be recovered.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsTerminateModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleTerminateChat}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Terminate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
