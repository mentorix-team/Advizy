import React from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileInfo from './components/ProfileInfo';
import Expertise from './components/Expertise';
import ServicesOffered from './components/ServicesOffered/ServicesOffered';
import ExperienceList from './components/Experience/ExperienceList';
import EducationCertifications from './components/EducationCertifications';
import Reviews from './components/Reviews';
import FAQ from './components/FAQ';
import { useDispatch, useSelector } from 'react-redux';
import { getmeasexpert } from '@/Redux/Slices/expert.Slice';
// import Spinner from '@/LoadingSkeleton/Spinner';
import Spinner from '@/components/LoadingSkeleton/Spinner';

const MAX_SOCIAL_LINKS = 4;

const parseSocialLinks = (rawLinks) => {
  if (!rawLinks) return [];

  const collected = new Set();

  const processValue = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(processValue);
      return;
    }
    if (typeof value !== 'string') return;

    const trimmed = value.trim();
    if (!trimmed) return;

    const looksJson =
      (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      (trimmed.startsWith('{') && trimmed.endsWith('}'));

    if (looksJson) {
      try {
        const parsed = JSON.parse(trimmed);
        processValue(parsed);
        return;
      } catch (error) {
        // treat as literal when parsing fails
      }
    }

    if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
      try {
        const parsed = JSON.parse(trimmed);
        processValue(parsed);
        return;
      } catch (error) {
        // fallback to trimmed literal value
      }
    }

    collected.add(trimmed);
  };

  processValue(rawLinks);

  return Array.from(collected).slice(0, MAX_SOCIAL_LINKS);
};

function App({ formData, profileImage, coverImage }) {
  const { basic, expertise, education, experience, certifications, services } = formData;
  const { expertData, loading, error } = useSelector((state) => state.expert);
  const dispatch = useDispatch()
  // useEffect(()=>{
  //   dispatch(getmeasexpert())
  // },[dispatch])

  if (loading) {
    <Spinner />
  }
  const expert = expertData && typeof expertData === "string" ? JSON.parse(expertData) : expertData;
  // console.log("This is expert", expert);
  const socialLinks = parseSocialLinks(expert?.socialLinks);
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <ProfileHeader
        firstName={expert?.firstName || ''}
        lastName={expert?.lastName || ''}
        city={expert?.city || ''}
        nationality={expert?.nationality || ''}
        professionalTitle={expert?.credentials?.professionalTitle || ''}
        profileImage={expert?.profileImage?.secure_url || ''}
        coverImage={expert?.coverImage?.secure_url || ''}
        reviews={expert?.reviews}
        socialLinks={socialLinks}
      />
      {/* Add margin-top to account for the overlapping profile section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[120px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ProfileInfo
              bio={expert?.bio || ''}
              experienceYears={expert?.credentials?.experienceYears || ''}
              languages={
                Array.isArray(expert?.languages)
                  ? expert.languages.map(lang => lang.label)  // If already an array, map it directly
                  : JSON.parse(expert?.languages || "[]").map(lang => lang.label)  // If string, parse and map
              }
            />

            <Expertise skills={expert?.credentials?.skills || []} />
            <ServicesOffered services={expert?.credentials?.services || []} />
          </div>

          {/* Sidebar content - will appear below services in mobile */}
          <div className="md:col-span-1 order-3 md:order-2">
            <ExperienceList experiences={expert?.credentials?.work_experiences} />
            <EducationCertifications
              education={expert?.credentials?.education || []}
              certifications={expert?.credentials?.certifications_courses || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;