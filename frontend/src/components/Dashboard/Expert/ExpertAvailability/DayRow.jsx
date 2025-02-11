import React from "react";
import TimeRangePicker from "./TimeInput";
import Toggle from "./Toggle";
import { PlusIcon, TrashIcon } from "@/icons/Icons";

function DayRow({
  day,
  onToggle,
  onTimeChange,
  onAddSlot,
  onRemoveSlot,
  onApplyToAll,
}) {
  return (
    <div className="flex items-start space-x-6 py-3 border-b border-gray-100 last:border-b-0">
      <div className="w-28">
        <Toggle
          label={day.name}
          checked={day.enabled}
          onChange={() => onToggle(day.id)}
        />
      </div>
      <div className="flex-1">
        <div className="space-y-3">
          {day.slots.map((slot) => (
            <div key={slot.id} className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <TimeRangePicker
                  startTime={slot.start}
                  endTime={slot.end}
                  disabled={!day.enabled}
                  onStartChange={(time) =>
                    onTimeChange(day.id, slot.id, "start", time)
                  }
                  onEndChange={(time) =>
                    onTimeChange(day.id, slot.id, "end", time)
                  }
                />
                <button
                  onClick={() => onAddSlot(day.id)}
                  className="p-1.5 text-green-600 hover:bg-green-50 border border-green-600 rounded-md"
                  disabled={!day.enabled}
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                </button>
                {day.slots.length > 1 && (
                  <button
                    onClick={() => onRemoveSlot(day.id, slot.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => onApplyToAll(day)}
                className="text-sm text-gray-600 hover:text-black font-medium border border-gray-300 rounded-md px-3 py-1.5"
                disabled={!day.enabled}
              >
                Apply to All
              </button>
            </div>
          ))}
          {day.error && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
              {day.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DayRow;
