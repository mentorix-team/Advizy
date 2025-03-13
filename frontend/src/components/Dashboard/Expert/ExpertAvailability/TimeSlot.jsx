import React from 'react';
import TimeInput from './TimeInput';
import { TrashIcon } from '@/icons/Icons';
import { validateTimeSlot } from '@/utils/timeValidation';

function TimeSlot({ 
  startTime, 
  endTime, 
  disabled, 
  onStartChange, 
  onEndChange, 
  onRemove,
  minTime,
  maxTime 
}) {
  const handleTimeChange = (type, time) => {
    const newStart = type === 'start' ? time : startTime;
    const newEnd = type === 'end' ? time : endTime;

    const error = validateTimeSlot(newStart, newEnd);
    if (!error) {
      if (type === 'start') {
        onStartChange(time);
      } else {
        onEndChange(time);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <TimeInput
        value={startTime}
        onChange={(time) => handleTimeChange('start', time)}
        disabled={disabled}
        minTime={minTime}
        maxTime={endTime}
      />
      <span className="text-gray-500 text-sm">to</span>
      <TimeInput
        value={endTime}
        onChange={(time) => handleTimeChange('end', time)}
        disabled={disabled}
        minTime={startTime}
        maxTime={maxTime}
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md"
          title="Remove slot"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default TimeSlot;