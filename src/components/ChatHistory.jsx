import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import ChatDisplay from './ChatDisplay';  // Import the new ChatDisplay component

function ChatHistory() {
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChatSessions(response.data.chat_history);
      } catch (error) {
        setError('Failed to load chat history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [getAccessTokenSilently]);

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  if (loading) {
    return <div>Loading chat history...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Chat History</h1>
      <div className="flex">
        <div className="w-1/3 pr-4">
          {chatSessions.length === 0 ? (
            <p>You haven't started any chat sessions yet.</p>
          ) : (
            <ul className="space-y-4">
              {chatSessions.map((session) => (
                <li 
                  key={session.session_id} 
                  className={`border p-4 rounded-lg shadow-sm cursor-pointer ${
                    selectedSession && selectedSession.session_id === session.session_id
                      ? 'bg-blue-100'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSessionClick(session)}
                >
                  <p className="font-semibold">
                    Chat Session {session.session_id.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-gray-500">
                    Started: {new Date(session.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Messages: {session.messages.length}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="w-2/3 pl-4">
          {selectedSession ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Chat Session {selectedSession.session_id.slice(0, 8)}...
              </h2>
              <div className="bg-white rounded-lg shadow">
                <ChatDisplay messages={selectedSession.messages} />
              </div>
            </div>
          ) : (
            <p>Select a chat session to view the conversation.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatHistory;