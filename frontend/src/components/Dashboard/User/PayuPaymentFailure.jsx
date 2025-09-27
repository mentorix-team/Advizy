import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Home/components/Navbar';
import Footer from '@/components/Home/components/Footer';

const PayuPaymentFailure = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const reason = params.get('reason') || 'unknown';

  const getErrorMessage = (reason) => {
    switch (reason) {
      case 'hash':
        return 'Payment verification failed due to security reasons. Please contact support.';
      case 'session':
        return 'Payment session not found. Please try again.';
      case 'verification_failed':
        return 'Payment verification failed. Please contact support.';
      case 'invalid_token':
        return 'Invalid payment verification token. Please try again.';
      default:
        return 'Payment failed. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
          <p className="text-gray-700 mb-6">{getErrorMessage(reason)}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PayuPaymentFailure;