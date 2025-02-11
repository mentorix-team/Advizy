import React from 'react';

const CertificationItem = ({ year, name }) => (
  <div className="flex gap-4 mb-3">
    <span className="text-[#475467] text-sm">{year}</span>
    <span className="text-black text-sm font-medium">{name}</span>
  </div>
);

export default CertificationItem;