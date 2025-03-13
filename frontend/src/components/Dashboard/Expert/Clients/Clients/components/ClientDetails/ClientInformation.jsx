import { useState } from 'react';
// import { PencilIcon } from '@heroicons/react/24/outline';
// import { EditClientInformation } from './EditClientInformation';

export function ClientInformation({ service, totalSessions, notes, onUpdate }) {
  // const [isEditing, setIsEditing] = useState(false);

  // const handleSave = (updatedData) => {
  //   onUpdate(updatedData);
  // };

  return (
    <>
      <div className="bg-white rounded-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Client Information</h2>
          {/* <button 
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-50 rounded-full"
          >
            <PencilIcon className="w-5 h-5 text-gray-400" />
          </button> */}
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-gray-600 mb-2">Service</h3>
            <p>{service}</p>
          </div>
          
          <div>
            <h3 className="text-gray-600 mb-2">Total Sessions</h3>
            <p>{totalSessions}</p>
          </div>
          
          {/* <div>
            <h3 className="text-gray-600 mb-2">Notes</h3>
            <p className="break-words">{notes}</p>
          </div> */}
        </div>
      </div>

      {/* {isEditing && (
        <EditClientInformation
          client={{ service, totalSessions, notes }}
          onSave={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )} */}
    </>
  );
}