import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import ConfettiExplosion from "react-confetti-explosion";
import CategoryNav from "@/components/Home/components/CategoryNav";
import Navbar from "@/components/Home/components/Navbar";
import Footer from "@/components/Home/components/Footer";
import { AnimatePresence } from "framer-motion";
import SearchModal from "@/components/Home/components/SearchModal";

const BookingConfirmation = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCategoryNav, setShowCategoryNav] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);

  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem("firstVisit");
    if (!isFirstVisit) {
      setShowConfetti(true);
      sessionStorage.setItem("firstVisit", "true");
    }
  }, []);

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
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
                  <div className="bg-red-600 text-white rounded-full w-12 h-12 flex justify-center items-center font-bold text-lg">
                    er
                  </div>
                  <span className="ml-3 font-medium text-gray-700 text-lg">Expert Name</span>
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
                <p className="text-gray-600 text-lg mt-2">for Service or 1:1 call</p>
              </div>

              {/* Booking Date and Time */}
              <div className="flex items-center border border-gray-200 rounded-lg p-6 mt-8 bg-gray-50">
                <Calendar className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="font-medium text-gray-800 text-lg">Wednesday, 15 January</p>
                  <p className="text-gray-500 mt-1">1:15 – 1:30PM</p>
                </div>
              </div>

              {/* Meeting Details */}
              <p className="text-gray-500 text-center mt-6">
                Meeting details are sent to your Email and Mobile number
              </p>
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
      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default BookingConfirmation;