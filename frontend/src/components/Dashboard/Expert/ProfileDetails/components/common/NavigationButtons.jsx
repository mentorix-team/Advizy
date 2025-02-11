import React from 'react';

export default function NavigationButtons() {
  return (
    <div className="flex justify-between mt-6">
      <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">
        Previous
      </button>
      <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600">
        Next
      </button>
    </div>
  );
}