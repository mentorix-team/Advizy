import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ChevronDownIcon } from "@/icons/Icons"; // Replace with professional icons
import TimezoneDropdown from "./TimezoneDropdown"; // Assuming TimezoneDropdown component exists
import { setSettings } from "@/Redux/Slices/availability.slice";

const BOOKING_PERIODS = [
  { id: 1, name: "15 days" },
  { id: 2, name: "1 Month" },
  { id: 3, name: "2 Months" },
  { id: 4, name: "3 Months" },
];

const NOTICE_PERIODS = [
  { id: 1, name: "5 days" },
  { id: 2, name: "10 days" },
  { id: 3, name: "15 days" },
  { id: 4, name: "1 month" },
];

function Settings() {
  const dispatch = useDispatch();

  const [bookingPeriod, setBookingPeriod] = useState("15 days");
  const [noticePeriod, setNoticePeriod] = useState("5 days");
  const [timezone, setTimezone] = useState(null); // Assuming TimezoneDropdown will provide a value

  // Handler for dispatching the updated settings
  const handleSaveSettings = () => {
    const settings = {
      timezone,
      bookingPeriod,
      noticePeriod,
    };

    dispatch(setSettings(settings))
      .then((response) => {
        if (response?.payload?.success) {
          console.log("Settings updated successfully:", response.payload);
        } else {
          console.error("Failed to update settings:", response?.payload?.message);
        }
      })
      .catch((error) => {
        console.error("Error updating settings:", error);
      });
  };

  const Dropdown = ({ value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef();

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);

    return (
      <div className="relative w-full sm:w-auto" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full sm:min-w-[200px] px-3 py-2 text-sm border border-gray-300 rounded-md bg-white flex items-center justify-between"
        >
          <span>{value}</span>
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        </button>
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full sm:min-w-[200px] bg-white border border-gray-200 rounded-md shadow-md">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.name);
                  setIsOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                {option.name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
    
  };

  return (
    <div className="bg-white rounded-lg mt-5 shadow-sm p-7 w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
      <hr className="h-px mb-6 border-1 bg-gray-200" />
  
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Timezone Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">Timezone</span>
            <p className="text-xs text-gray-500">Required for timely communications</p>
          </div>
          <TimezoneDropdown onChange={setTimezone} value={timezone} className="w-full sm:w-auto" />
        </div>
  
        {/* Booking Period Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">Booking Period</span>
            <p className="text-xs text-gray-500">How far in the future can attendees book</p>
          </div>
          <Dropdown
            value={bookingPeriod}
            options={BOOKING_PERIODS}
            onChange={setBookingPeriod}
            className="w-full sm:w-auto"
          />
        </div>
  
        {/* Notice Period Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">Notice Period</span>
            <p className="text-xs text-gray-500">Set the minimum amount of notice that is required</p>
          </div>
          <Dropdown
            value={noticePeriod}
            options={NOTICE_PERIODS}
            onChange={setNoticePeriod}
            className="w-full sm:w-auto"
          />
        </div>
      </div>
  
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-blue-600 text-white rounded-md px-4 py-2 w-full sm:w-auto"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
  
}

export default Settings;
