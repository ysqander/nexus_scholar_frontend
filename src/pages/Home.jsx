import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  return (
    <div className="container mx-auto px-4 mt-6 sm:mt-10 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
        Welcome to Nexus Scholar
      </h1>
      <p className="mb-4 text-sm sm:text-base">
        Explore and analyze Arxiv research papers with ease.
      </p>
      <img
        src="papers.webp"
        alt="Researcher gathering papers"
        className="mx-auto mt-4 sm:mt-6 max-w-full sm:max-w-md"
      />
    </div>
  )
}

export default Home
