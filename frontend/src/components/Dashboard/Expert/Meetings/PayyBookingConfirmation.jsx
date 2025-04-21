import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import { useLocation, useNavigate } from "react-router-dom";
import CategoryNav from "@/components/Home/components/CategoryNav";
import Navbar from "@/components/Home/components/Navbar";
import Footer from "@/components/Home/components/Footer";
import { AnimatePresence } from "framer-motion";
import SearchModal from "@/components/Home/components/SearchModal";
import { useDispatch } from "react-redux";
// import { success } from "@/Redux/Slices/Payu.slice";
import success  from "@/Redux/Slices/paymentSlice"

const PayyBookingConfirmation = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCategoryNav, setShowCategoryNav] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPaymentAndLoadData = async () => {
      try {
        // Extract data from URL parameters
        const searchParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get('sessionId');
        const token = searchParams.get('token');

        if (!sessionId || !token) {
          throw new Error('Invalid booking confirmation');
        }

        // Verify payment with backend
        const verification = await dispatch(success({ sessionId, token })).unwrap();
        
        if (!verification.success) {
          throw new Error('Payment verification failed');
        }

        // Get booking data from verification response or location state
        const data = verification.bookingDetails || location.state;
        
        if (!data) {
          throw new Error('Booking data not found');
        }

        setBookingData(data);
        setShowConfetti(true);
        setLoading(false);

        // Countdown timer
        const countdownInterval = setInterval(() => {
          setCountdown((prevCount) => {
            if (prevCount <= 1) {
              clearInterval(countdownInterval);
              navigate('/dashboard/user/meetings');
              return 0;
            }
            return prevCount - 1;
          });
        }, 1000);

        return () => clearInterval(countdownInterval);

      } catch (error) {
        console.error('Payment verification error:', error);
        navigate('/payment-failed', { state: { error: error.message } });
      }
    };

    verifyPaymentAndLoadData();
  }, [location, navigate, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold">Booking not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const { image, name, title, sessionDuration, price, date, time } = bookingData;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar
            onSearch={() => setIsModalOpen(true)}
            isExpertMode={isExpertMode}
            onToggleExpertMode={() => setIsExpertMode(!isExpertMode)}
          />
        </div>
      </div>

      {/* Category Navigation */}
      <AnimatePresence>
        {showCategoryNav && <CategoryNav categories={categories} />}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            {/* Countdown Message */}
            <div className="w-full max-w-lg mb-6">
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
                <p className="text-lg font-medium text-gray-700">
                  Redirecting you to dashboard in {countdown} seconds...
                </p>
              </div>
            </div>

            {/* Confetti Explosion */}
            {showConfetti && (
              <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50">
                <ConfettiExplosion
                  force={0.6}
                  duration={3000}
                  particleCount={150}
                  width={500}
                />
              </div>
            )}

            {/* Booking Confirmation Card */}
            <div className="bg-white rounded-lg border-2 shadow-[#b8e7c9] shadow-lg p-8 w-full max-w-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img 
                    src={image} 
                    alt={name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="ml-3 font-medium text-gray-700 text-lg">{name}</span>
                </div>
              </div>

              <hr className="my-6 border-gray-200" />

              {/* Confirmation Section */}
              <div className="flex flex-col items-center mt-6">
                <div className="bg-green-500 text-white rounded-full w-20 h-20 flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold text-gray-800 mt-6">
                  Booking confirmed
                </h1>
                <p className="text-gray-600 text-lg mt-2">{title}</p>
              </div>

              {/* Booking Date and Time */}
              <div className="flex items-center border border-gray-200 rounded-lg p-6 mt-8 bg-gray-50">
                <Calendar className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="font-medium text-gray-800 text-lg">{date}</p>
                  <p className="text-gray-500 mt-1">{time?.startTime}–{time?.endTime}</p>
                </div>
              </div>

              {/* Meeting Details */}
              <p className="text-gray-500 text-center mt-6">
                Meeting details are sent to your Email and Mobile number
              </p>
            </div>

            {/* Manage Booking Section */}
            <div 
              className="bg-white rounded-lg shadow-lg border-2 shadow-[#b8e7c9] mt-6 p-6 w-full max-w-lg flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate('/dashboard/user/meetings')}
            >
              <span className="font-medium text-gray-800 text-lg">Manage booking</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Search Modal */}
      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default PayyBookingConfirmation;