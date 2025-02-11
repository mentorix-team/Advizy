import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import BlockedDateCard from './BlockedDateCard';
import { useBlockedDates } from '@/Context/BlockedDatesContext';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { addBlockedDates } from "@/Redux/Slices/availability.slice";

function BlockUnavailableDates() {
  const dispatch = useDispatch();
  const availability = useSelector((state) => state.availability.availability); 
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]); 
  const { blockedDates, setBlockedDates } = useBlockedDates();

  useEffect(() => {
    console.log("useEffect triggered. Availability:", availability);
  
    if (availability?.availability?.daySpecific) {
      console.log("Availability Data:", availability.availability.daySpecific);
  
      const nullSlotDays = availability.availability.daySpecific
        .filter((entry) => !entry.slots) // Filters out days with null or undefined slots
        .map((entry) => {
          console.log("Day Value:", entry.day); // Log the day value to debug the format
  
          const dayOfWeek = entry.day.toLowerCase(); // Convert to lowercase for consistency
          const daysOfWeek = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6
          };
  
          return daysOfWeek[dayOfWeek]; // Only return the weekday index (0-6)
        })
        .filter((day) => day !== undefined); // Filter out undefined days
  
      console.log("Days with Null or Undefined Slots:", nullSlotDays);
      setDisabledDates(nullSlotDays); // Set disabled days by weekday index
    }
  }, [availability]);
  
  
  
  
  
  
  const handleDateSelect = (date) => {
    setSelectedDates((prev) =>
      prev.some((d) => d.getTime() === date.getTime())
        ? prev.filter((d) => d.getTime() !== date.getTime())
        : [...prev, date]
    );
  };

  const handleConfirm = () => {
    const formattedDates = selectedDates.map((date) => date.toISOString());

    dispatch(addBlockedDates({ dates: formattedDates }))
      .then((response) => {
        if (response?.payload?.success) {
          setBlockedDates([...blockedDates, ...selectedDates]);
          setSelectedDates([]);
          setIsOpen(false);
        } else {
          console.error("Failed to add blocked dates:", response?.payload?.message);
        }
      })
      .catch((error) => {
        console.error("Error dispatching addBlockedDates:", error);
      });
  };

  const handleRemoveDate = (dateToRemove) => {
    setBlockedDates(blockedDates.filter((date) => date.getTime() !== dateToRemove.getTime()));
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Block Unavailable Dates</h2>
      <hr className="h-px mb-4 border-1 bg-gray-200"></hr>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#16A348] text-white py-2.5 rounded-lg hover:bg-[#388544] transition-colors text-sm font-medium"
      >
        Block Unavailable Dates
      </button>

      {blockedDates.length > 0 && (
        <div className="mt-4">
          <h3 className="flex text-sm font-medium text-gray-700 mb-3">Blocked Dates:</h3>
          <div className="flex flex-wrap gap-2 items-center">
            {blockedDates.map((date) => (
              <BlockedDateCard
                key={date.getTime()}
                date={date}
                onRemove={handleRemoveDate}
              />
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg items-center font-semibold text-gray-900">Select dates to block</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <DatePicker
              inline
              onChange={handleDateSelect}
              selected={null}
              highlightDates={selectedDates}
              excludeDates={[]} // You can exclude specific dates here if needed, but now we focus on weekdays
              minDate={new Date()}
              className="w-full border border-gray-300 rounded-md p-2"
              calendarClassName="bg-white shadow-md"
              dayClassName={(date) => {
                // Check if the weekday of the date is in the disabled days list
                const dayOfWeek = date.getDay(); // Get day index (0-6)
                if (disabledDates.includes(dayOfWeek)) {
                  return "bg-gray-200 text-gray-400"; // Apply your disabled style here
                }
                return selectedDates.some((d) => d.getTime() === date.getTime())
                  ? "text-white bg-black rounded-md"
                  : "hover:bg-gray-100 rounded-md";
              }}
            />
            <button
              onClick={handleConfirm}
              className="w-full mt-4 bg-[#16A348] text-white py-2.5 rounded-lg hover:bg-[#388544] transition-colors font-medium"
            >
              Confirm Blocked Dates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlockUnavailableDates;
