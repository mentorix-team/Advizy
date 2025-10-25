import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import TimeRangePicker from "./TimeInput";
import { PlusIcon, TrashIcon } from "@/icons/Icons";
import { useBlockedDates } from "@/Context/BlockedDatesContext";
import { validateTimeSlot, checkOverlap } from "@/utils/timeValidation";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { addSpecificDates } from "@/Redux/Slices/availability.slice";
import { convertTo24Hour } from "@/utils/timeValidation";
import toast from "react-hot-toast";

// Helper function to convert local date to ISO string while preserving the date in the selected timezone
const getDateStringInTimezone = (dateObj, timezone) => {
  // Create a formatter for the specified timezone
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

  // Return in YYYY-MM-DD format (local date in the timezone)
  return `${year}-${month}-${day}`;
};

// Helper function to convert 24-hour format (04:30) to 12-hour format (4:30 AM)
const convertTo12Hour = (time24) => {
  if (!time24) return '';

  const [hours24, minutes] = time24.split(':');
  let hours = parseInt(hours24);
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // Convert 0 to 12 (midnight), 13+ to 1-11

  return `${hours}:${minutes} ${ampm}`;
};

function DateSpecificHours({ availability }) {
  console.log("this is availability at specifuc", availability);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dates, setDates] = useState([]);
  const [errors, setErrors] = useState({});
  const [originalDates, setOriginalDates] = useState([]); // Track original dates for deletion
  const { blockedDates: blockedDatesContext } = useBlockedDates();
  const dispatch = useDispatch();

  // Get the selected timezone from Redux store
  const { availability: availabilityData } = useSelector((state) => state.availability);
  const selectedTimezone = availabilityData?.timezone?.value || "Asia/Kolkata";

  // Helper function to check if a date is blocked from Redux state
  const getBlockedDatesFromAvailability = () => {
    const expertAvailability = availability?.availability?.[0];
    if (!expertAvailability?.blockedDates || !Array.isArray(expertAvailability.blockedDates)) {
      return [];
    }

    return expertAvailability.blockedDates.map((dateObj) => {
      if (typeof dateObj === 'string') {
        return new Date(dateObj);
      } else if (dateObj.dates) {
        return new Date(dateObj.dates);
      } else if (dateObj.date) {
        return new Date(dateObj.date);
      }
      return null;
    }).filter(date => date !== null);
  };

  const isDateBlocked = (date) => {
    const blockedDatesFromAvailability = getBlockedDatesFromAvailability();

    // Compare by date string (YYYY-MM-DD) in the selected timezone
    const dateString = getDateStringInTimezone(date, selectedTimezone);

    console.log(`🔍 Checking if date is blocked: ${dateString}`);

    // Check blocked dates from Redux state
    const isBlockedFromRedux = blockedDatesFromAvailability.some((blockedDate) => {
      const blockedDateString = getDateStringInTimezone(blockedDate, selectedTimezone);
      console.log(`  📅 Comparing: "${dateString}" vs blocked "${blockedDateString}"`);
      return dateString === blockedDateString;
    });

    // Check blocked dates from context (for immediate feedback during blocking)
    const isBlockedFromContext = blockedDatesContext.some((blockedDate) => {
      const blockedDateString = getDateStringInTimezone(blockedDate, selectedTimezone);
      return dateString === blockedDateString;
    });

    const result = isBlockedFromRedux || isBlockedFromContext;
    console.log(`  ✅ Is blocked? ${result}`);

    return result;
  };

  useEffect(() => {
    const availabilityArray = availability?.availability;
    if (
      Array.isArray(availabilityArray) &&
      availabilityArray.length > 0 &&
      Array.isArray(availabilityArray[0].specific_dates) &&
      availabilityArray[0].specific_dates.length > 0
    ) {
      const formattedDates = availabilityArray[0].specific_dates.map(
        (specificDate) => {
          const dateObj = new Date(specificDate.date);
          // Extract just the date part using the selected timezone
          const dateString = getDateStringInTimezone(dateObj, selectedTimezone);

          console.log(`✅ Loading date from DB: ${specificDate.date} -> ${dateString} (timezone: ${selectedTimezone})`);

          return {
            id: dateString, // Use consistent date string as ID
            originalDate: specificDate.date, // Keep original date for reference
            date: dateObj,
            slots: specificDate.slots.map((slot) => {
              // Convert 24-hour format from DB back to 12-hour format for display
              const startTime12 = convertTo12Hour(slot.startTime);
              const endTime12 = convertTo12Hour(slot.endTime);

              console.log(`⏰ Loading slot: ${slot.startTime} -> ${startTime12}, ${slot.endTime} -> ${endTime12}`);

              return {
                id: Date.now() + Math.random(),
                start: startTime12,
                end: endTime12,
              };
            }),
          };
        }
      );
      setDates(formattedDates);
      setOriginalDates(formattedDates); // Store original dates for comparison
      console.log("✅ Loaded dates from availability:", formattedDates);
    }
  }, [availability, selectedTimezone]);

  const handleAddDate = (selectedDate) => {
    // Use timezone-aware date string
    const dateString = getDateStringInTimezone(selectedDate, selectedTimezone);
    console.log(`📅 Adding date: ${selectedDate.toISOString()} -> ${dateString} (timezone: ${selectedTimezone})`);

    const newDate = {
      id: dateString, // Use consistent date string format
      originalDate: dateString,
      date: selectedDate,
      slots: [],
    };
    setDates([...dates, newDate]);
    setIsDatePickerOpen(false);
  };

  const getExcludedDates = () => {
    const selectedDates = dates.map((date) => date.date);
    return [...selectedDates, ...blockedDates];
  };

  const handleAddSlot = (dateId) => {
    setDates((prevDates) =>
      prevDates.map((date) => {
        if (date.id === dateId) {
          const newSlot = { id: Date.now(), start: "", end: "" };
          return { ...date, slots: [...date.slots, newSlot] };
        }
        return date;
      })
    );
  };

  const handleRemoveSlot = (dateId, slotId) => {
    setDates((prevDates) =>
      prevDates.map((date) =>
        date.id === dateId
          ? { ...date, slots: date.slots.filter((slot) => slot.id !== slotId) }
          : date
      )
    );
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[slotId];
      return updatedErrors;
    });
  };

  const handleRemoveDate = (dateId) => {
    console.log("🗑️ Removing date:", dateId);
    setDates((prevDates) => {
      const updated = prevDates.filter((date) => date.id !== dateId);
      console.log("📋 Remaining dates after removal:", updated);
      return updated;
    });
  };

  const handleTimeChange = (dateId, slotId, newStart, newEnd) => {
    setDates((prevDates) =>
      prevDates.map((date) => {
        if (date.id === dateId) {
          const updatedSlots = date.slots.map((slot) => {
            if (slot.id === slotId) {
              return { ...slot, start: newStart, end: newEnd };
            }
            return slot;
          });

          const validationError =
            validateTimeSlot(newStart, newEnd) || checkOverlap(updatedSlots);

          if (validationError) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              [slotId]: validationError,
            }));
          } else {
            setErrors((prevErrors) => ({ ...prevErrors, [slotId]: null }));
          }

          return { ...date, slots: updatedSlots };
        }
        return date;
      })
    );
  };

  const handleSave = () => {
    console.log("💾 Saving date-specific hours...");
    console.log("📊 Current dates state:", dates);
    console.log("📊 Original dates state:", originalDates);
    console.log("🌍 Using timezone:", selectedTimezone);

    // Validate: Check for dates without slots
    const datesWithoutSlots = dates.filter((date) => date.slots.length === 0);
    if (datesWithoutSlots.length > 0) {
      const datesList = datesWithoutSlots.map((date) => date.date.toLocaleDateString()).join(", ");
      console.warn("⚠️ Dates without slots detected:", datesList);
      toast.error(`Please add time slots for: ${datesList}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate: Check for dates with invalid time slots
    const datesWithInvalidSlots = dates.filter((date) =>
      date.slots.some((slot) => {
        const validationError = validateTimeSlot(slot.start, slot.end);
        return validationError || !slot.start || !slot.end;
      })
    );

    if (datesWithInvalidSlots.length > 0) {
      const datesList = datesWithInvalidSlots.map((date) => date.date.toLocaleDateString()).join(", ");
      console.warn("⚠️ Dates with invalid time slots detected:", datesList);
      toast.error(`Please select a valid time slot for: ${datesList}`, {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Only include dates that have at least one slot
    const datesWithSlots = dates.filter((date) => date.slots.length > 0);

    console.log("📊 Dates with slots:", datesWithSlots);
    console.log("📊 Dates without slots (will be removed):", dates.filter((date) => date.slots.length === 0));

    // Format the data to send to backend
    const formattedData = datesWithSlots.map((date) => {
      // Convert the local date to ISO string at midnight in the selected timezone
      const dateStringInTz = getDateStringInTimezone(date.date, selectedTimezone);
      console.log(`📅 Processing date: ${date.date.toLocaleDateString()} -> ${dateStringInTz}`);

      return {
        date: dateStringInTz, // Send as YYYY-MM-DD string instead of ISO timestamp
        slots: date.slots.map((slot) => {
          // Convert 12-hour format to 24-hour format
          const startTime24 = convertTo24Hour(slot.start);
          const endTime24 = convertTo24Hour(slot.end);

          console.log(`  ⏰ Slot: ${slot.start} -> ${startTime24}, ${slot.end} -> ${endTime24}`);

          return {
            startTime: startTime24,
            endTime: endTime24,
          };
        }),
      };
    });

    // Find deleted dates (dates that were in originalDates but not in current formatted data)
    const currentDateStrings = formattedData.map((d) => d.date);
    const originalDateStrings = originalDates.map((d) => getDateStringInTimezone(d.date, selectedTimezone));
    const deletedDates = originalDateStrings.filter(
      (dateStr) => !currentDateStrings.includes(dateStr)
    );

    if (deletedDates.length > 0) {
      console.log("🗑️ Deleted dates detected:", deletedDates);
    }

    console.log("📤 Final formatted data to send to API:", JSON.stringify(formattedData, null, 2));
    console.log("🔢 Sending", formattedData.length, "dates to backend (deleted:", deletedDates.length, ")");

    // Create payload with explicit data
    const payload = {
      specific_dates: formattedData,
      deletedDates: deletedDates // Send deleted dates info for debugging
    };

    console.log("📦 Full payload:", payload);

    // Dispatch with additional deleted dates info
    dispatch(addSpecificDates(formattedData));

    // Update originalDates to reflect current state
    setOriginalDates(datesWithSlots);

    toast.success("Date-specific hours saved successfully!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const getDaysWithAvailability = () => {
    // Get the days of the week (0 = Sunday, 1 = Monday, etc.) from the `dates` array where slots exist
    return dates
      .filter((date) => date.slots.length > 0) // Check only dates with slots
      .map((date) => date.date.getDay()); // Get the day of the week
  };

  // Helper function to check if a date is in specific_dates
  const isDateInSpecificDates = (date) => {
    const dateString = getDateStringInTimezone(date, selectedTimezone);
    return dates.some(d => getDateStringInTimezone(d.date, selectedTimezone) === dateString);
  };

  // Helper function to check if day of week is disabled
  const isDisabledDay = (date) => {
    const expertAvailability = availability?.availability?.[0];
    if (!expertAvailability?.daySpecific) return false;

    const dayOfWeek = date.getDay();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    const dayData = expertAvailability.daySpecific.find(d => d.day === dayName);

    // Day is disabled if it has no slots
    return !dayData || !dayData.slots || dayData.slots.length === 0;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg font-semibold text-gray-900">
          Date-Specific Hours
        </h2>
        <button
          onClick={() => setIsDatePickerOpen(true)}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Add Date
        </button>
      </div>

      {/* Render Dates and Slots */}
      {dates.map((date) => (
        <div key={date.id} className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900">
              {date.date.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddSlot(date.id)}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
              >
                <PlusIcon className="w-4 h-4" />
                Add Slot
              </button>
              <button
                onClick={() => handleRemoveDate(date.id)}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <TrashIcon className="w-4 h-4" />
                Remove Date
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {date.slots.map((slot) => (
              <div key={slot.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <TimeRangePicker
                    startTime={slot.start}
                    endTime={slot.end}
                    onStartChange={(newStart) =>
                      handleTimeChange(date.id, slot.id, newStart, slot.end)
                    }
                    onEndChange={(newEnd) =>
                      handleTimeChange(date.id, slot.id, slot.start, newEnd)
                    }
                  />
                  <button
                    onClick={() => handleRemoveSlot(date.id, slot.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md ml-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                {errors[slot.id] && (
                  <p className="text-red-500 text-sm">{errors[slot.id]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Date Picker Modal */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select a date</h3>
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <DatePicker
              inline
              onChange={handleAddDate}
              selected={null}
              monthsShown={1}
              minDate={new Date()}
              filterDate={(date) => {
                // Filter out: blocked dates, disabled days of week, and already selected dates
                return !isDateBlocked(date) && !isDisabledDay(date) && !isDateInSpecificDates(date);
              }}
              dayClassName={(date) => {
                const isBlocked = isDateBlocked(date);
                const isAlreadySelected = isDateInSpecificDates(date);
                const isDisabledDayOfWeek = isDisabledDay(date);

                if (isBlocked || isAlreadySelected || isDisabledDayOfWeek) {
                  return "bg-gray-200 text-gray-400 cursor-not-allowed";
                }
                return "hover:bg-gray-100 rounded-md";
              }}
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-primary text-white rounded-md p-2"
        >
          Save Dates and Slots
        </button>
      </div>
    </div>
  );
}

export default DateSpecificHours;
