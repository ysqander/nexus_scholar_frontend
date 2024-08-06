import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function AccountInfo() {
  const { user } = useAuth0();

  return (
    <div className="mb-8">
      <img src={user.picture} alt={user.name} className="rounded-full w-32 h-32 mb-4" />
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

export default AccountInfo;