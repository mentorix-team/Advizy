import React from 'react'
import BankAccountPopup from './BankAccountPopup'

const PaymentHeader = () => {
  return (
    <div>
      <nav className='flex justify-between p-4 items-center bg-white rounded-lg shadow-sm mb-6'>
        <h1 className='font-bold text-2xl'>Payments & Earnings</h1>
        <BankAccountPopup/>
      </nav>
    </div>
  )
}

export default PaymentHeader;
