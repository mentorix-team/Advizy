import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CategoryNav from "@/components/Home/components/CategoryNav";
import Navbar from "@/components/Home/components/Navbar";
import Footer from "@/components/Home/components/Footer";
import { AnimatePresence } from "framer-motion";
import SearchModal from "@/components/Home/components/SearchModal";

const PayyBookingConfirmation = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCategoryNav, setShowCategoryNav] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [countdown, setCountdown] = useState(7); // 1 hour = 3600 seconds
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Helper function to format countdown time
  const formatCountdown = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  // Extract booking details from URL parameters
  const bookingData = {
    sessionId: searchParams.get('sessionId') || '',
    token: searchParams.get('token') || '',
    expertImage: searchParams.get('expertImage') || '',
    name: searchParams.get('expertName') || '',
    title: searchParams.get('serviceName') || '',
    sessionDuration: searchParams.get('duration') || '',
    price: searchParams.get('amount') || '',
    date: searchParams.get('date') || '',
    time: {
      startTime: searchParams.get('startTime') || '',
      endTime: searchParams.get('endTime') || ''
    }
  };

  // console.log('Extracted booking data from URL:', bookingData);
  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem("firstVisit");
    if (!isFirstVisit) {
      setShowConfetti(true);
      sessionStorage.setItem("firstVisit", "true");
    }

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

    // Cleanup timer on component unmount
    return () => {
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  const handleModalCategorySelect = (category) => {
    if (category.value) {
      navigate(`/explore?category=${category.value}`);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar
            onSearch={() => setIsModalOpen(true)}
            isExpertMode={isExpertMode}
            onToggleExpertMode={handleToggle}
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
            {/* Countdown Message - Positioned at the top */}
            <div className="w-full max-w-lg mb-6">
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center">
                <p className="text-lg font-medium text-gray-700">
                  Redirecting you to dashboard in {formatCountdown(countdown)}...
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
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-100 shadow-xl shadow-emerald-100/50 p-8 w-full max-w-lg backdrop-blur-sm relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-30 -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-transparent rounded-full opacity-30 translate-y-12 -translate-x-12"></div>

              {/* Expert Header */}
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {bookingData.expertImage ? (
                    <div className="relative">
                      <img
                        src={bookingData.expertImage}
                        alt={bookingData.name}
                        className="w-16 h-16 rounded-full object-cover shadow-lg "
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full w-16 h-16 flex justify-center items-center font-bold text-xl shadow-lg ring-4 ring-white">
                        {bookingData.name.charAt(0) || 'E'}
                      </div>
                      {/* <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div> */}
                    </div>
                  )}
                  <div className="ml-4">
                    <span className="font-semibold text-gray-800 text-xl">{bookingData.name}</span>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-500">Verified Expert</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elegant Divider */}
              <hr className="border-gray-200 mb-6" />
              {/* <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-gradient-to-r from-white to-gray-50 px-4">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div> */}

              {/* Confirmation Section */}
              <div className="relative z-10 flex flex-col items-center mb-8">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full w-24 h-24 flex justify-center items-center relative">
                  <div className="absolute inset-0 bg-white rounded-full opacity-20 animate-pulse"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 relative z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-b from-gray-800 to-gray-600 bg-clip-text text-transparent mt-6">
                  Booking Confirmed!
                </h1>
                <p className="text-gray-600 text-lg mt-2 text-center font-medium">{bookingData.title}</p>
                {bookingData.price && (
                  <div className="mt-4 bg-gradient-to-r from-emerald-50 to-emerald-100 px-6 py-3 rounded-xl border border-emerald-200">
                    <p className="text-emerald-700 font-bold text-2xl">₹{bookingData.price}</p>
                  </div>
                )}
              </div>

              {/* Booking Date and Time */}
              <div className="relative z-10 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="font-bold text-gray-800 text-lg">{bookingData.date}</p>
                    <div className="flex items-center mt-1">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <p className="text-gray-500 font-normal">{bookingData.time?.startTime} – {bookingData.time?.endTime}</p>
                    </div>
                    {bookingData.sessionDuration && (
                      <div className="flex items-center mt-2">
                        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          Duration: {bookingData.sessionDuration}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Meeting Details */}
              <div className="relative z-10 mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p className="text-blue-700 text-center font-medium">
                    Meeting details sent to your email & mobile
                  </p>
                </div>
              </div>
            </div>

            {/* Manage Booking Section */}
            <div className="bg-white rounded-lg shadow-lg border-2 shadow-[#b8e7c9] mt-6 p-6 w-full max-w-lg flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer">
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
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategorySelect={handleModalCategorySelect}
      />
    </div>
  );
};

export default PayyBookingConfirmation;