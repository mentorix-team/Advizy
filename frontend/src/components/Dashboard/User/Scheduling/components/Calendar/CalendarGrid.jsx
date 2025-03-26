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
      calendarDays.push(currentRow);
      currentRow = [];
    }
  }

  // Add remaining days to last row if needed
  if (currentRow.length > 0) {
    while (currentRow.length < 7) {
      currentRow.push(null);
    }
    calendarDays.push(currentRow);
  }

  if (!availability) {
    return <Spinner />;
  }

  return (
    <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
      {calendarDays.flat().map((date, index) => {
        if (!date) {
          return (
            <div
              key={`empty-${index}`}
              className="h-12 bg-gray-50 text-center py-2"
            />
          );
        }

        const isPast = isDateInPast(date);
        const isSelected = selectedDate && isSameDay(date, selectedDate);
        const isToday = isSameDay(date, today);

        return (
          <button
            key={date.toISOString()}
            onClick={() => !isPast && onDateSelect(date)}
            disabled={isPast}
            className={`
              h-12 relative bg-white focus:z-10 focus:outline-none
              ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-50'}
              ${isSelected ? 'bg-green-50 text-green-600 font-semibold' : ''}
              ${isToday && !isSelected ? 'text-green-600 font-semibold' : ''}
            `}
          >
            <time
              dateTime={date.toISOString().split('T')[0]}
              className={`
                flex items-center justify-center h-full w-full
                ${isSelected ? 'rounded-full bg-green-100' : ''}
              `}
            >
              {date.getDate()}
            </time>
          </button>
        );
      })}
    </div>
  );
}

CalendarGrid.propTypes = {
  currentDate: PropTypes.instanceOf(Date).isRequired,
  selectedDate: PropTypes.instanceOf(Date),
  onDateSelect: PropTypes.func.isRequired,
  availability: PropTypes.object,
};

export default CalendarGrid;