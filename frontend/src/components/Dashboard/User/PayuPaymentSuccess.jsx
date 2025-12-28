import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyPayment } from '@/Redux/Slices/Payu.slice';
import Spinner from '@/components/LoadingSkeleton/Spinner';
import Navbar from '@/components/Home/components/Navbar';
import Footer from '@/components/Home/components/Footer';

const PayuPaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Safely get the payu state with a fallback to an empty object
  const payuState = useSelector((state) => state.payu || {});
  const { loading: verifyLoading, error: verifyError, verificationResult } = payuState;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('sessionId');
    const token = params.get('token');

    if (sessionId && token) {
      dispatch(verifyPayment({ sessionId, token }));
    } else {
      setError('Missing payment verification parameters');
      setLoading(false);
    }
  }, [location, dispatch]);

  useEffect(() => {
    if (verificationResult) {
      setLoading(false);
      // Handle successful payment verification
      // console.log('Payment verified successfully:', verificationResult);
    }
  }, [verificationResult]);

  useEffect(() => {
    if (verifyError) {
      setLoading(false);
      setError(verifyError);
    }
  }, [verifyError]);

  if (loading || verifyLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Spinner />
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
          <p className="text-gray-700 mb-6">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PayuPaymentSuccess;