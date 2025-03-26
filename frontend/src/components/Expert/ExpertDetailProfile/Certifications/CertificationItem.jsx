import React from 'react';

const CertificationItem = ({ year, name, organization }) => (
  <div className="flex gap-4 mb-3">
    <span className="text-[#475467] text-sm">{year}</span>
    <span className="text-black text-sm font-medium">{name}</span>
    <span className="text-gray-600 text-sm">{organization}</span> {/* Display the organization */}
  </div>
);

export default CertificationItem;
