import React from 'react';

const EducationItem = ({ degree, institution, year }) => (
  <div className="mb-4">
    <h3 className="text-black text-base font-medium">{degree}</h3>
    <p className="text-[#475467] text-sm">{institution}, {year}</p>
  </div>
);

export default EducationItem;