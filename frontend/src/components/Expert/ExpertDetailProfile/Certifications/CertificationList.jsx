import React from 'react';
import CertificationItem from './CertificationItem';
import { CertificationIcon } from '@/icons/Icons';

const CertificationList = ({ certifications }) => {
  // If no certifications are passed, show a fallback message
  if (!certifications || certifications.length === 0) {
    return <p>No certifications available.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <CertificationIcon className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Certifications</h2>
      </div>
      {certifications.map((cert, index) => (
        <CertificationItem
          key={index}
          year={cert.year}
          name={cert.name}
        />
      ))}
    </div>
  );
};

export default CertificationList;
