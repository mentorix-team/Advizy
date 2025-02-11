import { useState } from 'react';

export function MeetingTabs({ children }) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 rounded-lg text-sm ${
            activeTab === 'details' 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Details
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-lg text-sm ${
            activeTab === 'notes' 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Notes
        </button>
      </div>
      {children[activeTab]}
    </div>
  );
}