import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function Profile() {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div>
        <img src={user.picture} alt={user.name} className="rounded-full w-32 h-32 mb-4" />
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  );
}

export default Profile;