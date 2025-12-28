import PropTypes from 'prop-types';
import { isDateInPast, isSameDay, getMonthDays, getFirstDayOfMonth } from '../../utils/dateUtils';
import Spinner from '@/components/LoadingSkeleton/Spinner';

// Helper function to get date string in timezone (YYYY-MM-DD format)
const getDateStringInTimezone = (dateObj, timezone) => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: timezone
  });

  const parts = formatter.formatToParts(dateObj);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;

  return `${year}-${month}-${day}`;
};

function CalendarGrid({ currentDate, selectedDate, onDateSelect, availability }) {
  // console.log("🗓️ CalendarGrid received availability:", availability);
  // console.log("🚫 Blocked dates found:", availability?.blockedDates);

  // Get timezone from availability
  const selectedTimezone = availability?.timezone?.value || "Asia/Kolkata";

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

  // Check if the day has available slots from weekly availability
  const hasAvailableSlots = (date) => {
    if (!availability?.daySpecific) return false;
    const dayName = date.toLocaleString('en-US', { weekday: 'long' });
    const dayData = availability.daySpecific.find(day => day.day === dayName);
    return dayData && dayData.slots && dayData.slots.length > 0;
  };

  // Check if a specific date has slots (date-specific availability)
  const hasSpecificDateSlots = (date) => {
    if (!availability?.specific_dates || !Array.isArray(availability.specific_dates)) return false;

    // Get the date in YYYY-MM-DD format in the selected timezone
    const dateString = getDateStringInTimezone(date, selectedTimezone);

    // console.log(`🔍 Checking specific slots for: ${dateString}`);
    // console.log(`📅 Available specific_dates:`, availability.specific_dates);

    return availability.specific_dates.some(specificDate => {
      try {
        let specificDateValue;

        // Handle different date formats
        if (typeof specificDate.date === 'string') {
          // If it's already a string in YYYY-MM-DD format, use directly
          if (specificDate.date.length === 10) {
            specificDateValue = specificDate.date;
          } else {
            // ISO string format - extract date part
            specificDateValue = specificDate.date.split('T')[0];
          }
        } else if (specificDate.date) {
          // If it's a Date object or ISO string, convert to YYYY-MM-DD using timezone
          const dateObj = new Date(specificDate.date);
          specificDateValue = getDateStringInTimezone(dateObj, selectedTimezone);
        } else {
          return false;
        }

        const hasSlots = specificDate.slots && specificDate.slots.length > 0;
        const dateMatches = dateString === specificDateValue;

        // console.log(`  📅 Comparing: "${dateString}" === "${specificDateValue}" | Has slots: ${hasSlots} | Match: ${dateMatches}`);

        return dateMatches && hasSlots;
      } catch (error) {
        console.warn('Error parsing specific date:', specificDate, error);
        return false;
      }
    });
  };

  // Check if the date is blocked by the expert
  const isDateBlocked = (date) => {
    if (!availability?.blockedDates || !Array.isArray(availability.blockedDates)) return false;

    // Get the date in YYYY-MM-DD format in the selected timezone
    const dateString = getDateStringInTimezone(date, selectedTimezone);

    // console.log("🔍 Checking if date is blocked:", dateString);
    // console.log("🚫 Available blocked dates:", availability.blockedDates);

    return availability.blockedDates.some(blockedDate => {
      try {
        let blockedDateValue;

        // Handle different blocked date formats
        if (typeof blockedDate === 'string') {
          // If it's already a string, use it
          blockedDateValue = blockedDate.length === 10 ? blockedDate : blockedDate.split('T')[0];
        } else if (blockedDate && blockedDate.dates) {
          // If it's an object with dates property, extract the date part
          const blockedDateObj = new Date(blockedDate.dates);
          blockedDateValue = getDateStringInTimezone(blockedDateObj, selectedTimezone);
        } else if (blockedDate && blockedDate.date) {
          // Alternative property name
          const blockedDateObj = new Date(blockedDate.date);
          blockedDateValue = getDateStringInTimezone(blockedDateObj, selectedTimezone);
        } else {
          return false;
        }

        // console.log(`📅 Comparing: ${dateString} === ${blockedDateValue}`);
        return dateString === blockedDateValue;
      } catch (error) {
        console.warn('Error parsing blocked date:', blockedDate, error);
        return false;
      }
    });
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
            const hasWeeklySlots = hasAvailableSlots(date);
            const hasSpecificSlots = hasSpecificDateSlots(date);
            const hasSlots = hasWeeklySlots || hasSpecificSlots; // Either weekly OR specific date slots
            const isBlocked = isDateBlocked(date);

            // A date is unavailable if it's in the past, has no slots, or is blocked
            const isUnavailable = isPast || !hasSlots || isBlocked;

            return (
              <div key={`day-${weekIndex}-${dayIndex}`} className="flex justify-center">
                <button
                  onClick={() => !isUnavailable && onDateSelect(date)}
                  disabled={isUnavailable}
                  className={`
                    w-9 h-9 flex items-center justify-center rounded-full text-sm transition-colors
                    ${isUnavailable ? 'text-gray-300 cursor-not-allowed bg-gray-100' : 'hover:bg-gray-100'}
                    ${isSelected ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                    ${isToday && !isSelected ? 'border border-green-500' : ''}
                    ${hasSlots && !isUnavailable && !isSelected ? 'text-green-600' : ''}
                    ${isBlocked ? 'bg-red-50 text-red-300 border border-red-200' : ''}
                    ${hasSpecificSlots && !isBlocked && !isPast ? 'bg-blue-50 text-blue-600 border border-blue-200' : ''}
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