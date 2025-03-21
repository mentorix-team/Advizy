import React from 'react';

const ProfileHeader = ({ firstName, lastName, city, nationality, professionalTitle, profileImage, coverImage }) => {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-[200px] sm:h-[300px] w-full bg-gray-200">
        {coverImage && (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        )}
      </div>
      
      {/* Profile Section */}
      <div className="absolute left-0 w-full px-4 sm:px-6 lg:px-8" style={{ bottom: '-80px' }}>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-3xl">
          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Profile Image */}
            <div className="relative -mt-16 md:-mt-20">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : null}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-left">
              <h1 className="text-black font-figtree text-2xl md:text-4xl font-medium leading-[120%] mb-2">
                {firstName} {lastName}
              </h1>
              <p className="text-black font-figtree text-lg md:text-xl font-normal leading-[140%]">
                {professionalTitle}
              </p>
              <p className="flex items-center mt-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" fill="none" className="mr-2">
                  <path d="M11 12.375C10.3201 12.375 9.65552 12.1734 9.09023 11.7957C8.52494 11.418 8.08434 10.8811 7.82417 10.253C7.56399 9.62486 7.49592 8.93369 7.62855 8.26688C7.76119 7.60007 8.08858 6.98757 8.56932 6.50682C9.05007 6.02608 9.66257 5.69869 10.3294 5.56605C10.9962 5.43342 11.6874 5.50149 12.3155 5.76167C12.9436 6.02184 13.4805 6.46244 13.8582 7.02773C14.2359 7.59302 14.4375 8.25763 14.4375 8.9375C14.4364 9.84885 14.0739 10.7226 13.4295 11.367C12.7851 12.0114 11.9113 12.3739 11 12.375Z" fill="black"/>
                </svg>
                {city}, {nationality}
              </p>

              {/* Rating & Badge */}
              <div className="flex flex-col md:flex-row md:items-center mt-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="text-lg font-medium">4.9</span>
                  <span className="text-gray-500 text-sm">(120 reviews)</span>
                </div>
                <div className="bg-green-50 text-primary px-3 py-1 rounded-full text-sm text-center mt-2 md:mt-0">
                  Top Rated
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
