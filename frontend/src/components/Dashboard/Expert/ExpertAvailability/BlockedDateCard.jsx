import React from 'react';
import { TrashIcon } from '@/icons/Icons';

function BlockedDateCard({ date, onRemove }) {
  return (
    <div className="bg-gray-100 w-36 rounded-md px-5 py-3 flex items-center justify-between">
      <span className="text-sm text-gray-900 font-medium">
        {date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        })}
      </span>
      <button
        onClick={() => onRemove(date)}
        className="text-red-500 hover:text-red-700 p-1"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default BlockedDateCard;