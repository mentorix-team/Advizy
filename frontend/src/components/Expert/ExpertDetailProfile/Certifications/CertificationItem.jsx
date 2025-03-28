import React from 'react';

const CertificationItem = ({ year, name, organization }) => (
  <div className="flex flex-col gap-1 mb-4">
    <span className="text-black text-md font-medium">{name}</span>
    <span className="text-gray-600 text-sm">{organization}</span> {/* Organization below name */}
    <span className="text-[#475467] text-sm">{year}</span> {/* Year below organization */}
  </div>
);

export default CertificationItem;
