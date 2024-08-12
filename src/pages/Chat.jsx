import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import ChatDisplay from '../components/ChatDisplay'
import RawCacheModal from '../components/RawCacheModal';
import ExtendSessionModal from '../components/Session/ExtendSessionModal';
import SessionManager from '../components/Session/SessionManager';

function Chat() {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);
  const websocketRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [isRawCacheModalOpen, setIsRawCacheModalOpen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Open WebSocket connection
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log('Token obtained:', token); // Debug: Log token

        const wsUrl = `${import.meta.env.VITE_WS_BASE_URL}/ws?token=${encodeURIComponent(token)}&sessionId=${encodeURIComponent(sessionId)}`;
        console.log('Attempting to connect to WebSocket:', wsUrl); // Debug: Log WebSocket URL

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('WebSocket connected successfully');
        };

        ws.onmessage = (event) => {
          console.log('WebSocket message received:', event.data); // Debug: Log received messages
          const message = JSON.parse(event.data);
          if (message.type === 'ai') {
            if (message.content === '[END]') {
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.type === 'ai' && lastMessage.isPartial) {
                  newMessages[newMessages.length - 1] = { 
                    ...lastMessage, 
                    isPartial: false,
                    content: lastMessage.content.trim()
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
                  newMessages[newMessages.length - 1] = {
                    ...lastMessage,
                    content: lastMessage.content + message.content,
                  };
                } else {
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
          } else if (message.type === 'session_status') {
            console.log('Session status update received:', message.content); // Debug: Log session status
            const status = JSON.parse(message.content);
            
            if (status.status === 'warning') {
              setShowWarning(true);
              setIsExtensionModalOpen(true);
              setTimeRemaining(status.timeRemaining);
            } else if (status.status === 'expired') {
              handleSessionExpired();
            }
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
        };

        ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
        };

        websocketRef.current = ws;
      } catch (error) {
        console.error('Error in connectWebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (websocketRef.current) {
        console.log('Closing WebSocket connection'); // Debug: Log when closing
        websocketRef.current.close();
      }
    };
  }, [getAccessTokenSilently, sessionId]);


  const terminateSession = useCallback(async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log('Terminating session:', sessionId); // Debug: Log termination attempt
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/terminate`,
        { session_id: sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Session terminated successfully'); // Debug: Log successful termination
    } catch (error) {
      console.error('Error terminating session:', error);
    }
  }, [getAccessTokenSilently, sessionId]);

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

    console.log('Sending message:', message); // Debug: Log outgoing message
    websocketRef.current.send(JSON.stringify(message));
    setInputMessage('');
  };

  const handleTerminateChat = async () => {
    try {
      await terminateSession();
      navigate('/contextBuilder');
    } catch (error) {
      console.error('Error terminating chat:', error);
    }
  };

  const handleRawCacheClick = (e) => {
    e.preventDefault();
    setIsRawCacheModalOpen(true);
  };

  const handleSessionWarning = useCallback((timeRemaining) => {
    console.log('Session warning received, time remaining:', timeRemaining); // Debug: Log warning
    setShowWarning(true);
    setIsExtensionModalOpen(true);
    setTimeRemaining(timeRemaining);
  }, []);

  const handleSessionExpired = useCallback(() => {
    console.log('Session expired'); // Debug: Log expiration
    setIsTerminateModalOpen(true);
    setIsLoading(true);
  }, []);

  const handleExtensionConfirm = useCallback(() => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      console.log('Sending session extension request'); // Debug: Log extension request
      websocketRef.current.send(JSON.stringify({ type: 'extend_session', sessionId }));
    }
    setIsExtensionModalOpen(false);
    setShowWarning(false);
    setTimeRemaining(null);
  }, [sessionId]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Session</h1>
        <SessionManager 
        sessionId={sessionId}
        onSessionExpired={handleSessionExpired}
        onWarning={handleSessionWarning}
        websocket={websocketRef.current}
      />
        <button
          onClick={() => setIsTerminateModalOpen(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Terminate Chat
        </button>
      </div>
      {showWarning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-bold">Warning</p>
          <p>Your session is about to expire. Please save any important information.</p>
        </div>
      )}
      <ChatDisplay messages={messages} isActiveChat={true} onRawCacheClick={handleRawCacheClick}/>

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
      <RawCacheModal
        sessionId={sessionId}
        isOpen={isRawCacheModalOpen}
        onClose={() => setIsRawCacheModalOpen(false)}
      />
  
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
      <ExtendSessionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        onConfirm={handleExtensionConfirm}
        timeRemaining={timeRemaining}
      />
    </div>
  );
}

export default Chat;