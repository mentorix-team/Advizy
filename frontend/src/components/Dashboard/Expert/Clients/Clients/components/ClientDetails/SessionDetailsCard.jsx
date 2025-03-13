import { useState } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { SessionHeader } from './SessionHeader';
import { SessionContent } from './SessionContent';

export function SessionDetailsCard({ session }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-3 sm:p-4 bg-white">
      <SessionHeader {...session} />

      <div 
        className="flex items-center justify-between cursor-pointer text-gray-600 hover:text-gray-800 mt-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-sm font-medium">Session Details</span>
        {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
      </div>

      {isExpanded && <SessionContent {...session} />}
    </div>
  );
}