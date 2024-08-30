import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

function AccountInfo() {
  const { user } = useAuth0()

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-gray-300">
      <div className="flex flex-col sm:flex-row items-center">
        <img
          src={user.picture}
          alt={user.name}
          className="rounded-full w-24 h-24 mb-4 sm:mb-0 sm:mr-6 border-2 border-gray-300"
        />
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold mb-2 retro-font">{user.name}</h2>
          <p className="text-gray-600 retro-font">{user.email}</p>
        </div>
      </div>
    </div>
  )
}

export default AccountInfo
