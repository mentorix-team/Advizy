import React, { useState, useRef, useEffect } from "react";

// Utility function to generate time intervals in 15-minute increments
export function generateTimeIntervals() {
  return Array.from({ length: 96 }, (_, i) => {
    const totalMinutes = i * 15;
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    const hours12 = hours24 % 12 || 12; // Convert 24-hour to 12-hour format
    const ampm = hours24 < 12 ? "AM" : "PM";
    return `${hours12}:${minutes} ${ampm}`;
  });
}

export function TimeInput({ value, onChange, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeIntervals = generateTimeIntervals();

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
        className={`w-[120px] px-2 py-1.5 text-sm text-left border rounded-md flex items-center justify-between ${
          disabled
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
                className={`w-100 px-2 py-1 text-left text-sm hover:bg-gray-50 ${
                  value === time ? "bg-gray-100 font-medium" : ""
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
  const timeOptions = generateTimeIntervals();

  // Normalize time value to ensure consistent format
  const normalizeTime = (time) => {
    if (!time) return '';
    
    // If already in correct format (e.g., "12:00 AM"), return as is
    if (/\d{1,2}:\d{2} [AP]M/.test(time)) {
      return time;
    }
    
    // Try to parse as 24-hour format "HH:MM" or "HH:MM:SS"
    const match = time.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const ampm = hours < 12 ? 'AM' : 'PM';
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    }
    
    // If we can't parse, try to see if it's one of our generated options
    const found = timeOptions.find(option => option === time);
    if (found) {
      return found;
    }
    
    // If still not found, try to convert from Date object
    try {
      const date = new Date(`1970-01-01T${time}`);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours < 12 ? 'AM' : 'PM';
        const hours12 = hours % 12 || 12;
        const minutesStr = minutes.toString().padStart(2, '0');
        return `${hours12}:${minutesStr} ${ampm}`;
      }
    } catch (e) {
      // Ignore parsing errors
    }
    
    return time; // fallback
  };

  const normalizedStartTime = normalizeTime(startTime);
  const normalizedEndTime = normalizeTime(endTime);

  return (
    <div className="flex items-center gap-2">
      <select
        value={normalizedStartTime}
        onChange={(e) => onStartChange(e.target.value)}
        disabled={disabled}
        className="form-select border border-gray-300 rounded-md"
      >
        <option value="" disabled>
          Start Time
        </option>
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <span>to</span>
      <select
        value={normalizedEndTime}
        onChange={(e) => onEndChange(e.target.value)}
        disabled={disabled}
        className="form-select border border-gray-300 rounded-md"
      >
        <option value="" disabled>
          End Time
        </option>
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TimeRangePicker;