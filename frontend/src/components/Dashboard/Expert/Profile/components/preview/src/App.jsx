import React from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileInfo from './components/ProfileInfo';
import Expertise from './components/Expertise';
import ServicesOffered from './components/ServicesOffered/ServicesOffered';
import ExperienceList from './components/Experience/ExperienceList';
import EducationCertifications from './components/EducationCertifications';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import { useSelector } from 'react-redux';

function App({ formData, profileImage, coverImage }) {
  const { basic, expertise, education, experience, certifications, services } = formData;
  const { expertData, loading, error } = useSelector((state) => state.auth);

  const expert = expertData && typeof expertData === "string" ? JSON.parse(expertData) : expertData;
  // console.log("This is expert",expert)
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <ProfileHeader
        firstName={expert?.firstName || ''}
        lastName={expert?.lastName || ''}
        city={expert?.city || ''}
        nationality={expert?.nationality || ''}
        professionalTitle={expert?.credentials.professionalTitle || ''}
        profileImage={expert?.profileImage?.secure_url || ''}
        coverImage={expert?.coverImage?.secure_url || ''}
      />
      {/* Add margin-top to account for the overlapping profile section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="md:col-span-2 order-1">
            <ProfileInfo
              bio={expert.bio || ''}
              languages={JSON.parse(expert?.languages?.[0] || "[]").map(lang => lang.label)}
            />
            <Expertise skills={expert.credentials.skills || []} />
            <ServicesOffered services={expert.credentials.services || []} />
          </div>

          {/* Sidebar content - will appear below services in mobile */}
          <div className="md:col-span-1 order-3 md:order-2">
            <ExperienceList experiences={expert.credentials.work_experiences} />
            <EducationCertifications
              education={expert.credentials.education || []}
              certifications={expert.credentials.certifications_courses || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;