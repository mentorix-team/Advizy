import React from "react";

const NotificationSkeleton = () => {
  // Create an array of 3 items to render multiple skeleton rows
  const skeletonItems = Array(3).fill(0);

  return (
    <div className="w-full">
      {skeletonItems.map((_, index) => (
        <div key={index} className="p-4 border-b animate-pulse">
          {/* Title skeleton */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          
          {/* Timestamp skeleton */}
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
          
          {/* Button skeleton - appears in some notifications */}
          <div className="h-8 bg-gray-200 rounded w-1/2 mt-2"></div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;