import React from 'react';

function TabNavigation({ activeTab, onTabChange }) {
  return (
    <div className="flex space-x-1 mb-6">
      <button
        onClick={() => onTabChange('schedule')}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          activeTab === 'schedule'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Schedule
      </button>
      <button
        onClick={() => onTabChange('settings')}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          activeTab === 'settings'
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Settings
      </button>
    </div>
  );
}

export default TabNavigation;