import { reschedulePolicy } from '@/Redux/Slices/availability.slice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

function ReschedulePolicy() {
  const dispatch = useDispatch()
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRescheduleType, setSelectedRescheduleType] = useState('Request reschedule');
  const [selectedNoticePeriod, setSelectedNoticePeriod] = useState('30 mins');

  const handleUpdatePolicy = () => {
    const policyData = {
      recheduleType: selectedRescheduleType,
      noticeperiod: selectedNoticePeriod,
    };
  
    dispatch(reschedulePolicy(policyData))
      .then((response) => {
        if (response?.meta?.requestStatus === "fulfilled") {
          console.log("Policy updated successfully:", response.payload);
        } else {
          console.error("Failed to update policy:", response.error.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleRescheduleTypeChange = (type) => {
    setSelectedRescheduleType(type);
  };

  const handleNoticePeriodChange = (period) => {
    setSelectedNoticePeriod(period);
  };

  return (
    <div>
      <button
        onClick={() => setIsPopupOpen(true)}
        className="px-4 py-2 bg-[#388544] text-white rounded-md hover:bg-[#388544]"
      >
        Update Policy
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#00630FC7]">Reschedule Policy</h2>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Reschedule Type */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                How can your customers initiate a reschedule
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRescheduleTypeChange('Request reschedule')}
                  className={`text-sm w-40 px-2 py-2 rounded-md border-2 shadow-sm font-medium ${
                    selectedRescheduleType === 'Request reschedule'
                      ? 'bg-gray-50 border-2 border-[#00630FC7] text-black'
                      : 'bg-white text-black'
                  }`}
                >
                  Request reschedule
                </button>
                <button
                  onClick={() => handleRescheduleTypeChange('Directly reschedule')}
                  className={`text-sm w-40 px-2 py-2 rounded-md border-2 shadow-s font-medium ${
                    selectedRescheduleType === 'Directly reschedule'
                      ? 'bg-gray-50 border-2 border-[#00630FC7] text-black'
                      : 'bg-white text-black'
                  }`}
                >
                  Directly reschedule
                </button>
              </div>
            </div>

            {/* Notice Period */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Minimum notice before rescheduling a call
              </h3>
              <div className="flex flex-row gap-2">
                {['30 mins', '8 hrs', '24 hrs', 'Anytime'].map((period) => (
                  <button
                    key={period}
                    onClick={() => handleNoticePeriodChange(period)}
                    className={`text-sm font-medium w-28 px-2 py-1 rounded-md border ${
                      selectedNoticePeriod === period
                        ? 'bg-gray-50 border-2 border-[#00630FC7] text-black'
                        : 'bg-white text-black'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdatePolicy}
              className="w-full py-2 bg-[#388544] text-white rounded-md hover:bg-[#388544]"
            >
              Update Policy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReschedulePolicy;
