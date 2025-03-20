import React from 'react'
import BankAccountPopup from './BankAccountPopup'

const PaymentHeader = () => {
  return (
    <div>
      <nav className="flex flex-wrap justify-between items-center p-4 bg-white rounded-lg shadow-sm mb-6">
        <h1 className="font-bold text-xl sm:text-2xl">Payments & Earnings</h1>
        <div className="mt-2 sm:mt-0">
          <BankAccountPopup />
        </div>
      </nav>
    </div>
  );
  
  
}

export default PaymentHeader;
