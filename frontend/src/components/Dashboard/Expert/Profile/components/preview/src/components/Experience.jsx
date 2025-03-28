import React from 'react';
import { format } from 'date-fns';
import { FileBadge2 } from 'lucide-react';

const Experience = ({ workExperiences }) => {
  if (!workExperiences || workExperiences.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <FileBadge2 className='text-[#16A348] w-6 h-6' />
        <h3 className="text-xl font-semibold text-gray-800">Work Experience</h3>
      </div>
      <ul className="space-y-4">
        {workExperiences.map((exp, index) => (
          <li key={index} className="text-gray-700 border-b pb-4 last:border-b-0">
            <h3 className="text-lg font-semibold">{exp.companyName}</h3>
            <p className="text-gray-500">{exp.jobTitle}</p>
            <p className="text-sm text-gray-400">
              {exp.startDate ? format(new Date(exp.startDate), 'MMM yyyy') : 'N/A'} - 
              {exp.currentlyWork ? ' Present' : exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'N/A'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Experience;
