import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import BlockedDateCard from './BlockedDateCard';
import { useBlockedDates } from '@/Context/BlockedDatesContext';
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { addBlockedDates, removeBlockedDate } from "@/Redux/Slices/availability.slice";
import toast from 'react-hot-toast';

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

function BlockUnavailableDates() {
  const dispatch = useDispatch();
  const availability = useSelector((state) => state.availability.availability);
  const { timezone } = useSelector((state) => state.availability.availability?.[0] || {});
  const selectedTimezone = timezone?.value || "Asia/Kolkata";

  // console.log('this is availabliity at blocked dates', availability)
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);
  const { blockedDates, setBlockedDates } = useBlockedDates();

  // Helper function to check if a date is in specific_dates
  const isDateInSpecificDates = (date) => {
    const expertAvailability = availability?.availability?.[0];
    if (!expertAvailability?.specific_dates || !Array.isArray(expertAvailability.specific_dates)) {
      return false;
    }

    const dateString = getDateStringInTimezone(date, selectedTimezone);

    return expertAvailability.specific_dates.some(specificDate => {
      try {
        let specificDateValue;

        if (typeof specificDate.date === 'string') {
          if (specificDate.date.length === 10) {
            specificDateValue = specificDate.date;
          } else {
            specificDateValue = specificDate.date.split('T')[0];
          }
        } else if (specificDate.date) {
          const dateObj = new Date(specificDate.date);
          specificDateValue = getDateStringInTimezone(dateObj, selectedTimezone);
        } else {
          return false;
        }

        return dateString === specificDateValue;
      } catch (error) {
        console.warn('Error parsing specific date:', specificDate, error);
        return false;
      }
    });
  };

  useEffect(() => {
    // console.log("useEffect triggered. Availability:", availability);

    const expertAvailability = availability?.availability?.[0];

    if (expertAvailability?.daySpecific) {
      const nullSlotDays = expertAvailability.daySpecific
        .filter((entry) => !entry.slots || entry.slots.length === 0)
        .map((entry) => {
          const dayOfWeek = entry.day.toLowerCase();
          const daysOfWeek = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
          };
          return daysOfWeek[dayOfWeek];
        })
        .filter((day) => day !== undefined);

      // console.log("🚫 Disabled days (no slots):", nullSlotDays);
      setDisabledDates(nullSlotDays);
    }

    if (expertAvailability?.blockedDates?.length > 0) {
      const formattedBlockedDates = expertAvailability.blockedDates.map(
        (dateObj) => new Date(dateObj.dates)
      );
      setBlockedDates(formattedBlockedDates);
    }
  }, [availability]);

  // Helper function to check if a date is already blocked
  const isDateAlreadyBlocked = (date) => {
    const dateString = getDateStringInTimezone(date, selectedTimezone);

    // Check against Redux blocked dates
    const expertAvailability = availability?.availability?.[0];
    if (!expertAvailability?.blockedDates || !Array.isArray(expertAvailability.blockedDates)) {
      return false;
    }

    return expertAvailability.blockedDates.some(blockedDate => {
      try {
        let blockedDateValue;

        if (typeof blockedDate === 'string') {
          blockedDateValue = blockedDate.split('T')[0];
        } else if (blockedDate.dates) {
          const dateObj = new Date(blockedDate.dates);
          blockedDateValue = getDateStringInTimezone(dateObj, selectedTimezone);
        } else if (blockedDate.date) {
          const dateObj = new Date(blockedDate.date);
          blockedDateValue = getDateStringInTimezone(dateObj, selectedTimezone);
        } else {
          return false;
        }

        return dateString === blockedDateValue;
      } catch (error) {
        console.warn('Error parsing blocked date:', blockedDate, error);
        return false;
      }
    });
  };



  const handleDateSelect = (date) => {
    // Check if date is in specific_dates
    if (isDateInSpecificDates(date)) {
      const dateString = getDateStringInTimezone(date, selectedTimezone);
      toast.error(`${dateString} is already in the specific dates, remove from the specific dates to block the ${dateString}`, {
        position: "top-right",
        autoClose: 4000,
      });
      return;
    }

    // Don't allow selection if day of week is disabled or date is already blocked
    const dayOfWeek = date.getDay();
    const isDisabledDay = disabledDates.includes(dayOfWeek);
    const isAlreadyBlocked = isDateAlreadyBlocked(date);

    if (isDisabledDay || isAlreadyBlocked) {
      return; // Don't allow selection
    }

    setSelectedDates((prev) =>
      prev.some((d) => d.getTime() === date.getTime())
        ? prev.filter((d) => d.getTime() !== date.getTime())
        : [...prev, date]
    );
  };

  const handleConfirm = async () => {
    const formattedDates = selectedDates.map((date) => date.toISOString());

    try {
      const response = await dispatch(addBlockedDates({ dates: formattedDates }));

      if (response?.payload?.success) {
        // console.log("✅ Blocked dates saved successfully, reloading page...");
        setBlockedDates([...blockedDates, ...selectedDates]);
        setSelectedDates([]);
        setIsOpen(false);

        // Reload the page after successful save
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Failed to add blocked dates:", response?.payload?.message);
      }
    } catch (error) {
      console.error("Error dispatching addBlockedDates:", error);
    }
  };

  const handleRemoveDate = async (dateToRemove) => {
    // console.log("Removing date:", dateToRemove);

    // Convert date to ISO string for backend
    const dateToRemoveISO = dateToRemove.toISOString();

    try {
      const response = await dispatch(removeBlockedDate(dateToRemoveISO));

      if (response?.payload?.success) {
        // console.log("✅ Blocked date removed successfully, reloading page...");
        // Update local state only after successful backend call
        setBlockedDates(blockedDates.filter((date) => date.getTime() !== dateToRemove.getTime()));

        // Reload the page after successful removal
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Failed to remove blocked date:", response?.payload?.message);
      }
    } catch (error) {
      console.error("Error dispatching removeBlockedDate:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Block Unavailable Dates</h2>
      <hr className="h-px mb-4 border-1 bg-gray-200" />

      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#16A348] text-white py-2.5 rounded-lg hover:bg-[#388544] transition-colors text-sm font-medium"
      >
        Block Unavailable Dates
      </button>

      {blockedDates.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Blocked Dates:</h3>
          <div className="flex flex-wrap gap-2 items-center">
            {blockedDates.map((date) => (
              <BlockedDateCard key={date.getTime()} date={date} onRemove={handleRemoveDate} />
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 mt-0">
          <div className="bg-white rounded-lg p-6 max-w-md w-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select dates to block</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-auto max-h-[75vh]">
              <style>{`
                .custom-datepicker .react-datepicker__day--highlighted,
                .custom-datepicker .react-datepicker__day--highlighted:hover {
                  background-color: white !important;
                  color: inherit !important;
                }
                .custom-datepicker .react-datepicker__day--today {
                  background-color: white !important;
                  color: inherit !important;
                  font-weight: normal !important;
                }
                .custom-datepicker .react-datepicker__day--today:hover {
                  background-color: #f3f4f6 !important;
                }
                .custom-datepicker .selected-date-green {
                  background-color: #16a34a !important;
                  color: white !important;
                }
                .custom-datepicker .selected-date-green:hover {
                  background-color: #15803d !important;
                  color: white !important;
                }
              `}</style>
              <DatePicker
                key={`datepicker-${availability?.availability?.[0]?.blockedDates?.length}-${availability?.availability?.[0]?.specific_dates?.length}`}
                inline
                onChange={handleDateSelect}
                selected={null}
                selectsMultiple={false}
                highlightDates={[]}
                todayButton={null}
                showTodayButton={false}
                minDate={new Date()}
                filterDate={(date) => {
                  // Filter out dates where day of week is disabled OR date is already blocked OR date is in specific_dates
                  const dayOfWeek = date.getDay();
                  const isDisabledDay = disabledDates.includes(dayOfWeek);
                  const isAlreadyBlocked = isDateAlreadyBlocked(date);
                  const isInSpecificDates = isDateInSpecificDates(date);

                  return !isDisabledDay && !isAlreadyBlocked && !isInSpecificDates;
                }}
                className="w-full border border-gray-300 rounded-md p-2"
                calendarClassName="bg-white shadow-md custom-datepicker"
                dayClassName={(date) => {
                  const dayOfWeek = date.getDay();
                  const isDisabledDay = disabledDates.includes(dayOfWeek);
                  const isAlreadyBlocked = isDateAlreadyBlocked(date);
                  const isInSpecificDates = isDateInSpecificDates(date);

                  if (isDisabledDay || isAlreadyBlocked || isInSpecificDates) {
                    return "bg-gray-200 text-gray-400 cursor-not-allowed !important";
                  }

                  // Check if this exact date (year, month, day) is selected
                  const isSelected = selectedDates.some((selectedDate) => {
                    const matches = selectedDate.getFullYear() === date.getFullYear() &&
                      selectedDate.getMonth() === date.getMonth() &&
                      selectedDate.getDate() === date.getDate();

                    if (matches) {
                      // console.log(`🎯 Date ${date.toDateString()} is selected for blocking`);
                    }

                    return matches;
                  });

                  // Additional check to ensure we're not accidentally highlighting today's date
                  const today = new Date();
                  const isToday = date.getFullYear() === today.getFullYear() &&
                    date.getMonth() === today.getMonth() &&
                    date.getDate() === today.getDate();

                  if (isToday && !isSelected) {
                    // console.log(`📅 Today's date ${date.toDateString()} - not selected, using normal styling`);
                    return "hover:bg-gray-100 rounded-md bg-white !bg-white"; // Force normal styling for today's date
                  }

                  if (isSelected) {
                    // console.log(`✅ Applying selected styling to ${date.toDateString()}`);
                    return "!text-white !bg-green-600 rounded-md selected-date-green";
                  }

                  return "hover:bg-gray-100 rounded-md bg-white !bg-white";
                }}
              />
            </div>

            <button
              onClick={handleConfirm}
              className="w-full mt-4 bg-[#16A348] text-white py-2.5 rounded-lg hover:bg-[#388544] transition-colors font-medium"
            >
              Confirm Blocked Dates
            </button>
          </div>
        </div>
      )}
    </div>
  );

}

export default BlockUnavailableDates;