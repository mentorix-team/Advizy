import React, { useState } from 'react';
import { format } from 'date-fns';

const CustomDatePicker = ({ selectedDate, onChange, type = 'default', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('date');
  const [displayDate, setDisplayDate] = useState(selectedDate || new Date());
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const currentYear = new Date().getFullYear();
    return Math.floor(currentYear / 12) * 12;
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const navigateYear = (direction) => {
    const newDate = new Date(displayDate);
    if (direction === 'prev') {
      newDate.setFullYear(newDate.getFullYear() - 1);
    } else {
      newDate.setFullYear(newDate.getFullYear() + 1);
    }
    setDisplayDate(newDate);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(displayDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setDisplayDate(newDate);
  };

  const navigateYearRange = (direction) => {
    setYearRangeStart(prevStart => {
      if (direction === 'prev') {
        return prevStart - 12;
      } else {
        return prevStart + 12;
      }
    });
  };

  const generateYearRanges = () => {
    const ranges = [];
    for (let i = 0; i < 12; i++) {
      const year = yearRangeStart + i;
      ranges.push({
        year,
        isSelected: displayDate.getFullYear() === year
      });
    }
    return ranges;
  };

  const handleYearClick = (year) => {
    const newDate = new Date(displayDate);
    newDate.setFullYear(year);
    setDisplayDate(newDate);
    setView('month');
  };

  const handleMonthClick = (monthIndex) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(monthIndex);
    setDisplayDate(newDate);
    setView('date');
  };

  const isDateDisabled = (date) => {
    if (disabled) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (type) {
      case 'dob':
        return date > today;
      default:
        return false;
    }
  };

  const handleDateClick = (day) => {
    if (disabled) return;
    
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    
    if (isDateDisabled(newDate)) {
      return;
    }
    
    onChange(newDate);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
    const lastDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0);
    const startingDayIndex = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    const weeks = [];
    let days = [];

    for (let i = 0; i < startingDayIndex; i++) {
      days.push(<td key={`empty-${i}`} className="p-2"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
      const isDisabled = isDateDisabled(currentDate);
      const isSelected = 
        selectedDate?.getDate() === day && 
        selectedDate?.getMonth() === displayDate.getMonth() &&
        selectedDate?.getFullYear() === displayDate.getFullYear();

      days.push(
        <td key={day} className="text-center p-1">
          <button
            onClick={() => handleDateClick(day)}
            disabled={isDisabled}
            className={`w-8 h-8 rounded-full ${
              isSelected 
                ? 'bg-primary text-white' 
                : isDisabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:bg-gray-100'
            }`}
          >
            {day}
          </button>
        </td>
      );

      if ((startingDayIndex + day) % 7 === 0) {
        weeks.push(<tr key={day}>{days}</tr>);
        days = [];
      }
    }

    if (days.length > 0) {
      while (days.length < 7) {
        days.push(<td key={`empty-end-${days.length}`} className="p-2"></td>);
      }
      weeks.push(<tr key="last-week">{days}</tr>);
    }

    return weeks;
  };

  return (
    <div className="relative">
      <div 
        onClick={handleClick}
        className={`w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-primary'
        }`}
      >
        <span className={`flex-1 ${disabled ? 'text-gray-500' : ''}`}>
          {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select date'}
        </span>
        <svg 
          className={`w-5 h-5 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[320px]">
          {view === 'date' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setView('month')} 
                    className="text-lg font-medium text-gray-700 border-2 rounded-lg hover:text-primary px-2 py-1 hover:border-green-500"
                  >
                    {months[displayDate.getMonth()]}
                  </button>
                  <button 
                    onClick={() => setView('year')} 
                    className="text-lg font-medium text-gray-700 hover:text-primary border-2 rounded-lg hover:text-primary px-2 py-1 hover:border-green-500"
                  >
                    {displayDate.getFullYear()}
                  </button>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => navigateMonth('prev')} 
                    className="text-2xl text-gray-600 hover:text-gray-800 w-8 h-8 flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={() => navigateMonth('next')} 
                    className="text-2xl text-gray-600 hover:text-gray-800 w-8 h-8 flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <th key={day} className="p-2 text-xs font-medium text-gray-600">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderCalendar()}</tbody>
              </table>
            </div>
          )}
          {view === 'month' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => setView('year')} 
                  className="text-lg font-medium text-gray-700 hover:text-primary"
                >
                  {displayDate.getFullYear()}
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => navigateYear('prev')} 
                    className="text-2xl text-gray-600 hover:text-gray-800 w-8 h-8 flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button 
                    onClick={() => navigateYear('next')} 
                    className="text-2xl text-gray-600 hover:text-gray-800 w-8 h-8 flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthClick(index)}
                    className={`p-2 rounded-lg hover:bg-gray-100 ${
                      displayDate.getMonth() === index ? 'bg-primary text-white hover:bg-primary' : ''
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          )}
          {view === 'year' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-700">
                  {yearRangeStart} - {yearRangeStart + 11}
                </span>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => navigateYearRange('prev')} 
                    className="text-2xl text-gray-600 hover:text-gray-800 w-8 h-8 flex items-center justify-center"
                  >
                    ‹
                  </button>
                  <button 
                    type="button"
                    onClick={() => navigateYearRange('next')} 
                    className="text-2xl text-gray-600 hover:text-gray-800 w-8 h-8 flex items-center justify-center"
                  >
                    ›
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {generateYearRanges().map(({ year, isSelected }) => (
                  <button
                    key={year}
                    onClick={() => handleYearClick(year)}
                    className={`p-2 rounded-lg hover:bg-gray-100 ${
                      isSelected ? 'bg-primary text-white hover:bg-primary' : ''
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;