import { useState } from 'react';

const MeetingNotes = () => {
  const [notes, setNotes] = useState('');

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Meeting Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-48 p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add your meeting notes here..."
        />
      </div>
      
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default MeetingNotes;