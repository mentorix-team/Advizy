import React from 'react';
import EducationList from './Education/EducationList';
import CertificationList from './Certifications/CertificationList';

const EducationCertifications = ({ education, certifications }) => {
  return (
    <div className="space-y-6">
      <EducationList education={education} />
      <CertificationList certifications={certifications} />
    </div>
  );
};

export default EducationCertifications;
