import { useState } from 'react';
import { ArrowUpRightIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
// import { MeetingDetailsModal } from './MeetingDetailsModal';

export function UpcomingSessions({ sessions }) {
  const [selectedSession, setSelectedSession] = useState(null);

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
        </div>
        
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <span>{session.date}</span>
                  <span>{session.time}</span>
                </div>
                <button 
                  onClick={() => navigate(`/dashboard/expert/meetings`)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ArrowUpRightIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <h3 className="text-green-600 font-medium mb-1">{session.title}</h3>
              <p className="text-sm text-gray-500">{session.service}</p>
              <p className="text-sm text-gray-400">Duration: {session.duration}</p>
              {session.notes && (
                <div className="mt-3 p-3 bg-white rounded-lg">
                  <p className="text-sm text-gray-600">{session.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* {selectedSession && (
        <MeetingDetailsModal 
          session={selectedSession} 
          onClose={() => setSelectedSession(null)} 
        />
      )} */}
    </>
  );
}