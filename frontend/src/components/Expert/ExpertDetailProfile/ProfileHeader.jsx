import {
  LocationIcon,
  RatingStarIcon,
  ShareIcon,
  VerifiedTickIcon,
} from "@/icons/Icons";
import React, { useState } from "react";
import Share from "@/utils/ShareButton/Share";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const ProfileHeader = ({
  name,
  coverImage,
  title,
  location,
  rating,
  reviewsCount,
  image,
  isTopRatedVisible,
  toggleTopRated,
  redirect_uri,
  isAdminApproved,
}) => {
  console.log("this is redirecturl", redirect_uri);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Function to open the share modal
  const openShareModal = () => {
    setIsShareOpen(true);
  };

  // Function to close the share modal
  const closeShareModal = () => {
    setIsShareOpen(false);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="relative w-full">
      {/* Updated background with an image */}
      <div
        className="h-48 w-full"
        style={{
          backgroundImage: `url(${coverImage})`, // Corrected background image syntax
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "lightgray", // Optional fallback color
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 bg-white rounded-lg p-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div
              className="flex-shrink-0"
              style={{
                width: "172px",
                height: "189px",
                borderRadius: "20px",
                background: `url(${image}) lightgray 50% / cover no-repeat`,
              }}
            ></div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-black font-figtree text-4xl font-medium leading-[120%] mb-2 flex gap-2 items-center">
                    {name}
                    {isAdminApproved && (
                      <img src="/svg-image-65.svg" alt="verified tick" />
                    )}
                  </h1>
                  <p className="text-black font-figtree text-xl font-normal leading-[140%]">
                    {title || "Career Coach & Leadership Mentor"}
                  </p>
                  {/* Location Section */}
                  <p className="flex items-center mt-2 text-gray-700">
                    <LocationIcon className="w-5 h-5" />
                    {location || "Unknown Location"}
                  </p>
                  {/* Ratings Section */}
                  <div className="flex items-center gap-1 mt-2">
                    <RatingStarIcon className="w-6 h-6" />
                    <span className="text-gray-800 font-medium">
                      {rating || 0}
                    </span>
                    <span className="text-gray-600">
                      ({reviewsCount || 0} reviews)
                    </span>
                  </div>
                  {/* Verified and Top Rated Badges */}
                  <div className="flex items-center gap-2 mt-2">
                    {isTopRatedVisible && ( // Conditionally render the Top Rated badge
                      <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M11.083 5.10403C11.433 4.30403 12.568 4.30403 12.917 5.10403L14.669 9.12603C14.7416 9.29242 14.8582 9.43589 15.0061 9.54107C15.1541 9.64624 15.3279 9.70914 15.509 9.72303L19.972 10.065C20.872 10.134 21.227 11.265 20.528 11.836L17.198 14.559C17.0513 14.679 16.9417 14.8383 16.8821 15.0181C16.8224 15.198 16.8151 15.3911 16.861 15.575L17.891 19.694C18.105 20.552 17.181 21.246 16.417 20.8L12.504 18.519C12.351 18.4298 12.1771 18.3827 12 18.3827C11.8229 18.3827 11.6489 18.4298 11.496 18.519L7.58296 20.8C6.81896 21.246 5.89496 20.552 6.10896 19.694L7.13896 15.575C7.18441 15.3911 7.17667 15.1981 7.11665 15.0184C7.05664 14.8387 6.94681 14.6797 6.79996 14.56L3.46996 11.837C2.77196 11.266 3.12796 10.135 4.02696 10.066L8.48896 9.72403C8.66998 9.71014 8.8438 9.64724 8.99179 9.54207C9.13977 9.43689 9.25633 9.29342 9.32896 9.12703L11.083 5.10403Z"
                            stroke="#128807"
                            strokeWidth="2"
                          />
                        </svg>
                        <span className="text-[#128807] text-center font-figtree text-[16px] font-semibold leading-[24px]">
                          Top Rated
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-6">
                  {/* <div
                    onClick={toggleFavorite}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className={`p-2 rounded-full shadow ${
                        isFavorited ? "bg-red-100" : "border border-gray-300"
                      }`}
                    >
                      {isFavorited ? (
                        <FaHeart className="text-xl transition-all duration-300 ease-out text-red-500 scale-110" />
                      ) : (
                        <FaRegHeart className="text-xl transition-all duration-300 ease-out text-black" />
                      )}
                    </div>
                  </div> */}
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                      {/* Share Button */}
                      <button
                        className="border border-gray-300 p-2 rounded-full hover:bg-gray-100 transition"
                        onClick={openShareModal}
                      >
                        <ShareIcon className="w-6 h-6" />
                      </button>

                      {/* Share Modal */}
                      {isShareOpen && (
                        <Share
                          onClose={closeShareModal}
                          redirect_url={redirect_uri}
                        />
                      )}
                    </div>
                  </div>
                  {/* Button to toggle Top Rated badge */}
                  {/* <button
                    className="px-3 py-1 text-sm bg-gray-200 rounded-full"
                    onClick={toggleTopRated}
                  >
                    Toggle Top Rated
                  </button> */}
                </div>
              </div>
              <div className="mt-4 text-right">
                {/* <p className="text-sm text-gray-600">Starts from</p>
                <p className="text-xl font-bold">$80/hr</p> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
