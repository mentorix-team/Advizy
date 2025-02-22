import React from "react";

const AvailabilitySkeleton = () => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="flex gap-6">
      <div className="flex-1 p-6 space-y-8 animate-pulse">
        <div className="flex gap-4">
          <div className="h-10 w-28 bg-gray-200 rounded-lg" />
          <div className="h-10 w-24 bg-gray-200 rounded-lg" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="h-7 w-48 bg-gray-200 rounded-md" />
          </div>
          {days.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <div className="h-6 w-24 bg-gray-200 rounded-md" />
              <div className="h-10 w-32 bg-gray-200 rounded-md" />
              <div className="px-4">to</div>
              <div className="h-10 w-32 bg-gray-200 rounded-md" />
              <div className="h-8 w-8 bg-gray-200 rounded-full" />
              <div className="h-10 w-24 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <div className="w-80 space-y-6">
        <div className="p-6 bg-white rounded-lg space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded-md" />
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
        </div>

        <div className="p-6 bg-white rounded-lg space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-6 w-48 bg-gray-200 rounded-md" />
            <div className="h-8 w-24 bg-gray-200 rounded-md" />
          </div>
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default AvailabilitySkeleton;