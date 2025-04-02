import { LocateIcon } from "lucide-react";
import React from "react";

const ProfileHeader = ({
  firstName,
  lastName,
  city,
  nationality,
  professionalTitle,
  profileImage,
  coverImage,
}) => {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-[200px] sm:h-[300px] w-full bg-gray-200">
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Section */}
      <div
        className="absolute left-0 w-full px-4 sm:px-6 lg:px-8"
        style={{ bottom: "-80px" }}
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-3xl">
          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Profile Image */}
            <div className="relative -mt-16 md:-mt-20">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
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
                <MapPin className='w-4 h-4'/>
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
