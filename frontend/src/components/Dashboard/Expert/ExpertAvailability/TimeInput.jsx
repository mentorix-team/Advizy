import React, { useState, useRef, useEffect } from "react";

export function TimeInput({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Generate time intervals in 15-minute increments with 12-hour format and AM/PM
  const timeIntervals = Array.from({ length: 96 }, (_, i) => {
    const totalMinutes = i * 15;
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");

    const hours12 = hours24 % 12 || 12; // Convert 24-hour to 12-hour format
    const ampm = hours24 < 12 ? "AM" : "PM";

    return `${hours12}:${minutes} ${ampm}`;
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTimeChange = (newTime) => {
    onChange(newTime);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-[120px] px-2 py-1.5 text-sm text-left border rounded-md flex items-center justify-between ${disabled
            ? "bg-gray-50 text-gray-400 border-gray-200"
            : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
          }`}
      >
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-1.5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-base font-sans text-black">{value}</p>
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="h-48 overflow-y-auto py-1">
            {timeIntervals.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeChange(time)}
                className={`w-100 px-2 py-1 text-left text-sm hover:bg-gray-50 ${value === time ? "bg-gray-100 font-medium" : ""
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const TimeRangePicker = ({ startTime, endTime, disabled, onStartChange, onEndChange }) => {
  // Parse the initial times to extract hour:minute and AM/PM
  const parseTime = (timeString) => {
    if (!timeString) return { hourMinute: '', ampm: 'AM' };
    
    const parts = timeString.split(' ');
    return {
      hourMinute: parts[0] || '',
      ampm: parts[1] || 'AM'
    };
  };
  
  const [startHourMinute, setStartHourMinute] = useState(parseTime(startTime).hourMinute);
  const [startAmPm, setStartAmPm] = useState(parseTime(startTime).ampm);
  const [endHourMinute, setEndHourMinute] = useState(parseTime(endTime).hourMinute);
  const [endAmPm, setEndAmPm] = useState(parseTime(endTime).ampm);
  
  // Handle changes to start time
  const handleStartHourMinuteChange = (hourMinute) => {
    setStartHourMinute(hourMinute);
    const fullTime = `${hourMinute} ${startAmPm}`;
    console.log(`🕐 Start time changed: ${startHourMinute} ${startAmPm} -> ${hourMinute} ${startAmPm} = ${fullTime}`);
    onStartChange(fullTime);
  };
  
  const handleStartAmPmChange = (ampm) => {
    setStartAmPm(ampm);
    const fullTime = `${startHourMinute} ${ampm}`;
    console.log(`🕐 Start AM/PM changed: ${startHourMinute} ${startAmPm} -> ${startHourMinute} ${ampm} = ${fullTime}`);
    onStartChange(fullTime);
  };
  
  // Handle changes to end time
  const handleEndHourMinuteChange = (hourMinute) => {
    setEndHourMinute(hourMinute);
    const fullTime = `${hourMinute} ${endAmPm}`;
    console.log(`🕐 End time changed: ${endHourMinute} ${endAmPm} -> ${hourMinute} ${endAmPm} = ${fullTime}`);
    onEndChange(fullTime);
  };
  
  const handleEndAmPmChange = (ampm) => {
    setEndAmPm(ampm);
    const fullTime = `${endHourMinute} ${ampm}`;
    console.log(`🕐 End AM/PM changed: ${endHourMinute} ${endAmPm} -> ${endHourMinute} ${ampm} = ${fullTime}`);
    onEndChange(fullTime);
  };
  
  return (
    <div className="flex items-center gap-2">
      <select
        value={startHourMinute}
        onChange={(e) => handleStartHourMinuteChange(e.target.value)}
        disabled={disabled}
        className="form-select border border-gray-300 rounded-md"
      >
        <option value="" disabled>
          Start
        </option>
        {/* Populate time options */}
        {generateTimeOptions().map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <select
        value={startAmPm}
        onChange={(e) => handleStartAmPmChange(e.target.value)}
        disabled={disabled}
        className="form-select border border-gray-300 rounded-md"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
      <span>to</span>
      <select
        value={endHourMinute}
        onChange={(e) => handleEndHourMinuteChange(e.target.value)}
        disabled={disabled}
        className="form-select border border-gray-300 rounded-md"
      >
        <option value="" disabled>
          End
        </option>
        {/* Populate time options */}
        {generateTimeOptions().map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <select
        value={endAmPm}
        onChange={(e) => handleEndAmPmChange(e.target.value)}
        disabled={disabled}
        className="form-select border border-gray-300 rounded-md"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

// Helper to generate time options in 30-minute intervals (12-hour format without AM/PM)
function generateTimeOptions() {
  const times = [];

  // Loop through all 12 hours
  for (let hour = 1; hour <= 12; hour++) {
    // Loop through minutes in 30-minute increments
    for (let min = 0; min < 60; min += 30) {
      const minuteStr = min.toString().padStart(2, '0');
      times.push(`${hour}:${minuteStr}`);
    }
  }

  return times;
}

export default TimeRangePicker;