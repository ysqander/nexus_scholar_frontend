import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import AccountInfo from '../components/Account/AccountInfo'
import TokenSummary from '../components/Account/TokenSummary'
import PurchaseForm from '../components/Account/PurchaseForm'

function Account() {
  const { isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return (
      <div className="text-center retro-font">
        Please log in to view your account.
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 retro-font">Account</h1>
      <div className="space-y-8">
        <AccountInfo />
        <TokenSummary />
        <PurchaseForm />
      </div>
    </div>
  )
}

export default Account
