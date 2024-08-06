import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './pages/Home';
import ContextBuilder from './pages/ContextBuilder';
import Account from './pages/Account';
import Chat from './pages/Chat';
import ChatHistory from './components/ChatHistory';
import StripeSuccess from './pages/StripeSuccess';

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div>NexusScholar</div>
          <div className="space-x-4">
            <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link>
            {isAuthenticated && (
              <>
                <Link to="/contextBuilder" className="text-blue-500 hover:text-blue-700">Context Builder</Link>
                <Link to="/chatHistory" className="text-blue-500 hover:text-blue-700">Chat History</Link>
                <Link to="/account" className="text-blue-500 hover:text-blue-700">Account</Link>
              </>
            )}
            {isAuthenticated ? (
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contextBuilder" element={<ContextBuilder />} />
        <Route path="/account" element={<Account />} />
        <Route path="/chat/:sessionId" element={<Chat />} />
        <Route path="/chatHistory" element={<ChatHistory />} />
        <Route path="/stripesuccess" element={<StripeSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
