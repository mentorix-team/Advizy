import React, { useState } from "react";
import DatePicker from "react-datepicker";
import TimeRangePicker from "./TimeInput";
import { PlusIcon, TrashIcon } from "@/icons/Icons";
import { useBlockedDates } from "@/Context/BlockedDatesContext";
import { validateTimeSlot, checkOverlap } from "@/utils/timeValidation";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { addSpecificDates } from "@/Redux/Slices/availability.slice";

function DateSpecificHours() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dates, setDates] = useState([]);
  const [errors, setErrors] = useState({});
  const { blockedDates } = useBlockedDates();
  const dispatch = useDispatch();

  const isDateBlocked = (date) =>
    blockedDates.some(
      (blockedDate) => blockedDate.getTime() === date.getTime()
    );

    const handleAddDate = (selectedDate) => {
      if (isDateBlocked(selectedDate)) {
        alert("This date is blocked or already selected.");
        return;
      }
      const newDate = {
        id: Date.now(),
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
    setDates((prevDates) => prevDates.filter((date) => date.id !== dateId));
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
    const formattedData = dates.map((date) => ({
      date: date.date.toISOString(), 
      slots: date.slots.map((slot) => ({
        start: slot.start, 
        end: slot.end, 
      })),
    }));
    console.log(formattedData)
  
    dispatch(addSpecificDates(formattedData));
  
    console.log("Formatted Data Sent to API:", formattedData);
  };
  
  const getDaysWithAvailability = () => {
    // Get the days of the week (0 = Sunday, 1 = Monday, etc.) from the `dates` array where slots exist
    return dates
      .filter((date) => date.slots.length > 0) // Check only dates with slots
      .map((date) => date.date.getDay()); // Get the day of the week
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
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
                const daysWithAvailability = getDaysWithAvailability();
                return !daysWithAvailability.includes(date.getDay()); // Disable days with availability
              }}
            />;
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