import { useState } from 'react';

export function SessionFilters({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    sessionStatus: [],
    paymentStatus: [],
    timePeriod: null
  });
  const [tempFilters, setTempFilters] = useState({
    sessionStatus: [],
    paymentStatus: [],
    timePeriod: null
  });

  const filters = {
    sessionStatus: [
      { label: 'Session Complete', value: 'session complete' },
      { label: 'Session Complete & Payment Received', value: 'session complete & payment received' },
      { label: 'Cancelled', value: 'cancelled' }
    ],
    paymentStatus: [
      { label: 'Payment Received', value: 'payment received' },
      { label: 'Payment Pending', value: 'payment pending' },
      { label: 'Payment Failed', value: 'payment failed' }
    ],
    timePeriod: [
      { label: 'Today', value: 'today' },
      { label: 'This Week', value: 'thisWeek' },
      { label: 'This Month', value: 'thisMonth' }
    ]
  };

  const handleFilterChange = (category, value) => {
    const newFilters = { ...tempFilters };
    
    if (category === 'timePeriod') {
      newFilters.timePeriod = newFilters.timePeriod === value ? null : value;
    } else {
      const index = newFilters[category].indexOf(value);
      if (index === -1) {
        newFilters[category].push(value);
      } else {
        newFilters[category].splice(index, 1);
      }
    }
    
    setTempFilters(newFilters);
  };

  const handleApply = () => {
    setSelectedFilters(tempFilters);
    onFilterChange(tempFilters);
    setIsOpen(false);
  };

  const handleOpen = () => {
    setTempFilters(selectedFilters);
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
        </svg>
        Filter
        {(selectedFilters.sessionStatus.length > 0 || 
          selectedFilters.paymentStatus.length > 0 || 
          selectedFilters.timePeriod) && (
          <span className="flex h-2 w-2 rounded-full bg-green-600"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Session Status</h3>
              {filters.sessionStatus.map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={tempFilters.sessionStatus.includes(value)}
                    onChange={() => handleFilterChange('sessionStatus', value)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Status</h3>
              {filters.paymentStatus.map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    checked={tempFilters.paymentStatus.includes(value)}
                    onChange={() => handleFilterChange('paymentStatus', value)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Time Period</h3>
              {filters.timePeriod.map(({ label, value }) => (
                <label key={value} className="flex items-center gap-2 py-1">
                  <input
                    type="radio"
                    checked={tempFilters.timePeriod === value}
                    onChange={() => handleFilterChange('timePeriod', value)}
                    className="rounded-full border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}