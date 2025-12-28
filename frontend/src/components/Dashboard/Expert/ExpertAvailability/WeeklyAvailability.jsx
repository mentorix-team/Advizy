import React, { useState } from "react";
import { useDispatch } from "react-redux";
import DayRow from "./DayRow";
import {
  validateTimeSlot,
  checkOverlap,
  convert24To12Hour,
  convertTo24Hour,
} from "@/utils/timeValidation";
import {
  addAvailability,
  saveAvailability,
} from "@/Redux/Slices/availability.slice";

const DAYS = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 7, name: "Sunday" },
];

function WeeklyAvailability({ availability }) {
  const dispatch = useDispatch();

  // console.log("🔍 WeeklyAvailability received availability:", availability);

  const [days, setDays] = useState(() => {
    if (
      availability &&
      availability.length > 0 &&
      availability[0].daySpecific
    ) {
      const apiDays = availability[0].daySpecific;

      // console.log("📊 Processing apiDays:", apiDays);

      return DAYS.map((day) => {
        const matchedDay = apiDays.find((d) => d.day === day.name);

        // console.log(`🔎 Processing day ${day.name}:`, matchedDay);

        if (matchedDay && matchedDay.slots && matchedDay.slots.length > 0) {
          // Populate slots dynamically
          const processedSlots = matchedDay.slots.map((slot, index) => {
            // console.log(`⏰ Processing slot for ${day.name}:`, slot);

            const startTime = slot.startTime.includes("AM") || slot.startTime.includes("PM")
              ? slot.startTime
              : convert24To12Hour(slot.startTime);

            const endTime = slot.endTime.includes("AM") || slot.endTime.includes("PM")
              ? slot.endTime
              : convert24To12Hour(slot.endTime);

            // console.log(`⏰ Converted times for ${day.name}: ${slot.startTime} -> ${startTime}, ${slot.endTime} -> ${endTime}`);

            return {
              id: index + 1,
              start: startTime,
              end: endTime,
            };
          });

          return {
            ...day,
            enabled: true,
            slots: processedSlots,
            error: null,
          };
        } else {
          // No slots for that day → toggle off
          return {
            ...day,
            enabled: false,
            slots: [{ id: 1, start: "", end: "" }],
            error: null,
          };
        }
      });
    } else {
      // No availability data → default static
      return DAYS.map((day) => ({
        ...day,
        enabled: true,
        slots: [{ id: 1, start: "09:00 AM", end: "10:00 AM" }],
        error: null,
      }));
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (dayId) => {
    setDays(
      days.map((day) =>
        day.id === dayId ? { ...day, enabled: !day.enabled, error: null } : day
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
      const currentMonth = currentDate.getMonth();

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
            dates.push(new Date(date));
          }
        }
        return dates;
      };

      const data = days
        .filter((day) => day.enabled)
        .map((day) => {
          const dates = getDatesForDay(day.name);

          return {
            day: day.name,
            slots: day.slots.map((slot) => {
              const startTime24 = convertTo24Hour(slot.start);
              const endTime24 = convertTo24Hour(slot.end);

              // console.log(`💾 Converting for save: ${slot.start} -> ${startTime24}, ${slot.end} -> ${endTime24}`);

              return {
                startTime: startTime24,
                endTime: endTime24,
                dates: dates.map((date) => date.toISOString()),
              };
            }),
          };
        });

      const result = await dispatch(addAvailability({ data }));
      // console.log("Dispatched data with dates:", data);

      // Check if the save was successful and reload the page
      if (result.type === 'availability/addAvailability/fulfilled') {
        // console.log("✅ Weekly availability saved successfully, reloading page...");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

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
            ${isSaving
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
