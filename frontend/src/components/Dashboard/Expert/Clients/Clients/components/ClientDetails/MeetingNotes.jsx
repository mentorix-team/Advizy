import { useState } from 'react';

export function MeetingNotes({ initialNotes = '', onSave }) {
  const [notes, setNotes] = useState(initialNotes);

  return (
    <div className="space-y-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add meeting notes here..."
        className="w-full h-48 p-3 text-sm text-gray-600 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <button
        onClick={() => onSave(notes)}
        className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
      >
        Save Notes
      </button>
    </div>
  );
}