import PropTypes from 'prop-types';
import { isDateInPast, isSameDay, getMonthDays, getFirstDayOfMonth } from '../../utils/dateUtils';
import Spinner from '@/components/LoadingSkeleton/Spinner';

function CalendarGrid({ currentDate, selectedDate, onDateSelect, availability }) {
  const today = new Date();
  const daysInMonth = getMonthDays(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const firstDayOfMonth = getFirstDayOfMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Generate calendar days
  const calendarDays = [];
  let currentRow = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    currentRow.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    currentRow.push(date);

    if (currentRow.length === 7) {
      calendarDays.push([...currentRow]);
      currentRow = [];
    }
  }

  // Add remaining days to last row if needed
  if (currentRow.length > 0) {
    while (currentRow.length < 7) {
      currentRow.push(null);
    }
    calendarDays.push([...currentRow]);
  }

  // Check if the day has available slots
  const hasAvailableSlots = (date) => {
    if (!availability?.daySpecific) return false;
    const dayName = date.toLocaleString('en-US', { weekday: 'long' });
    const dayData = availability.daySpecific.find(day => day.day === dayName);
    return dayData && dayData.slots && dayData.slots.length > 0;
  };

  if (!availability) {
    return <Spinner />;
  }

  return (
    <div className="border border-gray-400 rounded-lg p-2">
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, index) => (
          <div key={`weekDay-${index}-${day}`} className="text-center text-sm text-gray-600 py-2 font-medium">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((week, weekIndex) => (
          week.map((date, dayIndex) => {
            if (!date) {
              return <div key={`empty-${weekIndex}-${dayIndex}`} className="h-9" />;
            }

            const isPast = isDateInPast(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const hasSlots = hasAvailableSlots(date);

            return (
              <div key={`day-${weekIndex}-${dayIndex}`} className="flex justify-center">
                <button
                  onClick={() => !isPast && hasSlots && onDateSelect(date)}
                  disabled={isPast || !hasSlots}
                  className={`
                    w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors
                    ${isPast || !hasSlots ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                    ${isSelected ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                    ${isToday && !isSelected ? 'border border-green-500' : ''}
                    ${hasSlots && !isPast && !isSelected ? 'text-green-600' : ''}
                  `}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
}

CalendarGrid.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  availability: PropTypes.shape({
    daySpecific: PropTypes.arrayOf(PropTypes.shape({
      day: PropTypes.string.isRequired,
      slots: PropTypes.array
    }))
  })
};

export default CalendarGrid;