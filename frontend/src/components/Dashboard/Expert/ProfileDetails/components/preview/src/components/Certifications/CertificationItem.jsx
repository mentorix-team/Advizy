import React from 'react';
import { FaEye } from 'react-icons/fa';

const CertificationItem = ({ name, organization, date, certificate }) => (
  <div className="mb-4">
    <h3 className="text-black text-base font-medium">{name}</h3>
    <p className="text-[#475467] text-sm">{organization}</p>
    <p className="text-[#475467] text-sm rounded-38px bg-#F3F4F6">Issued: {date}</p>
    {certificate && (
      <button 
        className="mt-2 flex items-center gap-2 text-primary hover:text-green-600 text-sm"
        onClick={() => window.open(URL.createObjectURL(certificate))}
      >
        <FaEye /> View Certificate
      </button>
    )}
  </div>
);

export default CertificationItem;