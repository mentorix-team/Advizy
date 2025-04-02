import React from 'react';
import { motion } from 'framer-motion';

const ExpertHomeCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-row justify-center w-full"
    >
      <div className="w-[289px] mx-auto mt-[41px] bg-neutral-50 rounded-lg shadow-md border border-solid border-[#00000040] p-5">
        <div className="flex flex-col items-center">
          {/* Profile Image Skeleton */}
          <div className="py-2.5">
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-gray-200 animate-pulse" />
          </div>

          {/* Rating Skeleton */}
          <div className="flex items-center gap-[1.22px] mt-6">
            <div className="w-[14.64px] h-[14.64px] bg-gray-200 rounded-full animate-pulse" />
            <div className="w-8 h-5 bg-gray-200 rounded animate-pulse ml-1" />
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse ml-1" />
          </div>

          {/* Name and Title Skeleton */}
          <div className="flex flex-col items-center w-full mt-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mt-2" />
          </div>

          {/* Bottom Section Skeleton */}
          <div className="flex w-full items-center justify-between mt-6">
            <div className="flex flex-col">
              <div className="h-[18px] w-32 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-[18px] w-28 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="h-[27px] w-24 bg-gray-200 rounded-[9px] animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertHomeCard;