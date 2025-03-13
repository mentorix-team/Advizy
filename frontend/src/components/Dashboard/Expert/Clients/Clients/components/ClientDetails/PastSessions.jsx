import { PencilIcon } from '@heroicons/react/24/outline';
import { SessionDetailsCard } from './SessionDetailsCard';
import { SessionFilters } from './SessionFilters';
import { useState } from 'react';

export function PastSessions({ sessions }) {
  const [filteredSessions, setFilteredSessions] = useState(sessions);

  const handleFilterChange = (filters) => {
    let filtered = [...sessions];

    if (filters.sessionStatus.length > 0) {
      filtered = filtered.filter(session => 
        filters.sessionStatus.some(status => 
          session.status?.toLowerCase() === status.toLowerCase()
        )
      );
    }

    if (filters.paymentStatus.length > 0) {
      filtered = filtered.filter(session => {
        if (filters.paymentStatus.includes('payment received')) {
          return session.status?.toLowerCase().includes('payment received');
        }
        if (filters.paymentStatus.includes('payment pending')) {
          return session.paymentStatus?.toLowerCase() === 'payment pending';
        }
        if (filters.paymentStatus.includes('payment failed')) {
          return session.paymentStatus?.toLowerCase() === 'payment failed';
        }
        return false;
      });
    }

    if (filters.timePeriod) {
      const now = new Date();
      
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.date);
        
        switch (filters.timePeriod) {
          case 'today':
            return sessionDate.toDateString() === now.toDateString();
          case 'thisWeek': {
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);
            
            return sessionDate >= weekStart && sessionDate <= weekEnd;
          }
          case 'thisMonth': {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            return sessionDate >= monthStart && sessionDate <= monthEnd;
          }
          default:
            return true;
        }
      });
    }

    setFilteredSessions(filtered);
  };

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Past Sessions</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <SessionFilters onFilterChange={handleFilterChange} />
          {/* <button className="p-2 hover:bg-gray-50 rounded-full">
            <PencilIcon className="w-5 h-5 text-gray-400" />
          </button> */}
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <SessionDetailsCard key={session.id} session={session} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No sessions match the selected filters
          </div>
        )}
      </div>
    </div>
  );
}