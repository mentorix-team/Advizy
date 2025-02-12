import React from 'react';

const ExperienceItem = ({ companyName, jobTitle, startDate, endDate, currentlyWork }) => (
  <div className="mb-4">
    <h3 className="text-black text-base font-medium">{jobTitle}</h3>
    <p className="text-[#475467] text-sm">{companyName}</p>
    <p className="text-[#475467] text-sm">
      {startDate} - {currentlyWork ? 'Present' : endDate}
    </p>
  </div>
);

export default ExperienceItem;