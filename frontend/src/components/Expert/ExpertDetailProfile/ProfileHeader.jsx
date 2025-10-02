import {
  LocationIcon,
  RatingStarIcon,
  ShareIcon,
  VerifiedTickIcon,
} from "@/icons/Icons";
import { IoShareSocialOutline } from "react-icons/io5";
import React, { useState } from "react";
import { motion } from "framer-motion";
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
  onToggleFavourite = () => { },
  favUpdating = false,
  isFavourite,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [pulse, setPulse] = useState(false); // controls one-shot heart animation

  const handleFavouriteClick = () => {
    if (favUpdating) return;
    onToggleFavourite();
    setPulse(true); // trigger animation
  };

  // Function to open the share modal
  const openShareModal = () => {
    setIsShareOpen(true);
  };

  // Function to close the share modal
  const closeShareModal = () => {
    setIsShareOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Updated background with an image */}
      <div
        className="h-60 w-full"
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
          <div className=" relative flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div
              className="flex-shrink-0"
              style={{
                width: "172px",
                height: "189px",
                borderRadius: "20px",
                background: `url(${image}) lightgray 50% / cover no-repeat`, // Corrected background image syntax
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFavouriteClick}
                      disabled={favUpdating}
                      className={`relative flex items-center justify-center border w-10 h-10 border-gray-300 rounded-full text-2xl transition bg-white hover:bg-gray-50 ${favUpdating ? "opacity-60" : ""}`}
                      aria-label="toggle favourite"
                      aria-pressed={isFavourite}
                    >
                      <motion.span
                        initial={false}
                        animate={pulse ? { scale: [1, 1.35, 0.85, 1.15, 1] } : { scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        onAnimationComplete={() => setPulse(false)}
                        className="flex"
                      >
                        {isFavourite ? (
                          <FaHeart className="text-red-500 drop-shadow-sm" />
                        ) : (
                          <FaRegHeart className="text-gray-600" />
                        )}
                      </motion.span>
                      {favUpdating && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-red-200/40" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                      {/* Share Button */}
                      <button
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 transition"
                        onClick={openShareModal}
                      >
                        <IoShareSocialOutline className="w-6 h-6" />
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
                </div>
              </div>
              <div className="mt-4 text-right">
                {/* <p className="text-sm text-gray-600">Starts from</p>
                <p className="text-xl font-bold">$80/hr</p> */}
              </div>
            </div>
          </div>

          {/* Favorite Button */}
          {/* <button
            onClick={onToggleFavourite}
            disabled={favUpdating}
            className={`absolute bottom-4 right-4 flex items-center gap-1 px-3 py-1 rounded text-sm transition ${favUpdating ? " text-red-600" :
              onToggleFavourite ? " text-red-600" :
                "bg-gray-100 text-gray-600 border-gray-300"
              } ${favUpdating ? "opacity-60 animate-pulse" : ""}`}
            aria-label="toggle favourite"
          >
            {isFavourite ? (
              <>
                <FaHeart className="text-red-500" />
              </>
            ) : (
              <>
                <FaRegHeart />
              </>
            )}
          </button> */}

        </div>
      </div>
    </div >
  );
};

export default ProfileHeader; 