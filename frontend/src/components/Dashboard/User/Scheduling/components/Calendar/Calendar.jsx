import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { isCurrentMonth, isNextMonth } from '../../utils/dateUtils';

function Calendar({ selectedDate, onDateSelect, availability }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [availableDays, setAvailableDays] = useState([]);

  useEffect(() => {
    if (availability?.daySpecific) {
      const daysWithSlots = availability.daySpecific
        .filter((day) => day.slots && day.slots.length > 0)
        .map((day) => day.day.toLowerCase());
      setAvailableDays(daysWithSlots);
    }
  }, [availability]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    if (isCurrentMonth(newDate) || isNextMonth(newDate)) {
      setCurrentDate(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    if (isCurrentMonth(newDate) || isNextMonth(newDate)) {
      setCurrentDate(newDate);
    }
  };

  const canGoPrev = !isCurrentMonth(currentDate);
  const canGoNext = !isNextMonth(currentDate);

  return (
    <div className="bg-white rounded-lg p-3 sm:p-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
      />
      <CalendarGrid
        currentDate={currentDate}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        availableDays={availableDays}
      />
    </div>
  );
}

Calendar.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  availability: PropTypes.object,
};

export default Calendar;
