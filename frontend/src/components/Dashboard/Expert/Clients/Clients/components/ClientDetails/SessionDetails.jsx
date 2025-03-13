import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export function SessionDetails({ session }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-gray-100 py-6 first:border-0">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 text-gray-500">
          <span>{session.date}</span>
          <span>{session.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm`}>
            {session.status}
          </span>
          {session.paymentStatus && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {session.paymentStatus}
            </span>
          )}
          {session.rating && (
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-4 h-4 ${
                    i < session.rating ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                >
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
          )}
          {isExpanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      
      <h3 className="text-green-600 font-medium mb-1 mt-2">{session.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{session.service}</p>
      
      {isExpanded && (
        <div className="space-y-4 mt-4">
          {session.notes && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Session Notes</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {session.notes}
              </p>
            </div>
          )}
          
          {session.attachments && session.attachments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Attachments</h4>
              <div className="space-y-2">
                {session.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{attachment.name}</span>
                    <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {session.feedback && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Client Feedback</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {session.feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}