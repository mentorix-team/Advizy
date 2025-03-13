import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

export default function TimeSlotInput({ timeSlots, onAdd, onRemove }) {
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  const handleAdd = () => {
    if (duration && price) {
      onAdd({ duration: parseInt(duration), price: parseFloat(price) });
      setDuration('');
      setPrice('');
    }
  };

  return (
    <div className="text-left">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Time Slots <span className="text-red-500">*</span>
      </label>
      
      {timeSlots.map((slot, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <div className="flex-1 p-2 bg-gray-50 rounded-lg">
            {slot.duration}min - ${slot.price}
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-gray-500 hover:text-red-500"
          >
            <FaTrash />
          </button>
        </div>
      ))}

      <div className="flex gap-2 mt-2">
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (min)"
          className="flex-1 p-2 border rounded-lg focus:ring-primary focus:border-primary"
          min="1"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price ($)"
          className="flex-1 p-2 border rounded-lg focus:ring-primary focus:border-primary"
          min="0"
          step="0.01"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
        >
          + Add
        </button>
      </div>
    </div>
  );
}