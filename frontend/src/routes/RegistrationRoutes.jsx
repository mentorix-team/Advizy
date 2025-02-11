import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import Availability from '../pages/registration/Availability';
import ExpertBasicInfo from '@/components/ExpertForms/ExpertBasicInfo';
import ExpertProfessionalSkills from '@/components/ExpertForms/ExpertProfessionalSkills';
import ExpertExperience from '@/components/ExpertForms/ExpertExperience';
import ExpertEducation from '@/components/ExpertForms/ExpertEducation';
import ExpertCertification from '@/components/ExpertForms/ExpertCertification';
import ExpertBioPhoto from '@/components/ExpertForms/ExpertBioPhoto';
import FinalPreview from '@/components/ExpertForms/Previews/FinalPreview';

const RegistrationRoutes = () => {
  return (
    <Routes>
      <Route path="basic" element={<ExpertBasicInfo />} />
      <Route path="professional-skills" element={<ExpertProfessionalSkills />} />
      <Route path="experience" element={<ExpertExperience />} />
      {/* <Route path="availability" element={<Availability />} /> */}
      <Route path="education" element={<ExpertEducation />} />
      <Route path="certifications" element={< ExpertCertification/>} />
      <Route path="profile-photo" element={<ExpertBioPhoto />} />
      <Route path="profile-photo" element={<ExpertBioPhoto />} />
      <Route path="preview" element={<FinalPreview />} />
    </Routes>
  );
};

export default RegistrationRoutes;
