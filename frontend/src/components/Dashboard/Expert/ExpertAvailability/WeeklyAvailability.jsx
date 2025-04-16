import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DayRow from "./DayRow";
import { validateTimeSlot, checkOverlap } from "@/utils/timeValidation";
import { addAvailability, saveAvailability } from "@/Redux/Slices/availability.slice";

const DAYS = [
  { id: 1, name: "Monday", enabled: true },
  { id: 2, name: "Tuesday", enabled: true },
  { id: 3, name: "Wednesday", enabled: true },
  { id: 4, name: "Thursday", enabled: true },
  { id: 5, name: "Friday", enabled: true },
  { id: 6, name: "Saturday", enabled: true },
  { id: 7, name: "Sunday", enabled: true },
];

function WeeklyAvailability({availability}) {

  console.log('this is availa at wee',availability)
  const dispatch = useDispatch();
  const [days, setDays] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize days state based on availability
  useEffect(() => {
    if (availability && availability.length > 0 && availability[0].daySpecific) {
      const daySpecific = availability[0].daySpecific;
      
      const initialDays = daySpecific.map((dayData) => {
        // Day is enabled only if it has slots array with at least one slot
        const isEnabled = Array.isArray(dayData.slots) && dayData.slots.length > 0;
        
        const slots = isEnabled 
          ? dayData.slots.map(slot => ({
              id: slot._id || Date.now() + Math.random(),
              start: convertTo12HourFormat(slot.startTime),
              end: convertTo12HourFormat(slot.endTime)
            }))
          : [{ id: Date.now(), start: "", end: "" }]; // Default empty slot for disabled days
        
        return {
          id: getDayId(dayData.day),
          name: dayData.day,
          enabled: isEnabled,
          slots,
          error: null
        };
      });

      setDays(initialDays);
      setIsLoading(false);
    }
  }, [availability]);

  // More robust time conversion function
  const convertTo12HourFormat = (time24) => {
    if (!time24 || typeof time24 !== 'string') return "";
    
    try {
      // Remove any whitespace and convert to uppercase for consistent comparison
      time24 = time24.trim().toUpperCase();
      
      // If already in 12-hour format with AM/PM, return as is
      if (time24.includes('AM') || time24.includes('PM')) {
        return time24;
      }
      
      // Handle 24-hour format (HH:MM or H:MM)
      const [hoursStr, minutesStr] = time24.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = minutesStr || '00';
      
      if (isNaN(hours) || hours < 0 || hours > 23) return "";
      
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
      
      return `${hours12}:${minutes.padStart(2, '0')} ${period}`;
    } catch (e) {
      console.error(`Failed to convert time "${time24}":`, e);
      return "";
    }
  };

  const getDayId = (dayName) => {
    const dayMap = {
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
      'Sunday': 7
    };
    return dayMap[dayName] || 0;
  };

  const handleToggle = (dayId) => {
    setDays(
      days.map((day) =>
        day.id === dayId
          ? { ...day, enabled: !day.enabled, error: null }
          : day
      )
    );
  };

  const handleTimeChange = (dayId, slotId, type, time) => {
    setDays((prevDays) =>
      prevDays.map((day) => {
        if (day.id === dayId) {
          const updatedSlots = day.slots.map((slot) =>
            slot.id === slotId ? { ...slot, [type]: time } : slot
          );

          const modifiedSlot = updatedSlots.find((slot) => slot.id === slotId);

          let validationError = null;
          if (modifiedSlot.start && modifiedSlot.end) {
            validationError = validateTimeSlot(
              modifiedSlot.start,
              modifiedSlot.end
            );
          }

          const overlapError = checkOverlap(updatedSlots);

          return {
            ...day,
            slots: updatedSlots,
            error: validationError || overlapError,
          };
        }
        return day;
      })
    );
  };

  const handleAddSlot = (dayId) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            slots: [...day.slots, { id: Date.now(), start: "", end: "" }],
            error: null,
          };
        }
        return day;
      })
    );
  };

  const handleRemoveSlot = (dayId, slotId) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            slots: day.slots.filter((slot) => slot.id !== slotId),
            error: null,
          };
        }
        return day;
      })
    );
  };

  const handleApplyToAll = (sourceDay) => {
    if (!sourceDay.enabled || sourceDay.error) return;

    const sourceSlots = sourceDay.slots;
    setDays(
      days.map((day) => {
        if (day.enabled && day.id !== sourceDay.id) {
          return {
            ...day,
            slots: sourceSlots.map((slot) => ({
              id: Date.now() + Math.random(),
              start: slot.start,
              end: slot.end,
            })),
          };
        }
        return day;
      })
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
  
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // Month is zero-indexed (0 = January)
  
      const getDatesForDay = (day) => {
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayIndex = daysOfWeek.indexOf(day);
  
        if (dayIndex === -1) return [];
  
        const dates = [];
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
        for (
          let date = new Date(firstDayOfMonth);
          date <= lastDayOfMonth;
          date.setDate(date.getDate() + 1)
        ) {
          if (date.getDay() === dayIndex) {
            dates.push(new Date(date)); // Push a copy of the date
          }
        }
        return dates;
      };
  
      const data = days
        .filter((day) => day.enabled) // Include only enabled days
        .map((day) => {
          const dates = getDatesForDay(day.name); // Get all dates for this day in the current month
  
          return {
            day: day.name,
            slots: day.slots.map((slot) => ({
              startTime: slot.start,
              endTime: slot.end,
              dates: dates.map((date) => date.toISOString()), // Convert dates to ISO strings
            })),
          };
        });
  
      dispatch(addAvailability({ data })); // Dispatch the action
      console.log("Dispatched data with dates:", data);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  useEffect(() => {
    if (days.length > 0) {
      console.log('Mapped days state:', days);
    }
  }, [days]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Weekly Hours Availability
          </h2>
        </div>
        <button
          id="save-changes-button"
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors w-full sm:w-auto
            ${
              isSaving
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
  
      <div className="divide-y divide-gray-100">
        {days.map((day) => (
          <DayRow
            key={day.id}
            day={day}
            onToggle={handleToggle}
            onTimeChange={handleTimeChange}
            onAddSlot={handleAddSlot}
            onRemoveSlot={handleRemoveSlot}
            onApplyToAll={handleApplyToAll}
          />
        ))}
      </div>
    </div>
  );
}

export default WeeklyAvailability;