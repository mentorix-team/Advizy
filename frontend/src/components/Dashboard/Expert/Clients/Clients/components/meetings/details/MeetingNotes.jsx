import { useState } from 'react';
import { Toast } from '../../Toast/Toast';

export function MeetingNotes({ initialNotes = '', onSave }) {
  const [notes, setNotes] = useState(initialNotes);
  const [showToast, setShowToast] = useState(false);

  const handleSaveNotes = () => {
    onSave(notes);
    setNotes(''); // Clear the notes after saving
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

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
        <button 
          onClick={handleSaveNotes}
          className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          Save Notes
        </button>
      </div>

      {showToast && (
        <Toast
          message="Notes saved successfully!"
          type="success"
          duration={2000}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}