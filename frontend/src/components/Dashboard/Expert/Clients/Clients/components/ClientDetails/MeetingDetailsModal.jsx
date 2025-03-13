import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { MeetingNotes } from '../meetings/details/MeetingNotes';
import { MeetingDetailsView } from './MeetingDetailsView';

export function MeetingDetailsModal({ session, onClose }) {
  const [activeTab, setActiveTab] = useState('details');
  const [currentNotes, setCurrentNotes] = useState(session.notes || '');

  const handleSaveNotes = (notes) => {
    session.notes = notes;
    setCurrentNotes(notes);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Meeting Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Session information with {session.clientName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
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

          {activeTab === 'details' ? (
            <MeetingDetailsView session={{...session, notes: currentNotes}} />
          ) : (
            <MeetingNotes 
              initialNotes={currentNotes}
              onSave={handleSaveNotes}
            />
          )}

          <div className="flex gap-3 pt-6 mt-6 border-t">
            <button className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
              Cancel Meeting
            </button>
            <button className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
              Reschedule Meeting
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 ml-auto">
              Schedule Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}