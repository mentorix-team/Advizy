import React from 'react';

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
    <span className="text-lg">{icon}</span>
    <div>
      <div className="font-medium text-gray-900">{label}</div>
      <div className="text-gray-600">{value}</div>
    </div>
  </div>
);

const ProfileInfo = ({ bio, experienceYears,languages }) => {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-black font-figtree text-xl font-semibold leading-[150%] mb-4">About Me</h2>
      <p className="text-black font-figtree text-base font-normal leading-[150%] mb-3">
        {bio}
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <InfoItem 
          icon="⏱️"
          label="Experience"
          value={`${experienceYears} years`}
        />
        <InfoItem 
          icon="🌐"
          label="Languages"
          value={languages.join(', ')}
        />
      </div>
    </div>
  );
}

export default ProfileInfo;