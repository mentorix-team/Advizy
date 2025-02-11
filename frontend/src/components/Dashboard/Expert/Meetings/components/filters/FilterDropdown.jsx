import { useState } from 'react';
import PropTypes from 'prop-types';

const FilterDropdown = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Today');

  const filters = [
    'Today',
    'This Week',
    'This Month',
    'Scheduled',
    'Completed',
    'Cancelled'
  ];

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-md shadow-sm border border-gray-200 flex items-center space-x-2"
      >
        <span>Filter by</span>
        <span className="ml-2">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
          <ul className="py-1">
            {filters.map((filter) => (
              <li
                key={filter}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                onClick={() => handleFilterSelect(filter)}
              >
                {selectedFilter === filter && (
                  <span className="mr-2 text-green-600">✓</span>
                )}
                <span className={selectedFilter === filter ? 'text-green-600' : ''}>
                  {filter}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

FilterDropdown.propTypes = {
  onFilterChange: PropTypes.func.isRequired
};

export default FilterDropdown;