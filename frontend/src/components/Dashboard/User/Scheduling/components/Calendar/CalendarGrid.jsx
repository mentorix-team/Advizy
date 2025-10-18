import PropTypes from 'prop-types';
import { isDateInPast, isSameDay, getMonthDays, getFirstDayOfMonth } from '../../utils/dateUtils';
import Spinner from '@/components/LoadingSkeleton/Spinner';

function CalendarGrid({ currentDate, selectedDate, onDateSelect, availability }) {
  console.log("🗓️ CalendarGrid received availability:", availability);
  console.log("🚫 Blocked dates found:", availability?.blockedDates);
  
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
    
    // Get the date in YYYY-MM-DD format in local timezone
    const localDateString = date.getFullYear() + '-' + 
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0');
    
    console.log(`🔍 Checking specific slots for: ${localDateString}`);
    console.log(`📅 Available specific_dates:`, availability.specific_dates);
    
    return availability.specific_dates.some(specificDate => {
      try {
        let specificDateValue;
        
        // Handle different date formats
        if (typeof specificDate.date === 'string') {
          // If it's already a string in YYYY-MM-DD format, use directly
          if (specificDate.date.length === 10) {
            // Already in YYYY-MM-DD format
            specificDateValue = specificDate.date;
          } else {
            // ISO string format - extract date part
            specificDateValue = specificDate.date.split('T')[0];
          }
        } else if (specificDate.date) {
          // If it's a Date object or ISO string, convert to YYYY-MM-DD using UTC
          const dateObj = new Date(specificDate.date);
          specificDateValue = dateObj.getUTCFullYear() + '-' + 
            String(dateObj.getUTCMonth() + 1).padStart(2, '0') + '-' + 
            String(dateObj.getUTCDate()).padStart(2, '0');
        } else {
          return false;
        }
        
        const hasSlots = specificDate.slots && specificDate.slots.length > 0;
        const dateMatches = localDateString === specificDateValue;
        
        console.log(`  📅 Comparing: "${localDateString}" === "${specificDateValue}" | Has slots: ${hasSlots} | Match: ${dateMatches}`);
        
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
    
    // Get the date in YYYY-MM-DD format in local timezone
    const localDateString = date.getFullYear() + '-' + 
      String(date.getMonth() + 1).padStart(2, '0') + '-' + 
      String(date.getDate()).padStart(2, '0');
    
    console.log("🔍 Checking if date is blocked:", localDateString);
    console.log("🚫 Available blocked dates:", availability.blockedDates);
    
    return availability.blockedDates.some(blockedDate => {
      try {
        let blockedDateValue;
        
        // Handle different blocked date formats
        if (typeof blockedDate === 'string') {
          // If it's already a string in YYYY-MM-DD format, use directly
          blockedDateValue = blockedDate;
        } else if (blockedDate && blockedDate.dates) {
          // If it's an object with dates property, extract the date part
          const blockedDateObj = new Date(blockedDate.dates);
          // Get date in YYYY-MM-DD format without timezone conversion
          blockedDateValue = blockedDateObj.getUTCFullYear() + '-' + 
            String(blockedDateObj.getUTCMonth() + 1).padStart(2, '0') + '-' + 
            String(blockedDateObj.getUTCDate()).padStart(2, '0');
        } else if (blockedDate && blockedDate.date) {
          // Alternative property name
          const blockedDateObj = new Date(blockedDate.date);
          blockedDateValue = blockedDateObj.getUTCFullYear() + '-' + 
            String(blockedDateObj.getUTCMonth() + 1).padStart(2, '0') + '-' + 
            String(blockedDateObj.getUTCDate()).padStart(2, '0');
        } else {
          return false;
        }
        
        console.log(`📅 Comparing: ${localDateString} === ${blockedDateValue}`);
        return localDateString === blockedDateValue;
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
                    ${isUnavailable ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                    ${isBlocked && !isPast ? 'bg-red-50 text-red-400 border border-red-200' : ''}
                    ${isSelected ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                    ${isToday && !isSelected ? 'border border-green-500' : ''}
                    ${hasSlots && !isUnavailable && !isSelected ? 'text-green-600' : ''}
                  `}
                  title={isBlocked ? 'Expert is unavailable on this date' : ''}
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