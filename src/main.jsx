import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import './index.css'
// Log the environment variables
console.log('Auth0 Domain:', import.meta.env.VITE_AUTH0_DOMAIN)
console.log('Auth0 Client ID:', import.meta.env.VITE_AUTH0_CLIENT_ID)
console.log('Auth0 Audience:', import.meta.env.VITE_AUTH0_AUDIENCE)
console.log('Redirect URI:', window.location.origin)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
    >
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  </React.StrictMode>
)
