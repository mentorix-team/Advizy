import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import Navbar from "./components/Home/components/Navbar";
import Footer from "./components/Home/components/Footer";

function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar
        onSearch={() => setIsModalOpen(true)}
        isExpertMode={isExpertMode}
        onToggleExpertMode={handleToggle}
      />
      
      {/* Main content with proper spacing from navbar */}
      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Booking confirmation card */}
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            <div className="flex items-center">
              <div className="bg-red-600 text-white rounded-full w-10 h-10 flex justify-center items-center font-bold">
                er
              </div>
              <span className="ml-2 font-medium text-gray-700">Expert Name</span>
            </div>

            <hr className="my-4" />

            <div className="flex flex-col items-center">
              <div className="bg-green-500 text-white rounded-full w-16 h-16 flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-800 mt-4">
                Booking confirmed
              </h1>
              <p className="text-gray-600">for Service or 1:1 call</p>
            </div>

            <div className="flex items-center border border-gray-200 rounded-md p-4 mt-6">
              <Calendar className="w-6 h-6 text-green-600" />
              <div className="ml-4">
                <p className="font-medium text-gray-800">Wednesday, 15 January</p>
                <p className="text-sm text-gray-500">1:15 – 1:30PM</p>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-4 text-center">
              Meeting details are sent to your Email and Mobile number
            </p>
          </div>

          {/* Manage booking section */}
          <div className="bg-white rounded-lg shadow-lg mt-4 p-4 w-96 flex justify-between items-center">
            <span className="font-medium text-gray-800">Manage booking</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;