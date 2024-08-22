import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Nexus Scholar</h1>
      <p className="mb-4">
        Explore and analyze Arxiv research papers with ease.
      </p>
    </div>
  )
}

export default Home
