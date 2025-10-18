import React from 'react';
import { BiCalendarX } from 'react-icons/bi';

const BlockedDates = ({ blockedDates = [] }) => {
  console.log("BlockedDates component received:", blockedDates);
  
  // Format blocked dates for display
  const formatBlockedDates = (dates) => {
    if (!dates || dates.length === 0) return [];
    
    return dates.map(dateObj => {
      try {
        // Handle different date formats
        let dateValue;
        if (typeof dateObj === 'string') {
          dateValue = dateObj;
        } else if (dateObj && dateObj.dates) {
          dateValue = dateObj.dates;
        } else if (dateObj && dateObj.date) {
          dateValue = dateObj.date;
        } else {
          dateValue = dateObj;
        }
        
        const date = new Date(dateValue);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.warn('Invalid date:', dateValue);
          return null;
        }
        
        return {
          formatted: date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          raw: dateValue
        };
      } catch (error) {
        console.error('Error formatting blocked date:', dateObj, error);
        return null;
      }
    }).filter(Boolean);
  };

  const formattedDates = formatBlockedDates(blockedDates);
  console.log("Formatted blocked dates:", formattedDates);

  if (formattedDates.length === 0) {
    return null; // Don't show the component if there are no blocked dates
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <BiCalendarX className="text-red-500" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">
          Unavailable Dates
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        The expert is not available on the following dates:
      </p>
      
      <div className="flex flex-wrap gap-2">
        {formattedDates.map((date, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"
          >
            {date}
          </span>
        ))}
      </div>
      
      {formattedDates.length > 10 && (
        <p className="text-xs text-gray-500 mt-3">
          Showing {Math.min(10, formattedDates.length)} of {formattedDates.length} unavailable dates
        </p>
      )}
    </div>
  );
};

export default BlockedDates;