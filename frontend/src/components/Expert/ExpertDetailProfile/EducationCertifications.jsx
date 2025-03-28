import React from 'react';
import EducationList from './Education/EducationList';
import CertificationList from './Certifications/CertificationList';
import Experience from '@/components/Dashboard/Expert/Profile/components/preview/src/components/Experience';

const EducationCertifications = ({ education, certifications, workExperiences }) => {
  return (
    <div className="space-y-6">
      <EducationList education={education} />
      <CertificationList certifications={certifications} />
      <Experience workExperiences={workExperiences}/>
    </div>
  );
};

export default EducationCertifications;
