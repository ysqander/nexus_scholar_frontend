import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import RetroMacLayout from './components/RetroMacLayout'
import Home from './pages/Home'
import ContextBuilder from './pages/ContextBuilder'
import Account from './pages/Account'
import Chat from './pages/Chat'
import ChatHistory from './pages/ChatHistory'
import Success from './pages/Success'
import Start from './pages/Start'
import ErrorBoundary from './components/Errors/ErrorBoundary'
import HealthCheck from './pages/HealthCheck'

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && location.pathname === '/') {
      navigate('/start')
    }
  }, [isAuthenticated, location, navigate])

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
    navigate('/')
  }

  const handleLogin = () => {
    loginWithRedirect()
  }

  return (
    <ErrorBoundary>
      <RetroMacLayout
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      >
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/start" element={<Start />} />
            <Route path="/contextBuilder" element={<ContextBuilder />} />
            <Route path="/account" element={<Account />} />
            <Route path="/chat/:sessionId" element={<Chat />} />
            <Route path="/chatHistory" element={<ChatHistory />} />
            <Route path="/stripesuccess" element={<Success />} />
            <Route path="/healthcheck" element={<HealthCheck />} />
          </Routes>
        </ErrorBoundary>
      </RetroMacLayout>
    </ErrorBoundary>
  )
}

export default App
