import React, { useState, useEffect } from "react";
import { CalendarIcon } from "@/icons/Icons";
import ConfettiExplosion from "react-confetti-explosion";

const BookingConfirmation = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem("firstVisit");
    if (!isFirstVisit) {
      setShowConfetti(true);
      sessionStorage.setItem("firstVisit", "true");
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {/* Confetti Explosion */}
      {showConfetti && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-50">
          <ConfettiExplosion
            force={0.6}
            duration={3000}
            particleCount={150}
            width={500}
          />
        </div>
      )}

      <div className="bg-white rounded-lg border-2 shadow-[#b8e7c9] shadow-lg p-6 w-96 relative">
        {/* Logo and Send Icon */}
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="bg-red-600 text-white rounded-full w-10 h-10 flex justify-center items-center font-bold">
              er
            </div>
            <span className="ml-2 font-medium text-gray-700">Expert Name</span>
          </div>
        </div>

        <hr className="text-gray-600 my-2" />

        {/* Confirmation Section */}
        <div className="flex flex-col items-center mt-4">
          <div className="bg-green-500 text-white rounded-full w-16 h-16 flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
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
          <h1 className="text-xl font-semibold text-gray-800 mt-4">
            Booking confirmed
          </h1>
          <p className="text-gray-600">for Service or 1:1 call</p>
        </div>

        {/* Booking Date and Time */}
        <div className="flex items-center border border-gray-200 rounded-md p-4 mt-6">
          <div className="text-green-600">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div className="ml-4">
            <p className="font-medium text-gray-800">Wednesday, 15 January</p>
            <p className="text-sm text-gray-500">1:15 – 1:30PM</p>
          </div>
        </div>

        {/* Meeting Details */}
        <p className="text-gray-500 text-sm mt-4 text-center">
          Meeting details are sent to your Email and Mobile number
        </p>
      </div>

      {/* Manage Booking Section */}
      <div className="bg-white rounded-lg shadow-lg border-2 shadow-[#b8e7c9] mt-4 p-4 w-96 flex justify-between items-center">
        <span className="font-medium text-gray-800">Manage booking</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
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
  );
};

export default BookingConfirmation;
