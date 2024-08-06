import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import AccountInfo from '../components/Account/AccountInfo';
import TokenSummary from '../components/Account/TokenSummary';
import PurchaseForm from '../components/Account/PurchaseForm';

function Account() {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <div>Please log in to view your account.</div>;
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Account</h1>
      <AccountInfo />
      <TokenSummary />
      <PurchaseForm />
    </div>
  );
}

export default Account;